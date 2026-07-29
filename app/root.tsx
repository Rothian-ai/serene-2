import { useEffect, useState } from "react";
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
import { LoadingSequence } from "~/components/LoadingSequence";
import { ScrollProgress } from "~/components/ScrollProgress";
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: SITE.name,
              legalName: SITE.legalName,
              url: SITE.url,
              slogan: SITE.tagline,
              areaServed: ["Dubai", "Abu Dhabi"],
              knowsAbout: ["Off-plan real estate", "UAE property investment"],
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

  // Recompute pin/scrub geometry once the enter transition has settled.
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [location.pathname, hydrated]);

  // Alpha (coming-soon): hero only — no footer, no cookie banner, no nav.
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
      <Header tone={tone} />
      <div className="relative z-10 bg-ivory">
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
