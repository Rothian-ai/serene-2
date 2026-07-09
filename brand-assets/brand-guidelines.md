# Brand Guidelines & Design Tokens

This document is the single source of truth for the design system. It contains two
layers:

1. **Rothian Digital base tokens** — the foundational design-token system (colors,
   type, spacing, radii, elevation, motion) used across all artifacts.
2. **Blue & Platinum palette (v2, platinum-led)** — the active color scheme for this
   project, which sits on top of the base tokens.


---

## 1. Rothian Digital — Base Design Tokens

These are defined as CSS custom properties on `:root`.

### Brand colors

| Token | Hex | Role |
|---|---|---|
| `--rd-orange` | `#EE8722` | Digital Orange — primary |
| `--rd-orange-600` | `#D9741A` | hover / pressed |
| `--rd-orange-50` | `#FDF1E4` | surface tint |
| `--rd-blue` | `#293479` | Rothian Blue — backgrounds |
| `--rd-blue-900` | `#1B2257` | darker blue |
| `--rd-blue-50` | `#E7E9F2` | light blue tint |
| `--rd-purple` | `#A8187A` | Digital Purple — accent |
| `--rd-purple-700` | `#8B1265` | darker purple |
| `--rd-purple-50` | `#F6E4F0` | light purple tint |

### Neutrals

| Token | Hex | Role |
|---|---|---|
| `--rd-ink` | `#0E1230` | text on light |
| `--rd-ink-2` | `#3A3F5E` | secondary text |
| `--rd-ink-3` | `#6A6F8A` | tertiary text |
| `--rd-line` | `#E4E5EE` | hairlines / borders |
| `--rd-surface` | `#FFFFFF` | base surface |
| `--rd-surface-2` | `#F7F7FB` | page background |
| `--rd-surface-3` | `#EEEFF5` | card background on light |
| `--rd-on-dark` | `#FFFFFF` | text on dark |
| `--rd-on-dark-2` | `#B9BEE0` | secondary text on dark |
| `--rd-on-dark-3` | `#7B81AE` | tertiary text on dark |

### Semantic colors

| Token | Hex | Role |
|---|---|---|
| `--rd-success` | `#169B62` | success |
| `--rd-warning` | `#E2A336` | warning |
| `--rd-danger` | `#D03A3A` | danger / error |
| `--rd-info` | `#2E6BE6` | info |

### Signature gradients

| Token | Value | Name |
|---|---|---|
| `--rd-grad-sunset` | `linear-gradient(90deg, #EE8722 0%, #A8187A 100%)` | Sunset Bloom |
| `--rd-grad-velocity` | `linear-gradient(90deg, #EE8722 0%, #293479 100%)` | Velocity |
| `--rd-grad-depth` | `linear-gradient(90deg, #293479 0%, #A8187A 100%)` | Depth |
| `--rd-grad-sunset-radial` | `radial-gradient(120% 80% at 0% 100%, #EE8722 0%, #A8187A 100%)` | Sunset (hero radial) |
| `--rd-grad-depth-radial` | `radial-gradient(120% 90% at 100% 0%, #A8187A 0%, #293479 70%)` | Depth (hero radial) |

### Semantic token aliases

- `--fg-1` = `--rd-ink`, `--fg-2` = `--rd-ink-2`, `--fg-3` = `--rd-ink-3`
- `--bg-1` = `--rd-surface`, `--bg-2` = `--rd-surface-2`, `--bg-3` = `--rd-surface-3`
- `--border-1` = `--rd-line`
- `--accent` = `--rd-orange`, `--accent-strong` = `--rd-purple`

### Spacing scale (4px base)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

### Radii

| Token | Value |
|---|---|
| `--radius-xs` | 4px |
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 18px |
| `--radius-xl` | 28px |
| `--radius-pill` | 999px |

### Elevation (soft, multi-layer; warm-tinted)

| Token | Value |
|---|---|
| `--shadow-1` | `0 1px 2px rgba(14,18,48,0.06), 0 1px 1px rgba(14,18,48,0.04)` |
| `--shadow-2` | `0 4px 12px rgba(14,18,48,0.08), 0 1px 3px rgba(14,18,48,0.06)` |
| `--shadow-3` | `0 12px 32px rgba(14,18,48,0.12), 0 4px 10px rgba(14,18,48,0.06)` |
| `--shadow-4` | `0 24px 60px rgba(14,18,48,0.18), 0 8px 20px rgba(14,18,48,0.08)` |
| `--shadow-glow-orange` | `0 8px 24px rgba(238,135,34,0.32)` |
| `--shadow-inner` | `inset 0 1px 0 rgba(255,255,255,0.6)` |

