/**
 * GA4 under Google Consent Mode v2. The tag loads for every visitor; consent
 * governs the COOKIE, not whether measurement happens.
 * Set VITE_GA_ID in .env (e.g. G-XXXXXXXXXX). Empty disables it entirely.
 *
 * Until 28 Oct 2026 nothing loaded until the visitor accepted, which meant GA4
 * could only ever report the consenting slice of the audience — the reason its
 * figures never matched Amelia's, which has always run cookie-free for
 * everyone. Now both measure the same people.
 *
 * What consent actually switches:
 *   denied  (default, and after a decline)  no cookie, no persistent id, no
 *           cross-visit stitching. GA4 receives a cookieless ping and models
 *           the rest. Nothing is written to the device, so there is nothing
 *           for the notice to have to ask about.
 *   granted (after an accept)               the ordinary _ga cookie and the
 *           full behavioural picture.
 *
 * The notice therefore still tells the truth when it says declining sets no
 * cookies — see content/legal/cookies.md, which has to stay in step with this.
 *
 * Three things this has to get right that a stock gtag snippet does not:
 *
 * 1. This is a single-page app. `config` sends one page_view on load and React
 *    Router then swaps routes without a document load, so every page after the
 *    first was invisible to GA4 — sessions looked one page deep and no inner
 *    page had traffic. We send page_view ourselves on navigation instead
 *    (`send_page_view: false`), which is the documented SPA setup.
 *
 * 2. Consent arrives after the visitor has already done things. Events fired
 *    before gtag exists used to vanish, because `window.gtag?.()` is a no-op
 *    when undefined. They queue now and flush on load, so the click that
 *    triggered the banner is not the one measurement misses.
 *
 * 3. The consent default must reach the dataLayer BEFORE gtag.js is fetched,
 *    or the library has already decided it may use storage by the time we say
 *    otherwise. That is why the `consent` command below is pushed first and
 *    the <script> is appended last.
 */

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim() ?? "";

/** True when a measurement ID is compiled in. Useful for diagnostics. */
export const ANALYTICS_CONFIGURED = Boolean(GA_ID);

/**
 * Paths no analytics may see, GA4 or otherwise.
 *
 * /dashboard is the admin's submissions list and its filter is a GET form over
 * "name, email, message…", so a staff member searching a lead puts that lead's
 * email in the query string. page_view reports pathname + search, which would
 * hand Google a real person's address — against GA4's own terms as well as our
 * privacy notice — and the mailto: links in the results table would do the same
 * through the outbound-click listener. /dashboard/login is a password form and
 * has no business in a report either.
 *
 * Amelia's tag has been excluded here since it was added (see root.tsx); GA4
 * was not, which is the hole this closes. Both now read this one predicate, so
 * the rule cannot drift apart again. It also keeps staff traffic out of GA4,
 * which is a reporting win on its own.
 */
const PRIVATE_PREFIXES = ["/dashboard"] as const;

export function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** The live location, for the guards below. Server-side there is nothing to send. */
function onPrivatePath(): boolean {
  return typeof window !== "undefined" && isPrivatePath(window.location.pathname);
}

export type ConsentState = "accepted" | "declined" | null;
const KEY = "serene-consent";

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null; // private mode / storage disabled
  }
}

export function setConsent(state: Exclude<ConsentState, null>): void {
  try {
    localStorage.setItem(KEY, state);
  } catch {
    /* storage unavailable: honour the choice for this page at least */
  }
  // The tag is already running, so this is an upgrade or a confirmation of the
  // state it started in, not a load. loadAnalytics() is kept for the case where
  // the decision is made before the tag came up (a private path, or GA4 not yet
  // initialised); it is a no-op once it has.
  loadAnalytics();
  if (window.gtag) window.gtag("consent", "update", consentSignals(state === "accepted"));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/** Anything fired before consent/gtag, replayed in order once GA4 is up. */
type Queued = { name: string; params?: Record<string, unknown> };
const queue: Queued[] = [];
const QUEUE_LIMIT = 50;

function send(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  // Dropped, not queued: a queued dashboard event would simply flush the
  // moment the admin opened a public page, which is the leak with a delay.
  if (onPrivatePath()) return;
  if (!loaded || !window.gtag) {
    if (queue.length < QUEUE_LIMIT) queue.push({ name, params });
    return;
  }
  window.gtag("event", name, params);
}

/**
 * The Consent Mode v2 signal set. Only `analytics_storage` ever moves: the
 * advertising signals stay denied permanently because this site runs no ads
 * and links no Ads account, and saying so explicitly is what stops Google
 * inferring otherwise. `security_storage` is granted — it covers fraud
 * prevention and is not something the notice offers to switch off.
 */
function consentSignals(granted: boolean) {
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  } as const;
}

