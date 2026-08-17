# Adding a new event

1. Create `img/Events/<year>/<DD-MM-YYYY>/` and put the photos in it, numbered `1.webp`, `2.webp`, … (WebP, ~1600px long edge). Optional extras: `group.webp` (page hero), `group_show.webp` (listing card), `<DD-MM-YYYY>.zip` (full-res download offered on the page when present).
2. Add an entry to `scripts/events-data.json` (copy an existing one): `year`, `slug` (= `DD-MM-YYYY`), `title`, `date`, `downloadName`, `hero` (e.g. `"group.webp"` or `null`), `photos` (array of filenames), `zip` (filename or `null`).
3. Run `node scripts/build-events.js` — regenerates all `events/<year>/<slug>.html` pages and the `event.html` listing.
4. Commit and push; Netlify deploys the static files as-is (no build step).
