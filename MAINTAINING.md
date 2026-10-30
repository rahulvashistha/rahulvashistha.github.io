# Maintaining this portfolio

This manual is for whoever edits the site next: me, or an AI assistant I hand it to. It explains how the site is built, where every piece of content lives, the rules the content follows, and how to check changes before publishing.

Live site: https://rahulvashistha.github.io
Repository: https://github.com/rahulvashistha/rahulvashistha.github.io

---

## 1. How the site works

The site is plain HTML, CSS and JavaScript. There is no build step, no framework and no package manager. GitHub Pages serves the files as they are.

It is designed to look and behave like a Power BI report:

- **Pages are report tabs** along the bottom: Professional, Personal, Hall of Fame, Yearbook, and Album (Album only appears once a photo exists).
- **Case studies are drill-through pages**, opened from the project cards on the Professional page, with a "Back to report" button and drill-through filter chips.
- **Recreated reports** inside case studies are interactive: page tabs and toggles work. They always use sample data.
- **KPI cards have source tooltips**, like report-page tooltips.
- **Themes** work like report themes: same layout, different palette.

All content lives in `data/`. The code in `js/` reads that content and draws the pages. To change what the site says, edit `data/`. To change how it looks or behaves, edit `css/` or `js/`.

### Routes (the part after `#` in the address)

| Address | Shows |
|---|---|
| `#professional` (or no hash) | Professional page |
| `#personal` | Personal page |
| `#hall-of-fame` | Hall of Fame |
| `#yearbook` | Yearbook |
| `#album` | Album (only if photos exist) |
| `#case-<id>` | Case study for the project with that `id`, e.g. `#case-pyl` |
| `#work`, `#root-cause`, `#story-section` | Scrolls to that section of the Professional page |

Unknown hashes fall back to the Professional page.

---

## 2. File map

| Path | What it is | Edit it? |
|---|---|---|
| `index.html` | Page shell: title bar, empty page containers, tab bar, tooltip, image viewer, script includes. Also sets the theme before the page paints. | Rarely. Only to change meta tags or add a new data file. |
| `404.html` | Self-contained "This visual has no data" page that GitHub Pages shows for missing addresses. | Rarely. |
| `data/profile.js` | Name, role, intro, contact links, hero KPIs and their tooltips, Story mode opening and closing chapters, How I work, career timeline, publications, toolkit, skill slicer values, analytics code. | Yes |
| `data/projects.js` | Every case study. | Yes |
| `data/mocks.js` | The interactive recreated reports used in case studies. | Yes, carefully (it contains small functions) |
| `data/timeline.js` | Certifications, skill assessments, courses, milestones and photos. Hall of Fame, Yearbook and Album all read this. | Yes, most often |
| `data/yearbook.js` | Per-year extras: one-line summary, superlative, quote, cover photo. | Yes |
| `data/personal.js` | Personal page content, including the watch report. | Yes |
| `js/charts.js` | Draws charts, recreated reports, model-view diagrams and Story mode sketches. | Only for new chart types |
| `js/app.js` | Renders every page, routing, themes, tooltips, Story mode, Hall of Fame, Yearbook, Album, image viewer, analytics. | Only for behaviour changes |
| `css/site.css` | All styles and the four theme palettes. | For visual changes |
| `assets/certs/` | Certificate images (WebP, about 1400px wide). | Add files |
| `assets/projects/` | Project screenshots (create the folder when the first one is added). | Add files |
| `assets/photos/` | Album and Yearbook photos (create the folder when the first one is added). | Add files |
| `assets/Rahul_Vashistha_Resume.pdf` | The downloadable résumé. It contains no phone number. | Replace the file |
| `og-image.png` | 1200 × 630 preview image shown when the link is shared. | Replace the file |
| `tools/redact.py` | Blurs report screenshots before they go on the site (see section 5). Not used by the website itself. | Only to extend the safe-label list |

Each data file adds one piece to a global `SITE` object, for example `SITE.projects = [ ... ];`. If a data file has a syntax error, the site shows a red banner naming that file instead of breaking.

---

## 3. Data reference

These are JavaScript files, not JSON. Strings can use straight double quotes for syntax; the text people read uses typographic apostrophes and quotes (see the house rules). A missing comma or bracket breaks only that file, and the banner will say which.

### 3.1 `data/profile.js` → `SITE.profile`

