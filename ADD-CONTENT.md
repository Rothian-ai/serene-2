# Adding content

Every developer, development, and insight is a markdown file in `content/`, with
standard **YAML frontmatter** and the article text below it. Adding an entry =
adding a file. There are two ways to do it.

## 1. With the CMS (recommended)

The site ships a [Decap CMS](https://decapcms.org) admin. For local editing you
run two things side by side:

```bash
npm run dev    # the site, on http://localhost:4321
npm run cms    # the Decap local proxy (reads/writes your files), on :8081
```

Then open **http://localhost:4321/admin/**. No login is needed in local mode.
Pick a collection (Developments / Developers / Insights), fill the form, upload
images, and **Save** — Decap writes the markdown file into `content/…` and any
uploaded images into `public/images/`. Review the change, then commit and push;
your host rebuilds and the entry goes live.

> Images uploaded through the CMS land in `public/images/` and are referenced as
> `/images/<file>` — the same convention the existing content uses.

## 2. By hand

Copy an existing file in the same folder, rename it (the **filename is the URL
slug** — e.g. `vela-crest.md` → `/developments/vela-crest`), and edit the YAML.
Structured fields are YAML lists/objects:

```yaml
---
title: Example Tower
developer: emaar # a developer slug (a filename in content/developers)
district: Downtown Dubai
city: Dubai # Dubai | Abu Dhabi
status: Under construction
handover: Q4 2028
paymentPlan: 80 / 20
priceFrom: AED 3.2M
featured: 1 # optional: lower sorts earlier; omit if not featured
image: /images/example.jpg
plate: render # hero | render | stone | interior | dusk | glass
excerpt: "One line for cards and search."
amenities:
  - { icon: pool, label: Infinity Sky Pool }
  - { icon: gym, label: Fitness Floor }
gallery:
  - { src: /images/example-01.jpg, caption: "Exterior" }
landmarks:
  - { time: 5 min, place: The Dubai Mall }
reasons:
  - heading: The most liquid market
    body: "A sentence on why."
map: { lat: 25.1972, lng: 55.2744, zoom: 15 }
---

## The Residence

Markdown body goes here — `##` headings become the on-page section nav.
```

Amenity `icon` values map to the glyph set in `app/lib/amenities.ts`
(`pool, gym, spa, concierge, courts, parking, park, play, beach, cycling,
pavilion, retail`).

## Publishing / remote editing

Content is compiled at **build time**, so a new file appears after the next
build/deploy. Point your host (Vercel / Netlify / Cloudflare Pages) at the repo
so a push auto-rebuilds.

To let a non-technical editor manage content remotely (no repo, from the live
`/admin`), set the real GitHub `repo` in `public/admin/config.yml` and add a
GitHub OAuth provider or Decap Cloud — then each save commits to the branch and
triggers a rebuild.
