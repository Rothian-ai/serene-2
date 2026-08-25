/** Single source of site-level constants and integration points. */

export const SITE = {
  /** The title identity — browser tab, <title>, og:site_name, the wordmark. */
  name: "Serene",
  /**
   * How body copy refers to the house. The brand shows as "Serene Bay" and reads as
   * "Serene Bay": the mark and the page title stay short, while prose, legal
   * text and the comparison table use the full name.
   */
  contentName: "Serene Bay",
  legalName: "Serene Bay Real Estate LLC",
  tagline: "Serenity, elevated.",
  descriptor: "Off-Plan Buyer Advisory",
  /** The house line, as the copy of record states it. */
  positioning:
    "Off-plan advisory across Dubai and Abu Dhabi. Salaried advisors, cross-developer comparison, and a relationship that outlasts the handover.",
  /** PLACEHOLDER — replace with the client's real domain before launch. */
  url: "https://serene.com",
  /** PLACEHOLDER — replace with the client's real RERA licence number before launch. */
  rera: "RERA Licence № 41273",
  email: "enquiries@serene.com",
  careersEmail: "careers@serene.com",
  office: "Boulevard Plaza Tower One, Downtown Dubai",
  hours: "Sunday to Friday, 9:00 to 18:00 GST",
} as const;

/*
 * REMOVED FOR THE BETA — the Amelia gateway (AMELIA_URL / ameliaHref), the
 * scripted advisory simulation at /amelia, and the ask/dock/band surfaces.
 *
 * The contact form is the site's single call to action for now. A simulated
 * conversation that is not the real product also sits badly on a site whose
 * whole argument is that it tells buyers the truth, so it comes back only when
 * the platform is real. VITE_AMELIA_URL is no longer read by anything.
 *
 * Recover with: git log --diff-filter=D -- app/routes/amelia.tsx
 */

export function pageTitle(title?: string): string {
  return title
    ? `${title} · Serene`
    : "Serene · Off-Plan Buyer Advisory, Dubai & Abu Dhabi";
}

export function meta(opts: { title?: string; description: string; path?: string }) {
  const title = pageTitle(opts.title);
  return [
    { title },
    { name: "description", content: opts.description },
    { property: "og:title", content: title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE.name },
    ...(opts.path ? [{ tagName: "link", rel: "canonical", href: SITE.url + opts.path }] : []),
  ];
}
