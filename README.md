# Kiyora — Smart Garbage Reporting & Volunteer System

A civic-tech platform that lets anyone report illegal dumping sites on a real interactive map and enables volunteers to claim and track cleanup efforts — available as both a web app and a mobile app (Expo Go).

---

## Features

- **Report a spot** — click anywhere on the map or use GPS to pin a garbage location
- **Photo upload** — file picker or camera, stored as base64 preview
- **Severity levels** — Low (green) · Medium (orange) · High (red) with colored pin markers
- **Volunteer actions** — claim a cleanup ("In Progress") or mark it done ("Cleaned") instantly
- **Live dashboard** — real-time counts for Total, In Progress, Cleaned, and High Severity
- **Filters** — narrow visible markers by severity and/or status
- **Report cards** — list with status icons, colored severity badges, and relative timestamps
- **Toast notifications** — feedback on every action
- **Mobile app** — full Expo Go app with map, reports list, and report/volunteer flow

---

## Tech Stack

### Web App

| Layer | Choice |
|---|---|
| Structure | Vanilla HTML5 |
| Styling | Custom CSS (CSS variables, no framework) |
| Map | Leaflet.js 1.9 + OpenStreetMap tiles |
| Fonts | DM Sans + DM Serif Display (Google Fonts) |
| Build tool | Vite 5 |
| Data | In-memory state (no backend required) |

### Mobile App

| Layer | Choice |
|---|---|
| Framework | React Native 0.81 via Expo SDK 54 |
| Navigation | React Navigation v7 (Bottom Tabs) |
| Map | react-native-maps 1.20 |
| Location | expo-location |
| Camera / Photos | expo-image-picker |
| State | React useState (no backend required) |
| Runtime | Expo Go (iOS & Android) |

---

## Getting Started

### Web App

```bash
cd Kiyora
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Mobile App

```bash
cd Kiyora/mobile
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with **Expo Go** on your phone (iOS or Android). Make sure your phone and PC are on the same WiFi network.

> **Android note:** Add your Google Maps API key to `mobile/app.json` under `android.config.googleMaps.apiKey` before running on Android.

---

## Project Structure

```
Kiyora/
├── index.html              # Web app — HTML structure + all JavaScript
├── src/
│   └── index.css           # Web styles (CSS variables, layout, components)
├── public/
│   └── style.css           # Static CSS served by Vite
├── vite.config.js
├── package.json
│
└── mobile/                 # Expo Go mobile app
    ├── App.js              # Root — shared state + tab navigation
    ├── app.json            # Expo config (permissions, icons, SDK version)
    ├── package.json
    ├── babel.config.js
    ├── assets/             # App icons + splash screen
    └── src/
        ├── data.js         # Colors, seed data, helpers
        ├── MapScreen.js    # Map view with markers + Report FAB
        ├── ListScreen.js   # Filtered report list
        └── ReportModal.js  # New report form + detail/action sheet
```

---

## How to Use

### Reporting a spot

1. **Web:** Click **＋ Report Spot** or click directly on the map
2. **Mobile:** Tap the green **＋ Report Spot** button on the map
3. Set severity (Low / Medium / High), add a description and optional photo
4. Hit **Submit** — the marker appears instantly

### Volunteering for cleanup

1. Click/tap any pin to open its detail
2. Click **Claim for Cleanup** → status changes to *In Progress*
3. Return after cleanup and click **Mark as Cleaned** → spot is resolved

### Filtering

Use the filter chips to show only markers matching a severity or status. Filters combine — e.g. *High + Reported only*.

---

## Seed Data

Seven pre-loaded reports across Indian cities:

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

### Web

```bash
npm run build
# Output → dist/
```

| Platform | Steps |
|---|---|
| **Netlify** | Drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `npx vercel` from the project root |
| **GitHub Pages** | Push `dist/` contents to the `gh-pages` branch |

### Mobile

For a standalone APK/IPA (no Expo Go required):

```bash
cd mobile
npx expo build:android   # or expo build:ios
```

---

## License

MIT
