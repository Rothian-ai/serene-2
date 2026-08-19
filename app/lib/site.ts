/** Single source of site-level constants and integration points. */

export const SITE = {
  name: "Serene",
  legalName: "Serene Real Estate LLC",
  tagline: "Serenity, elevated.",
  descriptor: "Real Estate & Curated Addresses",
  url: "https://serene.com",
  /** PLACEHOLDER — replace with the client's real RERA licence number before launch. */
  rera: "RERA Licence № 41273",
  email: "enquiries@serene.com",
  careersEmail: "careers@serene.com",
  office: "Boulevard Plaza Tower One, Downtown Dubai",
  hours: "Sunday to Friday, 9:00 to 18:00 GST",
} as const;

/**
 * Amelia — the external AI sales platform. The single integration point:
 * set VITE_AMELIA_URL in .env for the production destination.
 */
const AMELIA_FALLBACK = "https://amelia.rothian.com/login";

/**
 * A trimmed, non-empty env value wins; anything blank falls back. Note `||`,
 * not `??`: an env var that exists but is empty (a real deployment case, e.g.
 * a blank value in Vercel) must NOT win, or every ameliaHref() call throws.
 */
export const AMELIA_URL: string =
  (import.meta.env.VITE_AMELIA_URL as string | undefined)?.trim() || AMELIA_FALLBACK;

export function ameliaHref(ref: string, context?: string): string {
  const params = new URLSearchParams({ ref, ...(context ? { context } : {}) });
  // A malformed AMELIA_URL must never throw here: this runs during prerender,
  // so one bad value would fail the entire production build.
  try {
    const url = new URL(AMELIA_URL);
    params.forEach((value, key) => url.searchParams.set(key, value));
    return url.toString();
  } catch {
    const base = AMELIA_URL || AMELIA_FALLBACK;
    return `${base}${base.includes("?") ? "&" : "?"}${params}`;
  }
}

export function pageTitle(title?: string): string {
  return title ? `${title} · Serene` : "Serene · Off-Plan Real Estate, Dubai & Abu Dhabi";
}

export function meta(opts: { title?: string; description: string; path?: string }) {
  const title = pageTitle(opts.title);
  return [
    { title },
    { name: "description", content: opts.description },
    { property: "og:title", content: title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Serene" },
    ...(opts.path ? [{ tagName: "link", rel: "canonical", href: SITE.url + opts.path }] : []),
  ];
}
