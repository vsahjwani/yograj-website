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

- `index.html` — all content, the interactive room SVG and the architecture diagram
- `css/style.css` — full design system (colors, type, sections)
- `js/main.js` — entry experience, cursor torch, dim-to-warm dimmer, dust particles,
  room scene engine, architecture toggle, typewriter, form handling
- `assets/` — logos, Raylogic product photography, GO ad video

## Sections

Hero · Why automation · Heritage · Experience (live room) · Keypads · Systems
(dimming technologies, architecture, design principles, KNX) · Products ·
Beyond lighting · Raylogic · Vision · Contact

## Logo usage

Two variants ship in `assets/`. **Use the one that matches the background:**

| File | Wi-Fi arcs | Use on |
|---|---|---|
| `logo-light.png` | black | light / white backgrounds |
| `logo-dark.png` | white | dark backgrounds |

The site is dark, so it uses `logo-dark.png` throughout (nav, hero, footer).
`logo-light.png` is the favicon and is the one to use for print, letterheads and
any light-background collateral.

## Signature interactions

1. **Entry** — "touch to illuminate" power ring; auto-illuminates after 6.5 s so no
   visitor is ever stuck. Honors `prefers-reduced-motion`.
2. **Cursor torch** — a warm light pool follows the pointer (desktop only).
3. **Master dimmer (hero)** — live dim-to-warm demo: 100 % = 2 700 K, dimming glides
   toward 2 200 K candlelight.
4. **The Room** — live SVG living room driven by a keypad engraved with the real
   scene names (Welcome, TV, Dine, Sleep), five individually toggleable fixtures,
   All Off, and a master fader.
5. **Architecture diagram** — toggle between *controller-based* and *controller as a
   layer*; the signal dot animates along the active path and the bullet list swaps.
6. **Products** — DIN modules blink, UNIVO touchpoints glow, GO plays its video,
   Automation Controllers type voice commands.

## Content sources

- `Website Doc 2.docx` — About Us, vision, the four product descriptions
- `YS PPT 12Jun25.pptx` — why automation, dimming technologies and DIN model
  numbers, keypad photography, international keypad brands, design principles,
  the two system architectures, KNX, and the beyond-lighting systems

## Placeholders to replace before go-live

Search for `Placeholder` / `class="ph"` in `index.html`:

- [ ] Telephone number (`+91 XXXXX XXXXX`)
- [ ] Email (`hello@yograjservices.example`)
- [ ] Experience-studio address
- [ ] Raylogic detail copy (marked block in the Raylogic section — to be drawn from
      the existing Raylogic website)
- [ ] Projects-delivered / cities-served stats (`[XXX]`, `[XX]`)
- [ ] Contact form backend: see the `TODO (go-live)` comment in `js/main.js`

## Deploying

Static hosting is enough: GitHub Pages, Netlify, Vercel, or any web server.
