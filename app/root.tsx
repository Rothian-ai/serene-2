import { useEffect, useRef, useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useMatches,
  useRouteError,
} from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";

import "./app.css";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { CookieConsent } from "~/components/CookieConsent";
import { LoadingSequence } from "~/components/LoadingSequence";
import { ScrollProgress } from "~/components/ScrollProgress";
import { RouteProgress } from "~/components/RouteProgress";
import { initAnalytics } from "~/lib/analytics";
import { gsap, ScrollTrigger } from "~/lib/gsap";
import { SITE } from "~/lib/site";
import { EASE_QUIET, markHydrated } from "~/lib/motion";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="preload"
          href="/fonts/anek-latin-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
        {/* Decide the intro BEFORE the first paint. The overlay ships in the
            server-rendered HTML and app.css hides it unless this script sets
            `data-intro`, so a first-time visitor's first paint IS the intro and
            a returning one never sees it. Deciding in an effect instead is what
            made the home page paint, sit there for a second, then get covered
            and uncovered again — hydration always lands after paint.
            The timeout is a safety net: if the bundle fails, nothing is left
            holding an opaque overlay over the site.
            React logs "Extra attributes from the server: data-intro" in dev
            because the attribute lands before hydration. It is the same warning
            every theme-flash script produces, it is stripped from production
            builds, and React leaves the attribute alone — suppressHydrationWarning
            does not cover it, so there is nothing to silence. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{" +
              "var d=document.documentElement;" +
              "if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;" +
              "if(sessionStorage.getItem('serene:intro'))return;" +
              "sessionStorage.setItem('serene:intro','1');" +
              "d.setAttribute('data-intro','');" +
              "setTimeout(function(){d.removeAttribute('data-intro')},4000);" +
              "}catch(e){}})()",
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: SITE.contentName,
              alternateName: SITE.name,
              legalName: SITE.legalName,
              url: SITE.url,
              slogan: SITE.tagline,
              description: SITE.positioning,
              areaServed: ["Dubai", "Abu Dhabi"],
              knowsAbout: [
                "Off-plan real estate",
                "UAE property investment",
                "Buyer representation",
                "Developer due diligence",
                "Independent snagging inspection",
                "Non-resident mortgages",
                "Off-plan assignment and resale",
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

type RouteHandle = { headerTone?: "dark" | "light" };

export default function App() {
  const location = useLocation();
  const matches = useMatches();
  const tone =
    (matches[matches.length - 1]?.handle as RouteHandle | undefined)?.headerTone ?? "light";

  // First mount must render exactly what was prerendered (no initial styles),
  // or React discards the whole document as a hydration mismatch. Transitions
  // begin with the first client-side navigation.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    markHydrated();
  }, []);

  useEffect(() => {
    initAnalytics();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Lenis drives the document scroll; GSAP's ticker drives Lenis, and Lenis
    // pushes every scroll into ScrollTrigger — one clock for smooth scroll and
    // all pinned/scrubbed timelines (no scrollerProxy: Lenis scrolls window).
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Client-side navigation swaps `main` and its pinned triggers — recompute
  // pin/scrub geometry once the enter transition has settled.
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [location.pathname, hydrated]);

  // Reveal footer (111w57-style): the footer is pinned behind the page, and the
  // opaque content slab is given a bottom margin equal to the footer's height so
  // it slides up and off it at the end of the scroll, revealing it gradually.
  // Prerendered HTML paints complete (margin applies after measure); a resize
  // observer keeps the reserved space in step with the footer's responsive height.
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState(0);
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const measure = () => setFooterH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Recompute pinned-section geometry when the reserved space changes.
  useEffect(() => {
    if (hydrated && footerH) ScrollTrigger.refresh();
  }, [footerH, hydrated]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <LoadingSequence />
      <ScrollProgress />
      <RouteProgress />
      <Header tone={tone} />
      {/* opaque content slab — rides above the pinned footer, then slides off it */}
      <div className="relative z-10 bg-ivory" style={{ marginBottom: footerH || undefined }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main"
            key={location.pathname}
            initial={hydrated ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_QUIET } }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0">
        <Footer />
      </div>
      <CookieConsent />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 text-center text-ivory">
      <p className="type-eyebrow text-silver">{notFound ? "404" : "Error"}</p>
      <h1 className="type-headline mt-5">
        {notFound
          ? "This address doesn't exist."
          : "Something interrupted the page."}
      </h1>
      <a
        href="/"
        className="mt-9 inline-block border border-ivory/50 px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ivory hover:border-ivory"
      >
        Return home
      </a>
    </div>
  );
}