| Field | Meaning |
|---|---|
| `name`, `role`, `lede`, `refreshed` | Title bar and hero text. `refreshed` is the small "Data as of …" line. |
| `facts` | Hero facts as `[icon, text]`. Icons: `pin`, `cap`, `badge`. |
| `contact` | `email`, `linkedin`, `github`, `resume` (path to the PDF). |
| `kpis` | Six hero cards. Each: `v` (value), `l` (label), `tip` (tooltip: `title`, `rows` as `[label, value]` pairs, `note`), optional `link` (a project `id`). Every number needs a real source in its tooltip. |
| `prologue`, `epilogue` | Story mode's first and last chapters: `id`, `kicker` (time label), `title`, `frames` as `[stage, headline, text]`. |
| `principles` | How I work cards: `[heading, text]`. |
| `career` | Timeline entries: `when`, `what`, `where`, optional `now: true`, optional `sub` as `[label, text]` pairs. |
| `publications` | `title`, `venue`, `note`, `link` (DOI link). |
| `skills` | Toolkit groups: `[group name, [chips]]`. |
| `skillSlicer` | Buttons on the project filter. Must start with `"All"`. Each value must match a value in some project's `filters`. |
| `analytics.goatcounter` | GoatCounter site code. Empty string means analytics is off. |

Story stages (used in every `frames` and `story` list) and the sketch each one draws:

| Stage | Label shown | Sketch |
|---|---|---|
| `problem` | Problem | Broken chart and scribble |
| `approach` | Approach | Table and magnifier |
| `build` | What I built | Building blocks |
| `result` | Result | Rising chart with a tick |
| `start` | Chapter | Graduation cap |
| `learn` | Chapter | Open book |
| `next` | Coming up | Clock |

### 3.2 `data/projects.js` → `SITE.projects`

Each project is one object. Projects appear on the Professional page in this order; Story mode sorts them by `years`.

| Field | Meaning |
|---|---|
| `id` | Short lowercase id, letters, digits and hyphens. Used in `#case-<id>`. Never change an existing id; links depend on it. |
| `client` | Who it was for, as it may be shown publicly, e.g. "EY for ZS Associates, client Lantheus". The part after ", client " becomes the drill-through "Client is" chip. |
| `period` | Display text, e.g. "Jul to Oct 2026". |
| `years` | `[startYear, endYear]` as numbers. Drives Story mode order and which Yearbook years list the project. |
| `title` | Case-study title, sentence case. |
| `card` | Summary tile: `v` (headline number), `l` (its label), `summary` (one sentence). |
| `problem` | One or two sentences. |
| `built` | Bullet list of what I personally built. |
| `model` | One line describing the data model. |
| `impact` | Up to four `[value, label, note]`. `note` becomes the tooltip. Real numbers only. |
| `decisions` | List of design decisions, or `null` to hide the section. |
| `tags` | Technology chips. |
| `filters` | Values from `skillSlicer` (except "All") that this project should match. |
| `visual` | Either `{ mock: "<key in SITE.mocks>" }` for a recreated report, or `{ caption, flow: [[number, heading, text], ...] }` for a real-numbers flow diagram. In a flow, a number written as `"word:Databricks"` shows a word instead of a number. |
| `screenshots` | List of `{ src, caption }`, e.g. `{ src: "assets/projects/pyl-2-execution.webp", caption: "Execution: calls trend" }`. They appear as a captioned gallery in a "The real report" section and open in the viewer, which steps through them with Previous and Next. Only blurred images made with `tools/redact.py`. |
| `story` | Exactly four frames: `problem`, `approach`, `build`, `result`, each `[stage, headline, text]`. |
| `fixes` | Root-cause stories: `title`, `symptom`, `cause`, `fix`, `proof`. They appear on the case study and in Root-cause files. Can be empty. |
| `modelView` | Simplified diagram on a 640 × 300 canvas. `tables`: `id`, `n` (name), `k` (kind: `fact`, `dim`, `bridge`, `snap`, `model`, `report`, `source`), `x`, `y`, optional `mode` (e.g. "DirectQuery"), `note`, `w` (width, default 150). `links`: `[tableId, tableId]` pairs. Tables are 54px tall; keep them inside the canvas and avoid overlaps. Names are generic, never the client's real table names. |

### 3.3 `data/mocks.js` → `SITE.mocks`

Recreated reports. Every value, name and label here is sample data. Structure (page names, filters, layout) should follow the real report.

