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

/* ——— Where "Request a conversation" goes ———
 *
 * Amelia runs a WhatsApp Business account: it is the channel behind the buyer
 * signup's `amelia_auth_code` verification. What the Partner API does NOT
 * publish is a click-to-chat number, so the destination cannot be derived from
 * the catalogue and has to be configured.
 *
 * Every conversation CTA is a WhatsApp thread, pre-filled with the page it came
 * from. VITE_AMELIA_WHATSAPP overrides the number below.
 *
 * Worth stating plainly, because it is a trade and not a free upgrade: the
 * contact form is what writes to the database and fires the SMTP notification,
 * so enquiries that arrive over WhatsApp do not appear in /dashboard. The form
 * is still live at /contact, reachable from the footer and from the prose links
 * that offer an advisor, so nothing is unreachable — but the buttons no longer
 * lead there.
 */
/**
 * Amelia's WhatsApp Business number, in full international form. Set as the
 * default rather than read only from the environment, so the CTAs work on a
 * fresh clone and on production without anyone editing Vercel. The env var
 * still wins, which is how it gets changed or emptied later.
 */
const WHATSAPP_FALLBACK = "971585862377";

const WHATSAPP_NUMBER =
  ((import.meta.env.VITE_AMELIA_WHATSAPP as string | undefined) ?? WHATSAPP_FALLBACK)
    .replace(/[^\d]/g, "")
    .trim() || WHATSAPP_FALLBACK;

/** True once a usable number is configured; a stray "+" or spaces are fine. */
export const HAS_WHATSAPP = Boolean(WHATSAPP_NUMBER && WHATSAPP_NUMBER.length >= 8);

/**
 * The destination for a conversation CTA. `context` is folded into the opening
 * message so an advisor sees which page it came from without asking.
 */
export function conversationHref(context?: string): string {
  if (!HAS_WHATSAPP) return "/contact";
  const opening = context
    ? `Hello Serene, I would like to talk about ${context}.`
    : "Hello Serene, I would like to speak with an advisor.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(opening)}`;
}

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
