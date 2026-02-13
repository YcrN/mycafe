# CLAUDE.md - AI Assistant Guide for mycafe

## Project Overview

This is a **real estate property map application** for Village Hills (ヴィレッジヒルズ), a construction company in Kitami, Japan. It displays house and land listings on an interactive Google Map with filtering and list views.

**Company site:** https://villagehills.co.jp/

## Tech Stack

- **HTML5** / **CSS3** / **JavaScript (ES6)** — no frameworks, no build system
- **Google Maps JavaScript API** (v=weekly, language=ja, region=JP)
- **jQuery 3.5.1** (loaded from WordPress CDN)
- Static site with no backend, no database, no server-side processing

## Repository Structure

```
/
├── index.html                      # Landing page (redirects to map)
├── realestate_map_ForMycafe.html   # Main application page (map + filters + list)
├── map_data_list.js                # Property data array (~230 records)
├── map_marker.js                   # Google Map initialization & marker rendering
├── map_list.js                     # List view rendering
├── map_styles.css                  # Map page styles (responsive)
├── css/
│   └── styles.css                  # Minimal index page styles
└── CLAUDE.md                       # This file
```

## Key Files

| File | Purpose |
|---|---|
| `realestate_map_ForMycafe.html` | Main app — HTML structure, filter form, script/style imports. Includes WordPress header/footer markup from the parent site. |
| `map_data_list.js` | Exports a `const` array of property objects. Each entry has `lat`, `lng`, `price`, `floorarea`, `landarea`, `type` ("house" or "land"), `contentString` (map popup HTML), and `listString` (list item HTML). |
| `map_marker.js` | `initMap()` function — creates the Google Map, reads filter form values, filters data, places markers with info windows. |
| `map_list.js` | Click handler for the "listData" button — filters the same data and renders an HTML list. |
| `map_styles.css` | All layout and styling. Flexbox-based, responsive breakpoints at 1020px and 769px. |

## Architecture & Data Flow

1. User opens `realestate_map_ForMycafe.html`
2. Google Maps API loads and calls `initMap()` (callback)
3. `initMap()` reads filter form values (category, location, price range, floor area, land area)
4. Data in `map_data_list.js` is filtered client-side
5. Matching properties are placed as markers on the map
6. Clicking "listData" button filters the same data and renders a list view below the map

All data is embedded client-side — there are no API calls for property data.

## Code Conventions

### JavaScript
- `'use strict';` at top of every JS file
- `const` / `let` (no `var`)
- Arrow functions for callbacks
- camelCase for variables (e.g., `categoryData`, `priceUpper`)
- Suffix `_d` for values read from the DOM, `_l` / `_u` for lower/upper bounds
- Comments in Japanese

### HTML
- `lang="ja"` on document root
- BEM-like CSS class naming from parent WordPress theme: `c-header__inner`, `c-header__logo`
- Filter form accessed via `document.condition.<field>.value`

### CSS
- Mobile-first responsive design with flexbox
- Color scheme: green buttons (`#005321`), gray backgrounds
- `box-sizing: border-box` throughout
- Japanese comments

### Data
- Location codes are abbreviated: `oho`, `ktm`, `rbe`, `aba`, `bih`, `one`, `kun`, `tub`, `mem`, `shk`, `mon`
- Property types: `"house"` or `"land"`
- Coordinates stored as strings in the data, parsed to float at render time

## Build & Deployment

- **No build step** — files are served as-is (static site)
- **No package.json**, no npm, no bundler
- Cache busting via query strings (e.g., `map_styles.css?v=1`)
- No CI/CD pipeline

## Testing

- **No automated tests** — no test framework or test files exist
- Manual testing: open `realestate_map_ForMycafe.html` in a browser and exercise filters

## Linting & Formatting

- **No linter or formatter configured** — no ESLint, Prettier, or Stylelint
- Follow existing style when making changes (see conventions above)

## Important Notes

- The Google Maps API key is embedded directly in the HTML — do not commit additional API keys or secrets
- The `noindex` meta tag is set — this page is not intended for search engine indexing
- The HTML includes WordPress theme markup (header, footer, nav) — these elements reference the parent site's assets and may not render correctly outside that context
- All user-facing text is in Japanese
- When adding new properties, add entries to the `map_data_list.js` array following the existing object shape