```js
key: { title: "Report name", style: "brand", brand: "Product A", start: 0, pages: [
  { name: "Page button name",
    hidden: false,                                          // true keeps a page (e.g. Welcome) out of the page buttons
    filters: ["Static filter chip", "..."],
    toggles: [{ id: "grain", opts: ["Weekly", "Monthly"], pills: true }],   // page-level, clickable
    build: s => ({                                          // s.t.grain is the selected index (0, 1, ...)
      kpis: [ /* KPI objects, see below */ ], kpiCols: 3,   // kpiCols optional
      rows: [{ cols: "1fr 1fr", cells: [ /* cell objects */ ] }]
    }) }
]}
```

Report-level options:

| Option | Effect |
|---|---|
| `style: "brand"` | Header with a generic brand mark, `brand` name, pill page buttons and "Data as of: sample" (used by the commercial platform) |
| `style: "band"` | Dark title band with `title` and `subtitle` (used by site operations) |
| no `style` | Simple title bar with tab-style page buttons |
| `start` | Index of the first page shown (the commercial platform starts on its hidden Welcome page) |

KPI objects:

| Kind | Shape |
|---|---|
| Simple | `{ v, l, d?, s? }` (value, label, optional delta text and state `up`, `down` or `flat`) |
| Card | `{ kind: "card", v, l, sub?, d?, s?, bar?: [percent, caption] }` |
| Segment card | `{ kind: "seg", l, v, rows: [[label, value, state]] }` (value rows get ▲ or ▼) |
| Group | `{ kind: "group", l, items: [[label, value, state?]] }` (three side-by-side values, like Actuals, Goals, Perf %) |

Every cell has a `title`. Optional on any cell: `zone: 1–4` (coloured top border), `tab: 1–4` (coloured tab-style header: 1 purple, 2 grey, 3 blue, 4 green), `info: true` (small ⓘ after the title), `toggles: [...]` (buttons in the cell header; same shape and state as page toggles, so `build` can react to them).

| Cell | Shape |
|---|---|
| Stacked columns | `{ chart: { type: "stack", cats, series: [{ name, cls: "s1", v: [...] }], totals?: true } }` (colour classes `s1` to `s6`; `totals` labels each column) |
| Columns plus line | `{ chart: { type: "combo", cats, bars, line, unit, barLabels?, labels?, neutral?, names? } }` (line points colour by sign unless `neutral: true`) |
| Actual vs goal | `{ chart: { type: "cluster", cats, a: [...], b: [...], line: [percent...] } }` |
| 100% stacked with total | `{ chart: { type: "stack100", cats, series, line: ["71.4K", ...], lineName } }` (series values are percentages) |
| Bars against thresholds | `{ chart: { type: "band", items: [[label, value]], th: [low, high], max, labels, invert } }` (`invert: true` when higher is better) |
| Horizontal bars | `{ chart: { type: "hbar", items: [[label, value]] } }` |
| Line | `{ chart: { type: "line", cats, v } }` |
| Scatter | `{ chart: { type: "scatter", pts: [[x, y]], xl: "x-axis label" } }` |
| Abstract map | `{ chart: { type: "map" } }` |
| Table | `{ table: { cols, right: [column indexes to right-align], rows, empty: "message when no rows" } }`. A cell can be `"text"`, `["text", "up"]` (coloured), `["Active", "pill ok"]` (status pill) or `["Total", "num-total"]` (bold total row). |
| Heat table | `{ heat: { label, cols, rows: [[name, [numbers]]] } }` (over 100 shows hot, 80 to 100 medium) |
| Field list | `{ fields: [[label, value]] }` |
| Card set | `{ partners: [[name, line, line, ...]] }` or `{ cards: [{ title, fields: [[label, value]] }] }` |
| Empty state | `{ empty: "Message explaining why this view doesn’t apply." }` |
| Selectable list | `{ radio: { id, opts: [...] } }` (behaves like a toggle; `build` reads `s.t[id]`) |
| Welcome page | `{ welcome: { geo, go: pageIndex, note } }` (Go opens that page) |
| Nested layout | `{ bare: true, group: [rows...] }` (a column holding its own rows, for two-column report layouts) |

Charts size themselves to their slot: a row with one column draws a wide chart, two columns a medium one, three or more a compact one.

**Never** copy a real number, name, identifier, phone number or email from a client report into this file. Build the structure from the real report and invent every value.

