# A Year in Motion — Club 1600 SAA Portfolio

A public, mobile-first editorial portfolio documenting the 2026–2027 Sergeant-at-Arms term for **Amar Pearson**, First Bahamas Branch of Toastmasters Club 1600.

This is an independent activity archive, **not** an official Toastmasters International website. The repository does not contain the Toastmasters logo.

## What the site does

- Photo-led highlights and an indexed, searchable timeline
- Filters for category, reporting quarter, and activity status
- Transparent **Led / Coordinated / Supported / Created** role attribution
- Detail pages (in-page overlay) with results, credits and evidence links
- Print-friendly layout to save as PDF
- Public-facing metrics from verified activity records
- **No-code updates using a GitHub Issue form** (see below)

## Add an activity in two minutes

1. Open [**Add Portfolio Entry**](https://github.com/PearsonLegacyVentures/portfolio-/issues/new?template=portfolio-entry.yml) while signed in to the `PearsonLegacyVentures` account.
2. Complete the form: date, title, category, role, status, summary, impact, any figures, and photos.
3. **Submit the issue.** A GitHub Actions workflow converts your entry into the website's data file automatically, and GitHub Pages republishes the site.
4. To update an existing entry, create another form submission and enter the existing entry ID in the optional **Entry ID to update** field, or edit your original Issue if it was created through this form.
5. For photos, attach images directly in the form's media field. GitHub creates a Markdown image URL that the portfolio will display. Only upload images you have permission to publish.

**Access restriction:** the publishing workflow only processes entries created by the repository owner. It does not process submissions from random public visitors.

If the workflow does not run, check repository **Settings → Actions → General** to enable Actions and allow GitHub Actions read/write permissions. The workflow explicitly requests `contents: write`.

## Publishing

The site is plain HTML, CSS, JavaScript and JSON. No npm packages or build are required.

For **GitHub Pages**: go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. The `Deploy portfolio` workflow is included. After the initial run, the site will be available at:

https://pearsonlegacyventures.github.io/portfolio-/

For Cloudflare Pages, create a Pages project pointing to this repository; set Framework preset to **None**, output directory to `/`, and leave the build command blank.

## Portfolio data model

Portfolio entries live in `data/entries.json` and follow this structure:

```json
{
  "id": "unique-slug",
  "date": "2026-08-29",
  "title": "Event name",
  "category": "Community Service",
  "status": "completed",
  "role": "Coordinated",
  "summary": "Short description of what happened.",
  "impact": "Confirmed result, or a note that details are pending.",
  "highlights": ["One accomplishment", "Another accomplishment"],
  "metrics": [{"label": "Student packages distributed", "value": "200"}],
  "images": ["https://example.com/your-event-photo.jpg"],
  "links": [{"label": "Evidence", "url": "https://..."}],
  "credit": "Recognize the members and partners involved.",
  "featured": false
}
```

Supported statuses: `completed`, `active`, `planning`. Activities under planning/active are intentionally **not** counted as completed events. Example entries distinguish completed deliverables from anticipated outcomes.

## Editorial policy

This is **Amar's record of his contributions**, not a claim that every Club 1600 initiative was done alone. Every entry should name the actual contribution and acknowledge colleagues where appropriate. Avoid unsupported attendance numbers or descriptions such as "successful" unless confirmed after an event.

The initial records are a **working archive** based on prior Club 1600 project documentation. Please check dates, status, photos, and impacts before distributing the final year-end report.

## Recommended weekly ritual

Spend five minutes each Sunday adding any new accomplishments and photos. By year-end, this portfolio will already be up to date. Use the **Save / print PDF** button when you want a report copy.

## Maintenance

- `index.html` — semantic layout
- `styles.css` — visual design and print rules
- `app.js` — filtering, detail viewer, metrics, entry rendering
- `data/entries.json` — source-of-truth entries
- `.github/ISSUE_TEMPLATE/portfolio-entry.yml` — no-code entry form
- `.github/workflows/sync-portfolio-entry.yml` + `scripts/sync_issue.py` — publishing new entries
- `.github/workflows/deploy.yml` — GitHub Pages deployment

No secrets or personal credentials are necessary.