### Motion

| Token | Value |
|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--duration-fast` | 120ms |
| `--duration-base` | 200ms |
| `--duration-slow` | 360ms |

---

## 2. Typography

### Font families

- `--font-sans`: `"Inter", "Calibri", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- `--font-mono`: `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace`

### Type scale

Display styles are tight and heavy (headlines, hero statements). Body styles use
generous leading.

| Style | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|
| Display 1 | 88px | 0.96 | 800 | -0.03em |
| Display 2 | 64px | 1.00 | 800 | -0.025em |
| Display 3 | 48px | 1.04 | 700 | -0.02em |
| H1 | 36px | 1.12 | 700 | -0.015em |
| H2 | 28px | 1.18 | 700 | -0.01em |
| H3 | 22px | 1.25 | 600 | -0.005em |
| H4 | 18px | 1.35 | 600 | 0 |
| Body large | 18px | 1.55 | — | — |
| Body | 16px | 1.55 | — | — |
| Body small | 14px | 1.5 | — | — |
| Caption | 12px | 1.4 | — | — |
| Eyebrow / overline | 12px | — | 600 | 0.14em (uppercase) |

### Type utility classes

- `.rd-display-1`, `.rd-display-2`, `.rd-display-3`
- `.rd-h1`, `.rd-h2`, `.rd-h3`, `.rd-h4`
- `.rd-body-lg`, `.rd-body`, `.rd-body-sm`, `.rd-caption`
- `.rd-eyebrow` — uppercase, tracked, colored `--rd-orange`
- `.rd-text-sunset` / `.rd-text-velocity` — gradient-clipped text
- `.rd-on-dark` — sets text to `--rd-on-dark`

### Base styles

- `html { color-scheme: light; }`
- Body uses `--font-sans`, `--fg-1` on `--bg-1`, `font-size:16px`, `line-height:1.55`,
  antialiased, `text-rendering: optimizeLegibility`.

---

## 3. Blue & Platinum Palette (v2 — Platinum-led)

**Concept:** Platinum leads as the primary material and neutral. Blue does the heavy
lifting alongside it, running the full range from deep navy to powder. Gold appears
rarely — reserved for a single moment of value per surface. The overall feel is cool,
engineered, and quietly premium.

**Two co-primaries:** Blue and Platinum. Everything on a surface is built from these
two ramps. Gold is accent only.

### Blue ramp (navy → powder) — depth, trust

| Name | Hex |
|---|---|
| Navy | `#111C39` |
| Deep Slate | `#3C496B` |
| Slate Blue | `#55638A` |
| Dusk | `#6E7CA3` |
| Periwinkle | `#8793B3` |
| Anchor | `#9DA9C2` |
| Haze | `#B9C2D5` |
| Mist | `#DCE1EB` |

### Platinum / Silver ramp (graphite → pearl) — PRIMARY

| Name | Hex |
|---|---|
| Graphite | `#464B53` |
| Slate | `#6B7078` |
| Steel | `#8A9099` |
| Silver | `#AEB4BD` |
| Platinum | `#CBCFD6` |
| Frost | `#E1E4E8` |
| Pearl | `#F3F4F7` |

### Gold ramp — ACCENT ONLY

Used rarely: one award, one highlight, or one seal per surface — never as a fill.

| Name | Hex |
|---|---|
| Antique | `#A67C00` |
| Gold | `#C9A227` |
| Champagne | `#E3C765` |

### Supporting / page colors seen in the showcase

| Purpose | Hex |
|---|---|
| Page background (dark) | `#0a1526` |
| Card background on dark | `#101d33` |
| Card border on dark | `rgba(255,255,255,0.08)` |
| Body text on dark | `#eef1f6` / `#eef1f4` |
| Muted text on dark | `#7f97b8` |
| Faint text / captions on dark | `#5f74a0` |
| Secondary heading tint | `#9DA9C2` |

---

## 4. Metallic Treatments

Platinum (and gold) become *metal* through the same recipe:

1. A diagonal multi-stop gradient: **highlight → mid → shadow → re-highlight**.
2. An inner light edge (`inset` highlight on top, `inset` shadow at the bottom).
3. A moving sheen band swept across the surface on a loop.

Gold uses the identical recipe but always appears small.

### Polished platinum (primary metal plate)

