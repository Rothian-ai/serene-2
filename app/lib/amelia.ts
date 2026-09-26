/**
 * Amelia buyer-funnel links and listing formatters — safe on the client.
 *
 * Only public values live here: the white-label domain and slugs. The API key
 * and every catalogue fetch stay in `amelia.server.ts`.
 */

const PUBLIC_BASE = (
  (import.meta.env.VITE_AMELIA_PUBLIC_BASE as string | undefined)?.trim() ||
  "https://amelia.serenebay.ae"
).replace(/\/+$/, "");

/** Attribution the platform reads back for campaign + advisor routing. */
const UTM = "utm_source=serenebay.ae&utm_medium=website";

/**
 * The conversion target for every property CTA: verified buyer signup with the
 * property attached. The visitor verifies email + WhatsApp, sets a password, and
 * lands back on this property inside the buyer portal with the lead attributed.
 */
export function buyerSignupHref(slug: string): string {
  return `${PUBLIC_BASE}/buyer/signup?project=${encodeURIComponent(slug)}&${UTM}`;
}

/** Stands in for a value the record does not carry, in table cells where a
 *  blank would read as a broken row. A centred dot, never a dash. */
export const EMPTY = "·";

/** Direct portal deep link — signed-in buyers land here; others are routed
 *  through login/signup and arrive afterwards. */
export function buyerPropertyHref(slug: string): string {
  return `${PUBLIC_BASE}/buyer/p/${encodeURIComponent(slug)}?${UTM}`;
}

/** Public, permit-compliant brochure page. No login, shareable. */
export function brochureHref(slug: string): string {
  return `${PUBLIC_BASE}/p/${encodeURIComponent(slug)}`;
}

/* ——— formatters. Every catalogue field is nullable, so each returns null
       rather than "AED null", and callers omit the line. ——— */

