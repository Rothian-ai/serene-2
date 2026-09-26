# Serene — serene.com

**Two names, on purpose.** `SITE.name` (`"Serene"`) is the title identity: the
browser tab, `<title>`, `og:site_name`, the header wordmark and the logo's
accessible label. `SITE.contentName` (`"Serene Bay"`) is how body copy, legal
text, meta descriptions and the comparison table refer to the house. Never
hard-code either — read them from `app/lib/site.ts`.

Production frontend for **Serene**, an off-plan buyer advisory in Dubai and Abu Dhabi
whose advisors are salaried rather than commissioned. A premium, cinematic, prerendered
marketing site that has to do two jobs: make the structural argument for the model, and move
visitors into a conversation — with an advisor, or with **Amelia** (the external AI platform).

Strategy source of truth: `docs/serene-bay-value-chain-strategy.md` (the buyer value chain and
market differentiation research). The positioning, the nine-stage lifecycle, the market
comparison and the "going direct" rebuttal all live in code at `app/lib/strategy.ts` — edit
that module, not the pages, when the strategy changes.

**Stack:** React Router v7 (framework mode, fully prerendered) · Vite · TypeScript ·
Tailwind v4 · GSAP + ScrollTrigger (scroll-driven / pinned / split-text) · Framer Motion
(component-level reveals + page transitions) · Lenis (smooth scroll).

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # sitemap + static build → build/client (deploy this folder)
npm run typecheck  # route typegen + tsc
```

The build prerenders **every route** — including each insight — to static HTML for SEO. Deploy `build/client` to any static host behind HTTPS; configure the
host's SPA fallback to `__spa-fallback.html` for unknown paths.

Production deploys on Vercel from the `beta` branch of `Rothian-ai/serene-2`, not
from `main`. On the Hobby plan Vercel only builds commits authored by the
project's owner, so commit as that account or the push will not deploy.

## Structure

```
app/
  root.tsx            Shell: Lenis↔GSAP wiring, page transitions, scroll progress, header/footer
  routes/             One file per page (home, difference, lifecycle, about, insight, …)
  components/         UI + cinematic layer (see Motion below); primitives.tsx = the design system
  lib/
    content.ts        Markdown content collections (the journal + legal pages)
    strategy.ts       THE strategy: commitments, nine stages, comparison, value proposition
    offplan.ts        The /off-plan explainer: process, payment plans, Emirates, FAQ (all sourced)
    site.ts           Site constants, Amelia gateway, <meta> builder
    gsap.ts           GSAP foundation: plugin registration + useGsapContext (scoped, reduced-motion safe)
    motion.ts         Framer variants/eases + the reveal repertoire
    analytics.ts      GA4, loaded only after consent
