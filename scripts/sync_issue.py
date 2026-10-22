#!/usr/bin/env python3
"""Convert an owner-submitted GitHub portfolio Issue Form to data/entries.json."""
import json
import os
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data" / "entries.json"
ALLOWED_CATEGORIES = {
    "Community Service", "Member Fellowship", "Club Operations",
    "Events & Hospitality", "Brand & Digital", "Speaking & Training",
    "Strategy & Planning",
}
STATUS = {"Completed": "completed", "In motion": "active", "On the horizon": "planning"}
CONTRIBUTION = {"Led", "Coordinated", "Created", "Supported", "Participated", "Planned"}
EMPTY = {"_No response_", "None", "N/A", "", "-"}
IMAGE_MARKDOWN = re.compile(r"!\[[^]]*\]\((https?://[^)\s]+)(?:\s+[^)]*)?\)", re.I)
RAW_URL = re.compile(r"https?://[^\s<>)\]]+", re.I)


def clean(v):
    s = (v or "").strip()
    return "" if s in EMPTY else s


def safe_url(v):
    v = v.strip().strip("<>").rstrip(".,;")
    parts = urlsplit(v)
    return v if parts.scheme in ("http", "https") and parts.netloc else ""


def sections(body):
    result = {}
    pieces = re.split(r"(?m)^###\s+(.+?)\s*$", body or "")
    for n in range(1, len(pieces), 2):
        result[pieces[n].strip()] = clean(pieces[n + 1])
    return result


def lines(value):
    return [x.strip("-• \t") for x in value.splitlines() if clean(x)]


def extract_photos(raw):
    found = []
    for url in IMAGE_MARKDOWN.findall(raw):
        u = safe_url(url)
        if u and u not in found:
            found.append(u)
    for line in raw.splitlines():
        # Entire link on its own line, including Markdown-rendered attachment links.
        match = re.search(r"https?://[^\s<>)\]]+", line)
        if match:
            u = safe_url(match.group(0))
            if u and u not in found:
                found.append(u)
    return found[:25]


def pairs(raw, key="metric"):
    result = []
    for line in lines(raw):
        if "|" not in line:
            continue
        left, right = [part.strip() for part in line.split("|", 1)]
        if not left or not right:
            continue
        if key == "metric":
            result.append({"label": left[:120], "value": right[:90]})
        else:
            u = safe_url(right)
            if u:
                result.append({"label": left[:120], "url": u})
    return result[:20]


def main():
    with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as fp:
        event = json.load(fp)
    issue = event["issue"]
    owner = os.environ.get("GITHUB_REPOSITORY_OWNER", "")
    if issue.get("user", {}).get("login", "").lower() != owner.lower():
        raise SystemExit("Ignoring issues that are not submitted by the repository owner.")
    if issue.get("title", "").startswith("[Media]"):
        vals = sections(issue.get("body", ""))
        target_id = vals.get("Existing Entry ID", "")
        records = json.loads(DEST.read_text(encoding="utf-8"))
        target = next((x for x in records if x.get("id") == target_id), None)
        if target is None:
            raise SystemExit("Entry ID not found: " + target_id)
        target.setdefault("images", [])
        target.setdefault("videos", [])
        for url in extract_photos(vals.get("More photos", "")):
            if url not in target["images"]:
                target["images"].append(url)
        for url in extract_photos(vals.get("Video links", "")):
            if not any((v.get("url") if isinstance(v, dict) else v) == url for v in target["videos"]):
                target["videos"].append({"url": url, "label": "Event video"})
        for key, name in (("before", "Before photo"), ("after", "After photo")):
            found = extract_photos(vals.get(name, ""))
            if found:
                target.setdefault("beforeAfter", {})[key] = found[0]
        DEST.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Media added to " + target_id)
        return

    title = re.sub(r"^\[Portfolio\]\s*", "", issue.get("title", "")).strip()
    values = sections(issue.get("body", ""))
    try:
        day = date.fromisoformat(values["Activity date"])
    except (ValueError, KeyError) as exc:
        raise SystemExit("Please use a valid YYYY-MM-DD in Activity date.") from exc
    category = values.get("Category", "")
    status = values.get("Status", "")
    role = values.get("My contribution", "")
    if category not in ALLOWED_CATEGORIES or status not in STATUS or role not in CONTRIBUTION:
        raise SystemExit("Choose a supported category, status and contribution from the form.")
    if not title or len(title) > 180:
        raise SystemExit("Add an informative title after [Portfolio], max 180 characters.")
    if not values.get("Summary") or not values.get("Confirmed outcome"):
        raise SystemExit("Summary and Confirmed outcome are required.")
    manual_id = values.get("Entry ID to update (optional)", "")
    entry_id = manual_id if re.fullmatch(r"[a-z0-9][a-z0-9-]{1,100}", manual_id) else f"issue-{issue['number']}"
    prior = next((r for r in json.loads(DEST.read_text(encoding="utf-8")) if r.get("id") == entry_id), {})
    story_type = values.get("Where should this story appear?", "General record")
    collection_map = {"Monthly Lab journal": ("Labs", "lab"), "Meeting room and operations": ("Meeting Operations", "operations"), "Digital build log": ("Digital Projects", "build"), "Member development": ("Member Development", "event")}
    fallback_collection = {"Member Fellowship": "Social & Fellowship", "Community Service": "Community Impact", "Club Operations": "Meeting Operations", "Brand & Digital": "Digital Projects", "Speaking & Training": "Learning & Development", "Strategy & Planning": "Strategy", "Events & Hospitality": "Events"}
    collection, story_kind = collection_map.get(story_type, (fallback_collection.get(category, "Events"), "event"))
    record = {
        **prior,
        "month": day.strftime("%Y-%m"),
        "dateLabel": "",
        "collection": collection,
        "type": story_kind,
        "id": entry_id,
        "date": day.isoformat(),
        "title": title,
        "category": category,
        "status": STATUS[status],
        "role": role,
        "summary": values["Summary"][:1600],
        "impact": values["Confirmed outcome"][:3000],
        "highlights": lines(values.get("Highlights (one per line)", ""))[:20],
        "metrics": pairs(values.get("Metrics (one per line: label | value)", "")),
        "images": extract_photos(values.get("Photos (paste links or drag images here)", "")),
        "videos": [{"label": "Event video", "url": url} for url in extract_photos(values.get("Video URLs (one per line)", ""))],
        "links": pairs(values.get("Evidence links (label | URL)", ""), key="link"),
        "credit": values.get("Recognition / collaborators", "")[:1600],
        "featured": values.get("Featured story?", "") == "Yes",
    }
    records = json.loads(DEST.read_text(encoding="utf-8"))
    updated = False
    for index, existing in enumerate(records):
        if existing.get("id") == entry_id:
            records[index] = record
            updated = True
            break
    if not updated:
        records.append(record)
    records.sort(key=lambda x: (x["date"], x["id"]), reverse=True)
    DEST.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f'{"Updated" if updated else "Created"} entry {entry_id}: {title}')


if __name__ == "__main__":
    main()
