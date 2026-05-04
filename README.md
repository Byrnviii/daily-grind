# Daily Grind — Habit Tracker

**Tu rutina. Tu legado.**

A minimal, premium dark-themed habit tracker built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies, no backend — just open the file and grind.

---

## Features

- **Daily habit tracking** with progress bar and completion celebration
- **Streak counter** — tracks your consecutive days of consistency
- **Visual calendar** — see your history at a glance (full days, partial days)
- **Stats panel** — active days, perfect days, total habits
- **Add / edit / delete habits** — fully customizable with icon and color
- **Export & Import** — backup your data as JSON and restore it anytime
- **Bilingual** — full Spanish / English support (auto-detects browser language)
- **Sound feedback** — subtle Web Audio API tones on completion
- **Onboarding** — personalized welcome with your name
- **Responsive** — works on desktop and mobile
- **No login required** — all data is stored locally in your browser

---

## Getting Started

### Option 1 — Open directly (simplest)

Download or clone the repo, then open `index.html` in any modern browser:

```bash
git clone https://github.com/YOUR_USERNAME/daily-grind.git
cd daily-grind
# Open index.html in your browser
```

### Option 2 — Local server (recommended for development)

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8000`

---

## Project Structure

```
daily-grind/
├── index.html   # HTML structure and layout
├── style.css    # All styles and responsive rules
├── app.js       # All logic: state, rendering, i18n, storage
└── README.md    # This file
```

---

## Data & Privacy

All data is stored in your browser's `localStorage`. Nothing is sent to any server.
You can export your data at any time using the **Export** button, which generates a `.json` backup file.

---

## Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge.

---

## Built by

Byron — Panama 🇵🇦
