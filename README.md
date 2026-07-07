# Serene — serene.com

Production frontend for Serene, the AI-native advisory for off-plan real estate in Dubai and
Abu Dhabi. React Router v7 (framework mode, fully prerendered), Vite, TypeScript,
Tailwind v4, Framer Motion, Lenis.

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # sitemap + static build → build/client (deploy this folder)
npm run typecheck  # route typegen + tsc
```

The build prerenders **every route** — including each development, developer, and insight —
to static HTML for SEO. Deploy `build/client` to any static host behind HTTPS; configure the
host's SPA fallback to `__spa-fallback.html` for unknown paths.

## Adding content (no code required)

Content lives in `/content`. Components never hard-code an entity — a new file is a new page,
picked up by the build (routes, sitemap, listings, cross-references) automatically.

| To add… | Create… |
|---|---|
| A development | `content/developments/<slug>.md` |
| A developer | `content/developers/<slug>.md` |
| An insight article | `content/insights/<slug>.md` |
| A FAQ | An entry in `content/faqs.json` |
| A role | An entry in `content/careers.json` |

Frontmatter is flat `key: value`; lists are pipe-separated (`notable: Burj Khalifa | Dubai Mall`).
A development's `developer:` field references the developer's file name — the developer's page
then lists that development automatically. Copy an existing file as the template; the voice
rules are in `brand-assets/brand-tokens.md` (composed · elevated · enduring).

### Onboarding a new developer (the standard client workflow)

1. `content/developers/<slug>.md` — the profile.
2. `content/insights/<slug>-joins-the-serene-registry.md` — the spotlight
   (`category: Developer Spotlights`).
3. Any of their projects as `content/developments/*.md` with `developer: <slug>`.
4. `npm run build`.

## Imagery

Every visual surface is a `Plate` — a CSS-composed, art-directed stand-in (direction per
plate family in the Phase 7 design deck). To use licensed photography, add the file under
`public/images/` and set `image: /images/<file>.jpg` in the entry's frontmatter; the plate
becomes its fallback. Grade recipe: warm shadows toward `#0B0A08`, highlights toward ivory,
saturation −15, temperature +8. Never handshakes, staged offices, or HDR skylines.

## Configuration

Copy `.env.example` to `.env`:

- `VITE_AMELIA_URL` — the external Amelia platform. All Amelia CTAs route through
  `/amelia` (the gateway) and exit here with `ref`/`context` params for attribution.
- `VITE_GA_ID` — GA4 id. Analytics loads **only after cookie consent**; declining loads nothing.
- `VITE_CONTACT_ENDPOINT` — POST target for the contact form (e.g. Formspree).

## Before launch

- [ ] Replace the placeholder RERA licence number in `app/lib/site.ts` (`SITE.rera`) — it
      appears in the footer, About, FAQs, and Developers pages automatically.
- [ ] Confirm the real developer registry and update `/content/developers`.
- [ ] Set the production `VITE_AMELIA_URL`, `VITE_GA_ID`, `VITE_CONTACT_ENDPOINT`.
- [ ] Have counsel review `/content/legal/*.md` (marked as drafts).
- [ ] License photography per the imagery direction and wire via frontmatter `image:` fields.
- [ ] Update `BASE` in `scripts/generate-sitemap.mjs` + `SITE.url` if the domain differs.

## Brand invariants (enforced in code — don't undo them)

Anek Latin only, weight-led hierarchy · gold fill once per page (the Amelia action), Brass for
gold-toned text on ivory · Deep Navy surfaces belong to Amelia exclusively · radius 0 · the
supplied mark artwork only (white on dark, silver on light, 32px minimum) · motion collapses
under `prefers-reduced-motion`.