### 3.4 `data/timeline.js` → `SITE.timeline`

One list of dated items. Order inside the file doesn't matter; pages sort by date.

| Type | Fields |
|---|---|
| Certification | `type: "cert"`, `tier: "certification"`, `date`, `code` (short, shown large; longer than 8 characters is shown smaller), `title`, `issuer`, `image`, optional `credential`, `verify` (URL), `pdf` (URL), `expires` (date) |
| Skill assessment | `type: "cert"`, `tier: "assessment"`, `date`, `code`, `title`, `issuer`, `image` |
| Course | `type: "cert"`, `tier: "course"`, `date`, `title`, `issuer`, `category` (Data and BI, Cloud and AI, Programming, Design, Business), and either `image` or `pdf` |
| Milestone | `type: "milestone"`, `date`, `title`, `subtitle`, optional `link` |
| Photo | `type: "photo"`, `date`, `title`, `caption`, `image`, optional `place` |

Dates are `"YYYY"`, `"YYYY-MM"` or `"YYYY-MM-DD"`. Use `null` if unknown; the item then stays off the learning curve. With `expires`, plaques show "Valid until …" or "Expired …" automatically.

**What belongs in the Hall of Fame:** passed exams from recognised vendors or bodies, the highest level passed in tiered skill assessments, and substantial courses relevant to data, BI, cloud, AI, design or business.
**What doesn't:** participation certificates, pledges, webinars, selection letters, exam prep for an exam already passed, short soft-skill courses, duplicates, and lower levels of an assessment already passed at a higher level.
**Never publish:** offer letters, score reports, or anything showing a phone number, address or email.

### 3.5 `data/yearbook.js` → `SITE.yearbook`

Keyed by year: `2026: { line, superlative, quote, cover }`. The current superlatives are approved. `cover` is a photo path or `null`. A year appears in the Yearbook when anything in `timeline.js` or `projects.js` falls in it; this file only adds the extras. Certifications, assessments, courses, milestones, projects and photos fill in automatically.

### 3.6 `data/personal.js` → `SITE.personal`

| Field | Meaning |
|---|---|
| `title`, `lede` | Personal page heading and intro. |
| `facts` | At a glance rows: `[label, value]`. |
| `life` | Three cards: `[heading, sentence, [items]]`. |
| `watch` | Watch report: `movies`, `series`, `anime`, each `{ label, total, ratings: { Best, Great, Good, Ok, Bad, Unrated }, picks, note?, decades? }`. Counts are deduplicated titles from my own logs. Picks are a curated shortlist suitable for a professional site. |
| `favourites` | `[heading, [items]]`. The section stays hidden while empty. |
| `values` | Four cards: `[heading, text]`. |
| `funfacts` | List of sentences. An even number looks best (two columns). |

---

## 4. House rules for content

These are non-negotiable. Follow them for every change.

1. **Real numbers only.** Every metric on the site must come from a real project record or the certificate itself. Never estimate, round up or invent. Every hero KPI needs a tooltip that says where it came from.
2. **Sample data stays inside recreated reports.** Anything in `data/mocks.js` is invented and labelled "Sample data". Never present sample values as real results anywhere else.
3. **Client confidentiality.** Client company names may appear (EY, ZS Associates, Amgen, Lantheus). Product and brand names, internal codenames, people's names, account names, territories, table names and real figures from client data must not. Use generic names like "Site 0142", "Team Alpha", "Category A".
4. **No phone number** anywhere on the site or in the résumé.
5. **Don't guess.** If a detail isn't known, leave the field empty or `null` rather than filling it in.
6. **Writing style.** Sentence case for headings. Plain, specific language, no filler or hype. Active voice. Typographic punctuation in text people read: ’ for apostrophes and “ ” for quotes; straight quotes only in code syntax. No all-caps labels.
7. **Design rules.** Flat panels with hairline borders, no rounded cards or drop-shadow decoration, one accent colour per theme, Power BI vocabulary (pages, slicers, tooltips, drill-through). Motion only in response to an action, and always respect reduced motion.
8. **Every change must work** in all four themes (Classic, Night shift, Court, Sakura night), on phones (390px wide) and on desktop, with no sideways scrolling.

---

## 5. Common changes

