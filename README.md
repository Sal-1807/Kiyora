# Kiyora — Smart Garbage Reporting & Volunteer System

A civic-tech web app that lets anyone report illegal dumping sites on a real interactive map, and enables volunteers to claim and track cleanup efforts — built for hackathons and real-world community use.

---

## Features

- **Report a spot** — click anywhere on the map or use GPS to pin a garbage location (no manual coordinate input)
- **Photo upload** — drag-and-drop or file picker, stored as base64 preview
- **Severity levels** — Low (green) · Medium (orange) · High (red) with custom colored pin markers
- **Volunteer actions** — claim a cleanup ("In Progress") or mark it done ("Cleaned") instantly, no page reload
- **Live dashboard** — real-time counts for Total, In Progress, Cleaned, and High Severity
- **Filters** — narrow visible markers by severity and/or status
- **Report cards** — sidebar list with status icons, colored severity badges, and relative timestamps ("2h ago")
- **Hover tooltips** — location name appears on marker hover
- **Toast notifications** — feedback on every action
- **Mobile responsive** — sidebar stacks below map on small screens

---

## Tech Stack

| Layer | Choice |
|---|---|
| Structure | Vanilla HTML5 |
| Styling | Custom CSS (CSS variables, no framework) |
| Map | Leaflet.js 1.9 + OpenStreetMap tiles |
| Fonts | DM Sans + DM Serif Display (Google Fonts) |
| Build tool | Vite 5 |
| Data | Local in-memory state (no backend required) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
# 1. Navigate to the project folder
cd Kiyora

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
Kiyora/
├── index.html          # Complete app — HTML structure + all JavaScript
├── src/
│   └── index.css       # All styles (CSS variables, layout, components)
├── vite.config.js      # Minimal Vite config (no framework plugin)
├── package.json
└── README.md
```

---

## How to Use

### Reporting a spot

1. Click **＋ Report Spot** in the header — OR — click directly on the map
2. The modal opens with the pinned coordinates auto-filled (read-only)
3. Optionally use **📡 Use My GPS** to capture your current location instead
4. Set severity (Low / Medium / High), add a photo, hit **Submit Report**
5. The marker appears on the map instantly

### Volunteering for cleanup

1. Click any pin on the map to open its popup
2. Click **Claim for Cleanup** → status changes to *In Progress*
3. Return after cleanup and click **Mark as Cleaned** → marker fades to indicate completion

### Filtering

Use the chip buttons in the sidebar to show only markers matching a severity level or status. Filters combine — e.g. *High severity + Reported only*.

### Sidebar cards

Each card shows the location, abbreviated severity badge, status with animated dot, and a relative timestamp. Clicking a card flies the map to that spot and opens its popup.

---

## Seed Data

Seven pre-loaded reports across Indian cities so the map is populated on first load:

| Location | Severity | Status |
|---|---|---|
| Anna Salai, Chennai | High | Reported |
| T. Nagar Market, Chennai | Medium | In Progress |
| Ambattur Industrial Area | Low | Cleaned |
| MG Road, Bengaluru | High | Reported |
| Andheri West, Mumbai | Medium | Reported |
| Connaught Place, New Delhi | Low | In Progress |
| Park Street, Kolkata | High | Reported |

---

## Deployment

```bash
# Build for production
npm run build
# Output → dist/
```

| Platform | Steps |
|---|---|
| **Netlify** | Drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `npx vercel` from the project root |
| **GitHub Pages** | Push `dist/` contents to the `gh-pages` branch |
| **Any static host** | Upload the contents of `dist/` — no server needed |

---

## License

MIT