content/              Markdown/JSON content (a new file = a new page)
brand-assets/         brand-tokens.md (the brand rules) + the logo artwork
public/               images/ (Plate photography, AVIF+srcSet hero), logo/, fonts/
```

## Motion & interaction

GSAP + ScrollTrigger own the heavy scroll work; Framer Motion stays for lightweight component
reveals and page transitions. Lenis drives the document scroll and is clocked by GSAP's ticker,
feeding `ScrollTrigger.update` (one clock, no scrollerProxy) — wired once in `root.tsx`.

- **`lib/gsap.ts`** — registers ScrollTrigger + SplitText once (client-only); `useGsapContext(ref, fn)`
  scopes every tween/trigger to a container, reverts on unmount, and **no-ops under reduced motion**.
- **`HeroSequence`** — pinned 3-chapter hero: ambient ken-burns + light bloom (loop), flash-free
  split-text entrance, scrubbed chapter/background crossfade, handoff scrim. `HERO_VIDEO` const is a
  ready `<video>` slot (empty by default — see Imagery).
- **`HorizontalShowcase`** — ScrollTrigger pin + scrub; pin lasts exactly the track overflow width
  (`end = "+=" + (scrollWidth − innerWidth)`, `invalidateOnRefresh`). Touch/reduced-motion → swipe row.
- **`DevelopmentNarrative`** — sticky fact-rail + section-nav with an IntersectionObserver scrollspy.
- **`MetricsMonument` / `Counter`** — credibility band; figures count up on scroll-in.
- **`SplitHeading`** — masked line/character reveal for major headings (used sparingly).
- **`ScrollProgress`** — hairline gold reading bar. **`Seam`** — gradient bridges between grounds.
- **`Reveal` / `RevealGroup`** (`primitives.tsx`) — the enter (and optional graceful `exit`) reveals;
  `variant` = fade-up · fade-down · fade · scale · mask.

Everything is **SSR-complete** (prerendered HTML paints without JS) and collapses to static under
`prefers-reduced-motion`. To feel the motion, run the dev server and open it in a real browser.

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

One image convention: a development's `gallery:` must carry **at least as many non-hero images
as it has `reasons:`** — the "Why" carousel pairs one photograph per reason and never repeats
one. Sourced placeholders are credited in `public/images/CREDITS.txt`.

### Onboarding a new developer (the standard client workflow)

1. `content/developers/<slug>.md` — the profile.
2. `content/insights/<slug>-joins-the-serene-registry.md` — the spotlight
   (`category: Developer Spotlights`).
3. Any of their projects as `content/developments/*.md` with `developer: <slug>`.
4. `npm run build`.

## Imagery

Every visual surface is a `Plate`. Real photography now ships in `public/images/`
(sourced from Unsplash — free for commercial use; see `public/images/CREDITS.txt`), wired
through each content entry's `image:` frontmatter and the hero slots. The CSS gradient
`plate-*` classes remain as the fallback shown if an image is ever missing.

A house grade is applied uniformly in CSS (`saturate .8 · sepia .12 · brightness .97`) so
mixed sources read as one collection — warm, calm, shadows toward ink. The hero also ships
AVIF + responsive JPEG variants (`hero-dusk-{800,1280,1600}`) via `<picture>`/`srcSet`.

To swap in client-licensed photography, drop the file in `public/images/` and point the
entry's `image:` at it (same filename = zero code change). Direction: architecture, material,
light. Never handshakes, staged offices, or HDR skylines.

**Hero video (optional):** the hero ships as layered motion (ken-burns + light bloom) because no
footage is licensed yet. To use a video, drop a muted/looping clip at `public/videos/hero.webm`
(+ an `.mp4` fallback) and set `HERO_VIDEO` in `app/components/HeroSequence.tsx`. It plays over the
ken-burns still, which stays as the poster and the reduced-motion frame. Keep it short, dark, and
calm (a slow dusk skyline), graded to the house look.

## Configuration

Copy `.env.example` to `.env`:

- `VITE_AMELIA_URL` — REMOVED. The Amelia surface was taken out of the beta; the
  variable is no longer read by anything and can be deleted from .env / Vercel.
- (historic) all Amelia CTAs used to route through
  `/amelia` (the gateway) and exit here with `ref`/`context` params for attribution.
- `VITE_GA_ID` — GA4 id. Analytics loads **only after cookie consent**; declining loads nothing.
- `VITE_CONTACT_ENDPOINT` — POST target for the contact form (e.g. Formspree).

## Before launch

- [ ] Replace the placeholder RERA licence number in `app/lib/site.ts` (`SITE.rera`) — it
      appears in the footer, About, FAQs, and Developers pages automatically.
- [ ] **Set the SMTP variables** (`SMTP_*`, `MAIL_FROM`, `MAIL_TO`) in Vercel — the
      contact form does nothing without them. Verify with `npm run smtp:check`.
      See [BACKEND.md](BACKEND.md).
- [ ] Leave `VITE_CONTACT_ENDPOINT` **unset** unless replacing `/api/submit` with an
      external service. Set `VITE_GA_ID` if analytics is wanted.
- [ ] Have counsel review `/content/legal/*.md` (marked as drafts).
- [ ] Replace the Unsplash placeholder photography with client-licensed/commissioned imagery
      per the imagery direction (filenames in `public/images/` are stable swap slots).
- [ ] Update `BASE` in `scripts/generate-sitemap.mjs` + `SITE.url` if the domain differs
      (both currently point at the placeholder `serene.com`).
- [ ] Confirm the legal entity name in `SITE.legalName` and the office address in `SITE.office`.
- [ ] **Have a UAE-qualified adviser verify `app/lib/offplan.ts` in full.** The /off-plan
      explainer is the one page whose facts come from outside the strategy document — the
      document is Dubai-only, so the Emirate comparison, payment-plan structures and fee
      lines were researched separately and each carries a source link. Regulation and fees
      change; the Emirate rows in particular need signing off before launch.
- [ ] Review `app/lib/strategy.ts`: the four market figures each carry a published source. If a
      figure is refreshed, update its `source`/`href` with it. **No figure on this site describes
      Serene's own performance** — that is deliberate, and should stay that way until there
      are audited numbers to publish.
- [ ] Confirm the vetted specialist panel behind lifecycle stages 3, 5, 6, 7 and 8 (snagging
      firms, mortgage advisors, interior designers, property managers, legal counsel) before the
      lifecycle page's "introduced, never required" claim goes live.

## Brand invariants (enforced in code — don't undo them)

Source of truth: `brand-assets/brand-tokens.md` (colours · type · logo · voice).

Anek Latin only, weight-led hierarchy · gold **fill** once per page (the Amelia action) — gold
elsewhere only as an *edge/accent* (rails, ticks, hairlines) · Brass/Fog run in-family deepened
(`#8a6420` / `#6b6357`) so gold-toned text and captions pass WCAG AA on ivory (brand `#A97C2F` /
`#7D7568` remain the graphic/print values) · Deep Navy surfaces belong to Amelia exclusively ·
radius 0 · the supplied mark artwork only — **metallic silver on light, white on dark**, never
recoloured gold, 32px minimum · voice is composed · elevated · enduring (no exclamations, no
"luxury lifestyle," no expiring dates) · all motion collapses under `prefers-reduced-motion` and
every route prerenders complete.

Motion intensity is dialled to "maximal / cinematic" per client direction (Jul 2026) — split-text,
expressive easing, animated light — but stays elegant, never distracting.
