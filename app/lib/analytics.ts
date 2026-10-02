/**
 * GA4, consent-gated. Nothing loads until the visitor accepts the cookie
 * notice; declining is remembered and nothing is ever loaded.
 * Set VITE_GA_ID in .env (e.g. G-XXXXXXXXXX). Empty disables it entirely.
 *
 * Two things this has to get right that a stock gtag snippet does not:
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
 */

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim() ?? "";

/** True when a measurement ID is compiled in. Useful for diagnostics. */
export const ANALYTICS_CONFIGURED = Boolean(GA_ID);

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
  if (state === "accepted") loadAnalytics();
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
  if (!loaded || !window.gtag) {
    if (queue.length < QUEUE_LIMIT) queue.push({ name, params });
    return;
  }
  window.gtag("event", name, params);
}

export function loadAnalytics(): void {
  if (loaded || !GA_ID || typeof document === "undefined") return;
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

  // the landing page, then anything captured while waiting for consent
  pageView();
  const pending = queue.splice(0, queue.length);
  for (const e of pending) window.gtag("event", e.name, e.params);
}

export function initAnalytics(): void {
  if (getConsent() === "accepted") loadAnalytics();
}

/**
 * One page_view. Called for the landing page and again on every client-side
 * navigation, with the title read after React has committed the new route so
 * it is the new page's title rather than the previous one's.
 */
export function pageView(path?: string): void {
  if (typeof window === "undefined") return;
  const location = path ?? window.location.pathname + window.location.search;
  if (!loaded || !window.gtag) return; // pre-consent views are not backfilled
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