- Gradient: `linear-gradient(135deg, #ffffff 0%, #dfe3e8 14%, #aeb4bd 32%, #eef1f4 48%, #9aa0a9 64%, #cfd4da 82%, #eef1f4 100%)`
- Simplified stop reference: `#ffffff → #9aa0a9 → #eef1f4`
- Box-shadow: `inset 0 2px 1px rgba(255,255,255,0.85), inset 0 -3px 6px rgba(60,66,78,0.35), 0 14px 34px rgba(0,0,0,0.45)`

### Brushed platinum

- `repeating-linear-gradient(90deg, #d7dbe0 0px, #eef1f4 2px, #bcc2cb 4px, #e4e7eb 6px)`
- Box-shadow: `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,66,78,0.3)`

### Brushed gold (sliver, for emphasis only)

- `repeating-linear-gradient(90deg, #c9a227 0px, #e9d488 2px, #a67c00 4px, #e3c765 6px)`
- Box-shadow: `inset 0 1px 0 rgba(255,255,255,0.5)`

### Platinum seal (conic "coin")

- `conic-gradient(from 210deg, #eef1f4, #9aa0a9, #f7f8fa, #aeb4bd, #eef1f4, #8a9099, #eef1f4)`
- Inner disc: `linear-gradient(135deg, #e8ebef, #b9bfc8)`
- Shadow: `0 10px 24px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.8)`

### Gold seal (small)

- `conic-gradient(from 210deg, #f3e3a6, #a67c00, #fdf1c0, #c9a227, #e9d488, #8a6a15, #f3e3a6)`
- Inner disc: `linear-gradient(135deg, #e9d488, #c9a227)`
- Shadow: `0 6px 14px rgba(0,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.6)`

### Moving sheen animation

```css
@keyframes sheensweep {
  0%        { transform: translateX(-120%) skewX(-18deg); }
  60%, 100% { transform: translateX(220%)  skewX(-18deg); }
}
```

Applied as an overlay band roughly 34–36% wide:
`linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)`
with `animation: sheensweep 5.5s–6s var(--ease-out) infinite;` and
`pointer-events: none;`.

---

## 5. Controls & Components

### Buttons

- **Platinum primary** (metallic): `background: linear-gradient(180deg, #f7f8fa 0%, #dfe3e8 40%, #b9bfc8 60%, #e4e7eb 100%)`; text `#2b3038`, weight 700; `box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 14px rgba(0,0,0,0.3)`; radius 12px.
- **Blue secondary** (flat): `background: #2E3A56`; text `#DCE1EB`, weight 700; `border: 1px solid rgba(157,169,194,0.45)`; radius 12px.

### Pills / tags

- **Platinum ("Verified"):** `linear-gradient(135deg, #f7f8fa, #b9bfc8)`, text `#2b3038`.
- **Blue:** `#2E3A56`, text `#DCE1EB`, `border: 1px solid rgba(157,169,194,0.35)`.
- **Gold ("Award"):** `linear-gradient(135deg, #f3e3a6, #c9a227)`, text `#5a4410`.
- All pills: 11px, weight 700, `letter-spacing:0.08em`, uppercase, radius 999px.

### Links

- Default `#9DA9C2`; hover `#DCE1EB` with underline, `text-underline-offset:3px`.

---

## 6. Palette Combination Recipes

Platinum and blue carry each ratio; the gold sliver is the only warm note. Ratios
are the relative flex widths of four bands (`c1`–`c4` with weights `r1`–`r4`).

**Platinum Field** — Platinum dominant, slate-blue for structure, a whisper of gold.
- Bands: `#E1E4E8` (7) · `#55638A` (3) · `#AEB4BD` (3) · `#C9A227` (0.5)

**Navy & Silver** — Deep navy with a broad silver band; gold barely present.
- Bands: `#111C39` (5) · `#AEB4BD` (4) · `#9DA9C2` (2) · `#C9A227` (0.4)

**Haze Frost** — Light and cool; periwinkle haze meets frost platinum.
- Bands: `#DCE1EB` (5) · `#CBCFD6` (4) · `#6E7CA3` (2) · `#C9A227` (0.4)

---

## 7. Usage Rules (summary)

- **Platinum leads.** It is the primary material and neutral; silver carries whole
  surfaces.
- **Blue is the co-primary.** Use the full navy→powder ramp for depth and structure.
- **Gold is accent only.** One award / highlight / seal per surface. Never a fill.
- **Metal = gradient + inner light edge + moving sheen.** Same recipe for gold, but
  gold always appears small.
- **Type is Inter** for everything; JetBrains Mono for numeric/code/label detail
  (e.g. card numbers, hex codes).
- Example applied artefact (membership card): platinum metallic body, a navy→slate
  blue top band, and a single small gold star seal. Card number set in JetBrains Mono.