**Add a certification**
1. Save an image of the certificate as WebP, about 1400px wide, in `assets/certs/`, for example `assets/certs/new-cert.webp`.
2. In `data/timeline.js`, copy an existing certification line and change `date`, `code`, `title`, `issuer`, `image`, and `credential`, `verify` or `expires` if known.
3. It appears on the Hall of Fame, the learning curve, the Professional page list and that year's Yearbook automatically. Update the résumé PDF separately.

**Add a course or skill assessment**
Same as above with `tier: "course"` (plus `category`) or `tier: "assessment"`. Check it meets the Hall of Fame criteria in section 3.4.

**Add a photo**
1. Resize to about 1600px on the long edge, save as WebP, and **remove location data** (EXIF GPS) before uploading.
2. Put it in `assets/photos/` and add a `type: "photo"` line to `data/timeline.js`.
3. The Album tab appears with the first photo. To use it as a Yearbook cover, set that year's `cover` in `data/yearbook.js`.

**Add project screenshots**
Raw report screenshots must never be published or committed. Every one goes through `tools/redact.py` first:
1. Run `redact()` on the raw image. It blurs everything, then restores only words on its SAFE list (page names, filter names, chart titles, column headers). Pass `covers` for logos and brand graphics, as flat boxes in the background colour.
2. Run `leak_test()` on the output. It should return nothing, or only gibberish from blurred bars. Any real word or number means the image isn't safe.
3. Open the image and check by eye, especially large KPI numbers, which survive blur longest. Raise `blur` if anything is guessable.
4. Save as WebP in `assets/projects/` and add `{ src, caption }` to that project's `screenshots` in `data/projects.js`.

**Add a project**
Copy a whole project object in `data/projects.js`, give it a new `id`, and fill every field. For a recreated report, add a matching entry to `data/mocks.js` and point `visual.mock` at its key; otherwise use a `flow`. Add any new skill to `skillSlicer` in `data/profile.js` if it should be filterable.

**Add a Yearbook year's extras**
Add a key to `data/yearbook.js`, for example `2027: { line: "...", superlative: "...", quote: "", cover: null }`.

**Change a theme or add one**
Theme colours are token blocks at the top of `css/site.css` (`:root[data-theme="…"]`). To add a theme: copy a block with a new name, then add it to `THEMES` (name, description, light or dark, four swatch colours) and `PAIR` (its light or dark partner) near the top of `js/app.js`.

**Turn on visitor analytics**
Create a free account at goatcounter.com, choose a site code, and put that code in `analytics.goatcounter` in `data/profile.js`. Page views (including each tab and case study) and résumé downloads are then counted. Analytics never runs when the site is opened as a local file.

**Update the résumé**
Replace `assets/Rahul_Vashistha_Resume.pdf` with a file of the same name. Keep it free of phone numbers, and keep its facts identical to the site's.

---

## 6. Checking changes before publishing

**Preview locally:** double-click `index.html`. Everything works offline except the web font, which falls back to a system font, and analytics, which is off for local files.

Then check:

1. No red banner at the top. If there is one, the named data file has a syntax error.
2. Click through every tab, open each case study you touched, and use its report tabs and toggles.
3. Hover or tap the KPI cards you changed and read their tooltips.
4. Switch through all four themes with the theme button.
5. Narrow the browser to phone width and check nothing scrolls sideways.
6. In the browser's developer console, there should be no red errors (a font loading message is fine offline).

**Publish:** in the GitHub repository, choose Add file → Upload files, drag in the changed files keeping their folders, and commit. The live site updates within a minute or two.

---

## 7. Prompt for an AI assistant

Paste this into a new chat along with this manual and the files you want changed (usually `index.html` plus the relevant `data/` file).

```
You are editing my personal portfolio website. It is a static site (plain HTML, CSS and
JavaScript, no build step) hosted on GitHub Pages and designed to look like a Power BI report.

I've attached MAINTAINING.md, which describes the file structure, the data formats and the
house rules. Read it fully before doing anything, and follow it exactly.

Rules:
- Change content only in the data/ files unless I explicitly ask for a layout or behaviour change.
- Keep every existing field name, id and structure. Don't rename or remove fields.
- Follow the house rules in section 4: real numbers only, sample data only inside recreated
  reports, client details generic, no phone number, no guessing, sentence case, typographic
  apostrophes and quotes in visible text.
- If something I ask for conflicts with those rules, or a detail is missing, ask me instead of
  filling it in.
- Return the complete updated file(s), not fragments, and list exactly what changed.
- Tell me which checks from section 6 I should run.

What I want changed:
[describe the change here]
```