export function loadAnalytics(): void {
  if (loaded || !GA_ID || typeof document === "undefined") return;
  // Deferred, not refused: `loaded` stays false, so an admin who later opens a
  // public page still gets GA4 — initAnalytics() is called again on every
  // navigation and is a no-op once this has run.
  if (onPrivatePath()) return;
  loaded = true;

  window.dataLayer = window.dataLayer ?? [];
  // `arguments`, not a rest array. gtag.js walks the dataLayer and only treats
  // an entry as a command when it is an Arguments object; a real Array is taken
  // for a plain data push and silently ignored. Written with `...args` the whole
  // pipeline below looks right in the console — js, config and every event land
  // in dataLayer — and GA4 still receives nothing at all. This is why the
  // official snippet is shaped the way it is.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // FIRST, before `js`, `config` and the script tag: the state gtag.js must
  // start in. Read from storage rather than assumed denied, so a returning
  // visitor who already accepted is not briefly measured as anonymous.
  window.gtag("consent", "default", consentSignals(getConsent() === "accepted"));
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    anonymize_ip: true,
    // We send these by hand on every route change, including the first.
    send_page_view: false,
  });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  // the landing page, then anything captured before the tag was up
  pageView();
  const pending = queue.splice(0, queue.length);
  for (const e of pending) window.gtag("event", e.name, e.params);
}

/**
 * Start measurement. No longer conditional on consent: the tag comes up for
 * every visitor and starts denied, which is the whole point of Consent Mode.
 * Still refused on a private path (see isPrivatePath).
 */
export function initAnalytics(): void {
  loadAnalytics();
}

/**
 * One page_view. Called for the landing page and again on every client-side
 * navigation, with the title read after React has committed the new route so
 * it is the new page's title rather than the previous one's.
 */
let lastView: string | null = null;

export function pageView(path?: string): void {
  if (typeof window === "undefined") return;
  const location = path ?? window.location.pathname + window.location.search;
  // Checked against the path being reported, not just the live one: on a
  // client-side navigation React commits the new route before this runs, and
  // we must judge the page we are about to send.
  if (isPrivatePath(location.split("?")[0]) || onPrivatePath()) return;
  if (!loaded || !window.gtag) return; // nothing to send to yet
  // Consecutive identical paths are always a double-count, never a real second
  // view. Without this, loadAnalytics() sending the landing view and the route
  // effect sending the same path would both land — which is exactly what
  // happens when GA4 starts late, on the first public page after /dashboard.
  if (location === lastView) return;
  lastView = location;
  window.gtag("event", "page_view", {
    page_path: location,
    page_location: window.location.origin + location,
    page_title: document.title,
  });
}

/**
 * Everything worth measuring. GA4 takes arbitrary event names, but keeping the
 * union means a typo is a build error rather than a metric that silently never
 * appears in a report.
 */
export type EventName =
  | "contact_submit"
  | "contact_error"
  | "register_interest"
  | "whatsapp_click"
  | "ask_agent_click"
  | "property_view"
  | "property_enquiry"
  | "developer_view"
  | "insight_read"
  | "faq_open"
  | "video_play"
  | "outbound_click"
  | "cta_click";

export function track(event: EventName, params?: Record<string, unknown>): void {
  send(event, params);
}

/**
 * Measure every outbound click without touching each component.
 *
 * The conversation CTAs are scattered across the header, the property pages and
 * most section footers, and they change destination with VITE_AMELIA_ASK_MODE.
 * Instrumenting them one by one would mean editing dozens of files and missing
 * the next one added. One delegated listener on the document covers them all,
 * and keeps working when a new CTA appears.
 *
 * Capture phase, because some CTAs navigate on click; `closest("a")` so a click
 * on a span inside the anchor still resolves. Returns its own cleanup.
 */
export function trackOutboundClicks(): () => void {
  if (typeof document === "undefined") return () => {};

  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.("a");
    if (!el) return;
    const href = el.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    let url: URL;
    try {
      url = new URL(href, window.location.origin);
    } catch {
      return;
    }
    if (url.origin === window.location.origin) return; // internal route

    const host = url.hostname.replace(/^www\./, "");
    const from = window.location.pathname;

    if (host === "wa.me" || host.endsWith("whatsapp.com")) {
      track("whatsapp_click", { from, href: url.href });
      return;
    }
    // Amelia's chat/portal — the other half of the conversation funnel
    if (host.endsWith("serenebay.ae")) {
      track("ask_agent_click", { from, href: url.href });
      return;
    }
    track("outbound_click", { from, host, href: url.href });
  };

  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
