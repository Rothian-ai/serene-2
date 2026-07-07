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
  hours: "Sunday–Friday, 9:00–18:00 GST",
} as const;

/**
 * Amelia — the external AI sales platform. The single integration point:
 * set VITE_AMELIA_URL in .env for the production destination.
 */
export const AMELIA_URL: string =
  (import.meta.env.VITE_AMELIA_URL as string | undefined) ?? "https://amelia.serene.com";

export function ameliaHref(ref: string, context?: string): string {
  const url = new URL(AMELIA_URL);
  url.searchParams.set("ref", ref);
  if (context) url.searchParams.set("context", context);
  return url.toString();
}

export function pageTitle(title?: string): string {
  return title ? `${title} — Serene` : "Serene — Off-Plan Real Estate, Dubai & Abu Dhabi";
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
