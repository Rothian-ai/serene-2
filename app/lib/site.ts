/** Single source of site-level constants and integration points. */

import { tryAmeliaHref } from "./amelia";

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
 * By default every conversation CTA is a WhatsApp thread, pre-filled with the page it came
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
 * message so Amelia sees which page it came from without asking.
 *
 * The openers deliberately do not ask for "an advisor" (6 Sep 2026): Amelia
 * answers first, and a message that only asks for a person made her hand the
 * thread to the team before helping. "Chat", not "speak": nobody is speaking.
 */
export function conversationHref(context?: string, via?: string): string {
  if (!HAS_WHATSAPP) return "/contact";
  const opening = context
    ? `Hello Serene, I'd like to chat about ${context}.`
    : "Hello Serene, I'd like to explore your properties.";
  // The opener is exactly what the visitor sees in their WhatsApp box, so it
  // carries no page marker: "via:header" read as junk to the people who
  // clicked (7 Sep 2026). The page of origin still reaches the chat route as
  // utm_campaign (askHref); on WhatsApp the topic itself says which property.
  void via;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(opening)}`;
}

/** Lower-case, dashes for anything that is not a letter or digit, at most 60 chars. */
export function viaCode(input?: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/* ——— Where "Ask Amelia" goes: WhatsApp, the no-account web chat, or both ———
 *
 * VITE_AMELIA_ASK_MODE (build-time, read once):
 *   whatsapp  every CTA opens a WhatsApp thread — today's behaviour, the default
 *   chat      every CTA opens Amelia's no-sign-up chat on our Amelia domain
 *   both      the CTA opens the chat and a small line beside it offers WhatsApp
 * Unset or unrecognised falls back to `whatsapp`, so a fresh clone and
 * production behave as they always have until someone chooses otherwise. The
 * platform side of the chat is switched on separately; pointing at it before
 * then shows a polite "not available" page, which is why the default stays
 * put. Rolling back is setting the mode to whatsapp and redeploying.
 */
export type AskMode = "whatsapp" | "chat" | "both";

const ASK_MODE_FALLBACK: AskMode = "whatsapp";

function readAskMode(): AskMode {
  const raw = (import.meta.env.VITE_AMELIA_ASK_MODE as string | undefined)?.trim().toLowerCase();
  return raw === "chat" || raw === "both" || raw === "whatsapp" ? raw : ASK_MODE_FALLBACK;
}

export const ASK_MODE: AskMode = readAskMode();

/** True when the primary "Ask Amelia" action is the web chat rather than WhatsApp. */
export const CHAT_FIRST = ASK_MODE !== "whatsapp";

/** True when a WhatsApp link should sit beside a chat-first CTA (`both`). */
export const WHATSAPP_ASIDE = ASK_MODE === "both" && HAS_WHATSAPP;

/**
 * Whether the primary action is an external anchor (new tab) rather than a
 * route Link. Both real destinations are off-site; only the no-number fallback
 * to /contact is a route.
 */
export const ASK_EXTERNAL = CHAT_FIRST || HAS_WHATSAPP;

/**
 * The primary "Ask Amelia" destination for a CTA. `context` is the subject the
 * visitor is asking about, `via` the page marker, `slug` a property when the
 * CTA sits on one. In whatsapp mode this is exactly conversationHref().
 */
export function askHref(opts: { context?: string; via?: string; slug?: string | null } = {}): string {
  if (!CHAT_FIRST) return conversationHref(opts.context, opts.via);
  return tryAmeliaHref({ slug: opts.slug, context: opts.slug ? undefined : opts.context, via: opts.via ?? (viaCode(opts.context) || undefined) });
}

/**
 * The reassurance line under a CTA. WhatsApp mode keeps whatever the page said
 * before (passed in); chat modes explain that nothing is asked up front.
 */
export function askFootnote(whatsappCopy: string): string {
  if (!CHAT_FIRST) return whatsappCopy;
  return "No account and no details to start. Amelia answers first; you share one detail when you want a brochure, a quote, a viewing or your own portal, or to carry on after a long conversation. You will not be added to a calling list. Ever.";
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
