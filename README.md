# Rahul Vashistha: portfolio

A portfolio built like a Power BI report. Pages: Professional (with drill-through case studies), Personal, Hall of Fame and Yearbook. An Album page appears automatically once photos are added.

Plain HTML, CSS and JavaScript. No build step, no framework. Hosted free on GitHub Pages.

## Where things live

| Path | What it is |
|---|---|
| `data/profile.js` | Name, intro, headline KPIs and their source tooltips, career, skills, Story mode opening and closing |
| `data/projects.js` | Every case study: card, story frames, fixes, model view, design decisions, screenshots |
| `data/mocks.js` | The interactive recreated reports (sample data) |
| `data/timeline.js` | Certifications, courses, milestones and photos. Hall of Fame, Yearbook and Album all read this |
| `data/yearbook.js` | Per-year line, superlative, quote and cover photo |
| `data/personal.js` | Personal page, including the watch report |
| `assets/` | Certificate images, project screenshots, photos, résumé PDF |
| `css/site.css` | Styles and the four themes |
| `js/` | Rendering code. You shouldn’t need to touch it to update content |

## Common updates

**Add a certificate:** put the image in `assets/certs/`, then copy an existing certification line in `data/timeline.js` and change the values.

**Add a photo:** put it in `assets/photos/` (about 1600px wide, location data removed), then add a `type: "photo"` line in `data/timeline.js`. The Album tab appears with the first photo.

**Add project screenshots:** put them in `assets/projects/` and list them in that project’s `screenshots: []` in `data/projects.js`.

**Preview locally:** double-click `index.html`. Everything works offline except the web font.

If a data file has a typo, the site shows a red banner naming the file.
