# Kiyora — Smart Garbage Reporting & Volunteer System

A civic-tech web app that lets anyone report illegal dumping sites on a real interactive map, and enables volunteers to claim and track cleanup efforts.

---

## Features

- **Report a spot** — click anywhere on the map or use your device's GPS to pin a garbage location
- **Photo upload** — attach an image via drag-and-drop or file picker (stored as base64)
- **Severity levels** — Low (green), Medium (orange), High (red) colour-coded markers
- **Volunteer actions** — claim a cleanup ("In Progress") or mark it done ("Cleaned") with instant UI updates
- **Live dashboard** — real-time counts for Total, Reported, In Progress, and Cleaned
- **Filters** — narrow visible markers by severity and/or status
- **Hover tooltips** — quick info on any marker without opening the popup
- **Light theme** — off-white aesthetic (#F7F7F5) with CartoDB Positron map tiles

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS 3 |
| Map | Leaflet.js + react-leaflet 4 |
| Icons | lucide-react |
| Build tool | Vite 5 |
| Data | Local state (no backend required) |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install & run

```bash
# 1. Clone / navigate to the project folder
cd Kiyora

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
Kiyora/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry point — imports Leaflet CSS
    ├── App.jsx               # Root component, all state lives here
    ├── index.css             # Tailwind directives + Leaflet popup overrides
    ├── data/
    │   └── reports.js        # 7 seed reports with real coordinates
    └── components/
        ├── Header.jsx        # Brand bar, Add Report & Use My Location buttons
        ├── Dashboard.jsx     # Live stats (Total / Reported / In Progress / Cleaned)
        ├── FilterBar.jsx     # Severity + status filter pills
        ├── MapView.jsx       # Leaflet map, CircleMarkers, popups, tooltips
        └── ReportModal.jsx   # Report form (location, severity, photo, description)
```

---

## How to Use

### Reporting a spot

1. Click **Add Report** in the header — the cursor becomes a crosshair
2. Click anywhere on the map to drop a pin at that location
3. Fill in the severity, an optional photo, and an optional description
4. Hit **Submit Report** — the marker appears instantly

**Alternatively**, click **Use My Location** to have the form pre-filled with your GPS coordinates.

### Volunteering for cleanup

1. Click any marker on the map
2. In the popup, click **Claim for Cleanup** — status changes to *In Progress*
3. Once done on-site, reopen the popup and click **Mark as Cleaned** — the marker fades to indicate completion

### Filtering

Use the pill buttons in the filter bar to show only markers of a specific severity or status. Filters stack (e.g. *High severity + Reported only*).

---

## Deployment

The app produces a fully static build with no backend dependency.

```bash
npm run build
# Output → dist/
```

| Platform | Steps |
|---|---|
| **Netlify** | Drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `npx vercel` from the project root |
| **GitHub Pages** | Push `dist/` to the `gh-pages` branch (or use the `vite-plugin-gh-pages` plugin) |
| **Any static host** | Upload the contents of `dist/` |

---

## Seed Data

Seven pre-loaded reports across Southeast Asia so the map is populated on first load:

| Location | Severity | Status |
|---|---|---|
| Tondo, Manila | High | Reported |
| Quezon City | Medium | In Progress |
| Makati City | Low | Cleaned |
| Bangkok, Thailand | High | Reported |
| Central Jakarta | Medium | Reported |
| Kuala Lumpur | Low | In Progress |
| Ho Chi Minh City | High | Reported |

---

## License

MIT
