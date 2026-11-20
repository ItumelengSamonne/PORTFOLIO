# Itumeleng — My Portfolio

**Live site:** https://paska465.github.io/PORTFOLIO/

A hand-built portfolio for a first-year Data Science student (Sol Plaatje University) who also writes
HTML, CSS and JavaScript. No framework, no build step — one HTML file, one stylesheet, one script,
plus a printable, ATS-friendly résumé.

## Stack
- HTML5, CSS3, vanilla JS (ES2023)
- Static hosting on GitHub Pages (`.nojekyll` present)
- Fonts: Geist, Instrument Serif, JetBrains Mono (Google Fonts, preconnected, `display=swap`)

## Structure
```
PORTFOLIO/
├── index.html            # portfolio
├── resume.html           # printable résumé (ATS-friendly)
├── 404.html
├── assets/
│   ├── css/styles.css    # design system + layout (blue glow on OLED black)
│   ├── js/main.js        # all behaviour, no dependencies
│   ├── img/              # favicon.svg, og.svg
│   └── itumeleng-resume.txt
├── .nojekyll
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Run locally
Any static server works:
```
python -m http.server 4173
# or
npx serve .
```
Then open http://localhost:4173.

## Features
- Dark (OLED black) / light theme, follows OS, no flash on load, toggle persisted
- Command palette (Ctrl/Cmd+K)
- Project filter by discipline, state synced to URL
- Copy-email with toast
- Scrollspy nav + reading progress bar
- Reveal-on-scroll, count-up stats, reduced-motion respected
- Contact form with inline validation, honeypot, mailto handoff
- Printable résumé with print stylesheet + plain-text (ATS) twin

## Deploy
GitHub Pages from `main` at repo root. Push to `main` republishes in ~1 minute.
All absolute URLs assume `https://paska465.github.io/PORTFOLIO/` — change the base if the repo is renamed.

## Licence
Content © Itumeleng. Code: MIT.