# Adding content

The beta site is informative: it explains the Serene model and the market it
exists to answer. It carries **no property inventory and no developer
partnerships**, because the strategy names none — the partner network is still to
be formalised (see `docs/serene-bay-value-chain-strategy.md`, §7).

So there are two kinds of editable content:

| What | Where | Edited how |
|---|---|---|
| Journal articles | `content/insights/*.md` | CMS at `/admin`, or by hand |
| Legal pages | `content/legal/*.md` | By hand (counsel-reviewed) |

Everything else on the site — the four commitments, the nine lifecycle stages,
the comparison table, the market figures — is **not** content. It lives in
`app/lib/strategy.ts`, because it is the positioning rather than editorial. Edit
that module and every page that composes from it updates together.

## 1. With the CMS (recommended for the journal)

The site ships a [Decap CMS](https://decapcms.org) admin. For local editing you
run two things side by side:

```bash
npm run dev
```

```bash
npm run cms
```

Then open **http://localhost:4321/admin/**. No login is needed in local mode.
Pick **Insights**, fill the form, upload images, and **Save** — Decap writes the
markdown file into `content/insights/` and any uploaded images into
`public/images/`. Review the change, then commit and push; your host rebuilds and
the article goes live.

> Images uploaded through the CMS land in `public/images/` and are referenced as
> `/images/<file>` — the same convention the existing content uses.

## 2. By hand

Copy an existing file in `content/insights/`, rename it (the **filename is the
URL slug** — e.g. `why-independent-snagging-matters.md` becomes
`/insights/why-independent-snagging-matters`), and edit the YAML:

```yaml
---
title: 'How Late Dubai Off-Plan Projects Actually Run'
category: Market Analysis # Market Analysis | Buyer Guides | The Model | Journal
date: '2026-08-01'
readingTime: 5 min
excerpt: One or two sentences for the cards and the listing page.
featured: 2 # optional; the journal sorts by date, so this is informational
image: /images/ins-supply.jpg
plate: render # hero | render | stone | interior | dusk | glass
---

Body in markdown. `##` headings structure the article.
```

## House rules for journal content

These are not style preferences — they are the reason the site is credible.

- **No figures about Serene.** No transaction volume, no returns, no years
  of trading, no client counts, no awards. It is a new house. Every number on
  this site is a published *market* figure with its source named and linked.
- **Cite market claims.** If an article states a market fact, link the source at
  the point of use or in a closing `**Source:**` line. The strategy document's
  own source list is the starting point.
- **No named developer partnerships or projects.** Discuss developers as a
  category — delivery records, tiering, incentives — not as partners.
- **No guarantees.** Delays, yields and lending terms are described as ranges
  drawn from published research, never as promises.

## Publishing / remote editing

Content is compiled at **build time**, so a new file appears after the next
build/deploy. Point your host at the repo so a push auto-rebuilds.

To let a non-technical editor manage the journal remotely (no repo, from the live
`/admin`), set the real GitHub `repo` in `public/admin/config.yml` and add a
GitHub OAuth provider or Decap Cloud — then each save commits to the branch and
triggers a rebuild.
