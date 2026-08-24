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
export function humanise(value: string | null | undefined): string | null {
  if (!value) return null;
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

/** The permit line is a compliance requirement, not decoration. */
export function permitLabel(number: string | null | undefined): string | null {
  return number ? `Trakheesi permit ${number}` : null;
}