/** 1_200_000 → "AED 1.2M". Compact because these sit in ledger cells. */
export function money(value: number | null | undefined, currency = "AED"): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const c = currency || "AED";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${c} ${(m >= 100 ? Math.round(m) : Number(m.toFixed(m >= 10 ? 1 : 2)))}M`;
  }
  if (value >= 1_000) return `${c} ${Math.round(value / 1_000)}K`;
  return `${c} ${value.toLocaleString("en-GB")}`;
}

/** A band reads as one figure when both ends match, or when only one is given. */
export function priceRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "AED",
): string | null {
  const lo = money(min, currency);
  const hi = money(max, currency);
  if (lo && hi) return lo === hi ? lo : `${lo} to ${hi}`;
  return lo ?? hi ?? null;
}

/** "UnderConstruction" → "Under construction". The API uses PascalCase enums. */
export function humanise(value: unknown): string | null {
  // the record nests in places the guide reads as flat, so a caller can hand
  // this an object; anything but a non-empty string has no label to make
  if (typeof value !== "string" || !value.trim()) return null;
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

/** [1,2,3] → "1, 2 & 3 bed". */
export function bedrooms(list: number[] | null | undefined): string | null {
  const beds = (list ?? []).filter((n) => typeof n === "number").sort((a, b) => a - b);
  if (beds.length === 0) return null;
  const label = beds.map((n) => (n === 0 ? "Studio" : String(n)));
  const last = label.pop()!;
  return `${label.length ? `${label.join(", ")} & ` : ""}${last} bed`;
}

export function perSqft(value: number | null | undefined, currency = "AED"): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return `${currency || "AED"} ${Math.round(value).toLocaleString("en-GB")}/sqft`;
}

/** A size band in whole square feet, "420 to 440 sqft". One figure when only
 *  one end is filed, or when both ends round to the same number. */
export function sqftRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string | null {
  const whole = (v: number | null | undefined) =>
    typeof v === "number" && Number.isFinite(v) ? Math.round(v).toLocaleString("en-GB") : null;
  const lo = whole(min);
  const hi = whole(max);
  if (lo && hi) return lo === hi ? `${lo} sqft` : `${lo} to ${hi} sqft`;
  const one = lo ?? hi;
  return one ? `${one} sqft` : null;
}

/** A per-sqft rate that may be a range. When `max` is set, `value` is the
 *  lower end: "AED 14 to 15/sqft". A max with no lower end is not shown. */
export function perSqftRange(
  value: number | null | undefined,
  max: number | null | undefined,
  currency = "AED",
): string | null {
  const one = perSqft(value, currency);
  if (!one || typeof max !== "number" || !Number.isFinite(max)) return one;
  const lo = Math.round(value as number);
  const hi = Math.round(max);
  if (lo === hi) return one;
  return `${currency || "AED"} ${lo.toLocaleString("en-GB")} to ${hi.toLocaleString("en-GB")}/sqft`;
}

/** A percentage that may be a range: "7%", or "7 to 8%" when `max` is set.
 *  The feed's percentages are already percentage numbers (7 = 7%). */
export function pctRange(
  value: number | null | undefined,
  max: number | null | undefined,
): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (typeof max !== "number" || !Number.isFinite(max) || max === value) return `${value}%`;
  return `${value} to ${max}%`;
}

/** The permit line is a compliance requirement, not decoration. */
export function permitLabel(number: string | null | undefined): string | null {
  return number ? `Trakheesi permit ${number}` : null;
}

/** "2027-03-31T00:00:00Z" → "31 Mar 2027". Catalogue dates are ISO strings and
 *  every one of them is nullable, so this returns null rather than "Invalid
 *  Date" and callers omit the row. */
export function dateLabel(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ——— sized image variants (2 Sep feed update) ———
   Catalogue media URLs accept ?w=320|480|640|960|1280|1920 and answer with a
   webp resized to that width. Originals are multi-MB photography; a card that
   hotlinks one ships thirty times the bytes it can display. External URLs and
   non-raster formats pass through untouched. */

const FEED_MEDIA = /\/api\/v1\/media\//;
const RASTER = /\.(jpe?g|png|webp)(?:$|\?)/i;
export type FeedImageWidth = 320 | 480 | 640 | 960 | 1280 | 1920;

export function sizedImage(
  url: string | null | undefined,
  width: FeedImageWidth,
): string | undefined {
  if (!url) return undefined;
  if (!FEED_MEDIA.test(url) || !RASTER.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
}

export function sizedSrcSet(
  url: string | null | undefined,
  widths: FeedImageWidth[],
): string | undefined {
  if (!url || !FEED_MEDIA.test(url) || !RASTER.test(url)) return undefined;
  return widths.map((w) => `${sizedImage(url, w)} ${w}w`).join(", ");
}

/** An amenity arrives as a plain string or as { name } / { label }; the pages
 *  only ever want the display name. */
export function amenityName(a: unknown): string | null {
  if (typeof a === "string") return a.trim() || null;
  if (a && typeof a === "object") {
    const o = a as { name?: unknown; label?: unknown };
    if (typeof o.name === "string" && o.name.trim()) return o.name.trim();
    if (typeof o.label === "string" && o.label.trim()) return o.label.trim();
  }
  return null;
}

/**
 * Coerce a catalogue value to something safe to render, or null.
 *
 * The record nests more deeply than the guide's prose suggests — `trust.rera`,
 * for instance, is an object, not a string. Passing one of those to a Ledger
 * cell renders an object as a React child, which throws and takes the whole
 * page to a 500. Truthiness is not enough of a check, because every object is
 * truthy: the value has to be a primitive to be displayable.
 */
export function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;
  // objects, arrays and booleans are not display values here
  return null;
}

/* ——— "Ask Amelia" with no account (Sep 2026) ———
   The platform's guest chat lives on our Amelia domain at /try/<slug> for a
   property and /try for the house in general. The visitor asks first and
   shares a detail only when it unlocks something (a brochure, a quote, a
   viewing). `via` is the same page marker the WhatsApp link carries; the
   platform stores it with the lead and shows the page of origin for both
   routes. `context` becomes the first line already typed into the chat. Whether a CTA points here or at WhatsApp
   is decided in site.ts (VITE_AMELIA_ASK_MODE). */
export function tryAmeliaHref(opts: { slug?: string | null; context?: string; via?: string } = {}): string {
  const path = opts.slug ? `/try/${encodeURIComponent(opts.slug)}` : "/try";
  const params = new URLSearchParams({ utm_source: "serenebay.ae", utm_medium: "website" });
  if (opts.via) params.set("utm_campaign", opts.via);
  if (opts.context) params.set("q", `I'd like to chat about ${opts.context}.`);
  return `${PUBLIC_BASE}${path}?${params.toString()}`;
}
