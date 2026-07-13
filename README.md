# Yograj Services — Website

A single-page luxury experience site for Yograj Services (home automation & digital
dimming). Dark, light-first design: the site opens in darkness and is "switched on"
by the visitor.

## Run locally

Any static server works — no build step, no dependencies:

```bash
python3 -m http.server 8641 --directory .
# open http://localhost:8641
```

## Structure

- `index.html` — all content and the interactive room SVG
- `css/style.css` — full design system (colors, type, sections)
- `js/main.js` — entry experience, cursor torch, dim-to-warm dimmer, dust particles,
  scene engine for the room, typewriter, form handling
- `assets/go-by-raylogic.mp4` — GO by Raylogic ad (plays in the Products section)

## Signature interactions

1. **Entry** — "touch to illuminate" power ring; auto-illuminates after 6.5 s so no
   visitor is ever stuck. Honors `prefers-reduced-motion` (skips straight to content).
2. **Cursor torch** — a warm light pool follows the pointer (desktop only).
3. **Master dimmer (hero)** — live dim-to-warm demo: 100 % = 2 700 K, dimming glides
   toward 2 200 K candlelight. Readout updates like a real keypad.
4. **The Room (Experience section)** — live SVG living room with a Raylogic-style
   keypad: 4 scenes (Arrival, Soirée, Cinema, Midnight), 5 individually toggleable
   fixtures, and a master fader. Cinema closes the curtains and drops a projector
   screen; Midnight wakes the skyline.
5. **Products** — DIN modules blink, UNIVO touchpoints glow on hover, GO plays its
   video, Automation Controllers type voice commands.

## Placeholders to replace before go-live

Search for `Placeholder` / `class="ph"` in `index.html`:

- [ ] Telephone number (`+91 XXXXX XXXXX`)
- [ ] Email (`hello@yograjservices.example`)
- [ ] Experience-studio address
- [ ] Raylogic detail copy (marked block in the Raylogic section — to be drawn from
      the existing Raylogic website)
- [ ] Projects-delivered / cities-served stats (`[XXX]`, `[XX]`)
- [ ] Contact form backend: see the `TODO (go-live)` comment in `js/main.js` —
      wire the submit handler to your email/CRM endpoint (e.g. Formspree, Netlify
      Forms, or your own API).

## Deploying

Static hosting is enough: Netlify, Vercel, GitHub Pages, or any web server.
Upload the folder as-is.
