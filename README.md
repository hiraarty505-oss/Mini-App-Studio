# Mini App Studio

A production-ready, static Mini App Studio website — HTML, CSS, and vanilla JavaScript only.

## Run it

Just open `index.html` in a browser, or serve the folder statically:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Deploys as-is to Vercel, Netlify, GitHub Pages, or any static host.

## Structure

```
/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── icons/
```

## What's inside

- **Design system**: dark/light theme via CSS custom properties, one accent gradient (indigo → violet), Space Grotesk for display type, Inter for body, IBM Plex Mono for eyebrows/labels.
- **Hero**: staggered entrance choreography (GSAP if the CDN loads, a CSS-based fallback if not), ambient floating app-tile shapes, ARIA-friendly.
- **App showcase**: 8 mini apps, live search + category filters, staggered scroll reveal.
- **Live preview**: a real working calculator and unit converter inside a browser-style window mockup, with tab switching and a subtle pointer-tilt effect.
- **Motion system**: CSS transitions/animations for micro-interactions, `IntersectionObserver`-driven scroll reveals, `prefers-reduced-motion` respected throughout (disables ambient motion and shortens/skips entrance animation).
- **Accessibility**: semantic landmarks, visible focus states, keyboard-operable calculator (number/operator keys, Enter, Escape), accessible mobile nav with `aria-expanded`.
- **No backend**: everything — search, filters, calculator, converter, toasts, theme toggle — runs client-side.

## Notes

- GSAP and Google Fonts load from CDN; the site still works without internet access, just with the CSS fallback entrance animation and system fonts.
- Theme preference follows the OS on first load and is kept in memory only (no `localStorage`, per this environment's constraints) — it resets on reload.
