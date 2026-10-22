# Club 1600 — A Year in Motion

A visual, chronological SAA portfolio for the First Bahamas Branch of Toastmasters Club 1600, documenting Amar Pearson's 2026–2027 service year.

**Repository:** https://github.com/PearsonLegacyVentures/portfolio-

## What is on the site

- An editorial front page styled to match the existing `club1600.org` website — Montserrat/Source Sans 3, Toastmasters blue, maroon, white and yellow
- Ten opening **story chapters** including youth leadership and informal member fellowship: installation, meeting room, Neil Percentie Back2School, new member orientation, In-Club Leadership Tour, monthly Labs, Q1 social and OPM meeting
- A clickable **July 2026–June 2027** month-by-month roadmap
- A growing photo journal of **meeting room setups and atmosphere**
- The Office of the Prime Minister **before/after room** comparison, with photo slots
- **Lab photos by month**, populated by new Lab entries
- A **Build Log** for `club1600.org`, the membership roll-call deck, SAA financial tracker and more
- A complete searchable archive, with photos, videos, data and acknowledgements in each story
- A fully generated **annual report** at `report.html`, with month chapters, figures, linked evidence and photo galleries, ready for **Print → Save as PDF**

## The easiest way to update

**Already have a story and just want to add media?**

Use the [Add photos and videos](https://github.com/PearsonLegacyVentures/portfolio-/issues/new?template=portfolio-media.yml) form. Enter the existing **Entry ID**, then drag in your images or paste links. It will **append** new images rather than deleting existing photographs. You can also provide a video URL or separate **before** and **after** photographs.

**Have a new activity, Lab or digital build?**

Use the [Add a portfolio story](https://github.com/PearsonLegacyVentures/portfolio-/issues/new?template=portfolio-entry.yml) form. Enter a date, category, journal type, status, your role, description, and any photos. Choose **Monthly Lab journal** and the story automatically appears in the correct month's Lab gallery.

Both Issue forms are processed by a GitHub Actions workflow and modify `data/entries.json`. Only issues submitted by the repository owner can publish changes.

**Important:** All content in this public repository and its forms is potentially public. Get consent for photos of members and guests where appropriate, especially membership slides, and never upload private contact information or sensitive club records.

## Which photo is which?

- **Installation:** use the actual executive installation ceremony photos.
- **Room setup:** use arrival, setup, seating plans, food/bar prep and general atmosphere photos.
- **Neil Percentie:** add package-preparation, distribution, activities, donors and volunteer photos; a verified existing event montage is already linked in the story.
- **New Members Orientation & In-Club Leadership Tour:** galleries are reserved; dates and detailed outcomes still need confirmation.
- **Lab journal:** create an entry per Lab session, choose `Monthly Lab journal`, and attach photos.
- **Q1 Social:** add your photographs and post-event attendance/outcome recap.
- **OPM:** update `2026-opm-meeting-logistics` using the media form's **before** and **after** fields.
- **Build Log:** screenshots from `club1600.org`, member roll-call deck, meeting attire, tools, and finished graphics.

### Entry IDs you can paste into the media form

| Chapter | Entry ID |
| --- | --- |
| Installation | `2026-installation` |
| The room | `2026-operations-and-reception` |
| Neil Percentie | `2026-neil-percentie-jamboree` |
| Orientation | `2026-new-member-orientation` |
| Leadership Tour | `2026-in-club-leadership-tour` |
| Lab overview | `2026-lab-photo-journal` |
| Q1 Social | `2026-1600-degreez` |
| OPM transformation | `2026-opm-meeting-logistics` |
| Club website | `2026-club1600-site` |
| Membership deck | `2026-membership-roll-deck` |

Other IDs are listed in `data/entries.json` and at the bottom of each story.

## Running and publishing

The portfolio is **static HTML, CSS, JavaScript and JSON**. No install or build command is required.

**GitHub Pages:** Enable it at repository **Settings → Pages → Source: GitHub Actions**. The deployment workflow lives in `.github/workflows/deploy.yml`. Once enabled, the site should publish to `https://pearsonlegacyventures.github.io/portfolio-/`.

**Cloudflare Pages:** Import this repository, framework preset **None**, no build command, output `/`.

It works locally via a simple static file server (`python3 -m http.server 8000`). The site loads `data/entries.json` using `fetch`, so opening `index.html` directly as a `file://` URL will not show the data.

## About accuracy

The initial entries were drafted from the documented work and this project conversation. The Neil Percentie figures are from the completed event report. Other timelines, counts and outcomes should be confirmed before using the portfolio as a final official record.

The portfolio distinguishes contributions from group accomplishments and preserves uncertain dates as **To confirm** rather than inventing them. There is no Toastmasters International logo because this is an independent personal service portfolio.

## Files

- `index.html` — main layout
- `styles.css` — visual design
- `app.js` — calendar, archive, galleries and story display
- `report.html`, `report.css`, `report.js` — consistent printable monthly PDF report
- `data/entries.json` — all stories and assets
- `.github/ISSUE_TEMPLATE/portfolio-entry.yml` — new story form
- `.github/ISSUE_TEMPLATE/portfolio-media.yml` — quick upload form
- `scripts/sync_issue.py` — preserves entries and attaches new media
- `.github/workflows/` — publishing/deployment

## Photo and video archive update · October 2026

Twenty-six web-optimized photographs and one 37-second Dirty Diana cocktail video are committed under `assets/portfolio/`. They appear in Installation, Meeting Room & Hospitality, Dynamic Youth in Action, 1600 Degreez Q1 Social, Member Fellowship and Recognition. Image captions are stored per entry in `data/entries.json` using `imageCaptions`; dates and attendance figures not yet confirmed remain marked for later verification.
