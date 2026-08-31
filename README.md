# Phoenix Phamous

Static multi-page site for Phoenix Phamous — independent booking for rock/metal
nights at The Blooze Bar, Phoenix AZ.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, featured show, upcoming grid, what-we-do, CTA |
| `shows.html` | Full show calendar — upcoming + past |
| `book.html` | Band pitch form → opens a pre-filled email via `mailto:` |
| `about.html` | Phoenix Phamous + The Blooze Bar venue info |

## Assets

- `assets/styles.css` — all styling, dark gig-poster theme (CSS variables at top)
- `assets/main.js` — mobile nav, scroll reveal, booking-form validation + `mailto:` hand-off

## Running it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

## Hosting

Drop the whole folder onto Netlify, GitHub Pages, Cloudflare Pages, or any static host.

## To make it real

- **Fonts** load from Google Fonts (needs internet). Self-host the WOFF2 files if you want it fully offline.
- **Booking email**: `booking@phoenixphamous.com` (band pitches) and
  `info@phoenixphamous.com` (table reservations / general) are placeholders —
  search/replace with real addresses. They appear in all 4 HTML files and in
  `assets/main.js` (`BOOKING_EMAIL`).
- **Events** are sample data drawn from the reference posters, with future dates
  invented for the demo. Replace the `<article class="show-card">` / `.featured`
  blocks in `index.html` and `shows.html` with real shows.
- **Logo**: currently a CSS chrome wordmark + SVG lightning bolt. Drop a real
  PNG/SVG into `assets/` and swap the `.brand` markup if you have one.
- **Social links** point to facebook.com / instagram.com roots — update to the
  real profile URLs.
- **Ticketing**: shows currently use "cash at the door" + a `mailto:` table
  reservation. Add real ticket links (e.g. See Tickets, Eventbrite) to the
  `.show-foot` / `.featured__body` buttons if shows go to advance sales.
