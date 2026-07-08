/**
 * GA4, consent-gated. Nothing loads until the visitor accepts the cookie
 * notice; declining is remembered and nothing is ever loaded.
 * Set VITE_GA_ID in .env (e.g. G-XXXXXXXXXX).
 */

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) ?? "";

export type ConsentState = "accepted" | "declined" | null;
const KEY = "serene-consent";

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setConsent(state: Exclude<ConsentState, null>): void {
  localStorage.setItem(KEY, state);
  if (state === "accepted") loadAnalytics();
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

export function loadAnalytics(): void {
  if (loaded || !GA_ID || typeof document === "undefined") return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function initAnalytics(): void {
  if (getConsent() === "accepted") loadAnalytics();
}

type EventName =
  | "amelia_engage"
  | "amelia_ask"
  | "amelia_dock"
  | "contact_submit"
  | "development_view"
  | "insight_read";

export function track(event: EventName, params?: Record<string, string>): void {
  window.gtag?.("event", event, params);
}
