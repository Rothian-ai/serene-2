import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { CTA, Eyebrow, Plate } from "~/components/primitives";
import { SereneMark } from "~/components/SereneMark";
import { gsap, SplitText, useGsapContext } from "~/lib/gsap";
import { HAS_WHATSAPP, conversationHref } from "~/lib/site";

/**
 * The homepage hero — one frame, not a sequence.
 *
 * It was previously a pinned, 320vh, three-chapter scroll narrative. It now
 * holds a single statement over the Downtown dusk plate (the last of the three
 * grounds), because the proposition reads better stated once than serialised —
 * and because the page below it now carries the argument in full.
 *
 * Motion kept from the sequence: the flash-free entrance (mark → masked split
 * headline → sub → actions), the ambient breath on the ground, the drifting
 * light, and a gentle parallax lift as the reader leaves. Under
 * prefers-reduced-motion all of it collapses and the hero paints complete.
 * SSR renders the finished state, so the prerendered HTML is never blank.
 */

const COPY = {
  eyebrow: "The Serene difference",
  title: "A different type of broker, a broker that you can trust.",
  sub: "Our advisors are salaried. They earn nothing extra for choosing one developer, one project or one unit over another. What they are paid to do is be right for you, before the reservation, and for the years after it.",
} as const;

/** The ground: the Downtown dusk plate, with its modern-format ladder. */
const HERO_BG = {
  image: "/images/hero-dusk.jpg",
  srcSet: "/images/hero-dusk-800.jpg 800w, /images/hero-dusk-1280.jpg 1280w, /images/hero-dusk.jpg 1600w",
  avifSrcSet:
    "/images/hero-dusk-800.avif 800w, /images/hero-dusk-1280.avif 1280w, /images/hero-dusk-1600.avif 1600w",
};

/** A centred vignette — dark enough to read white text, light enough to keep the photo. */
const VIGNETTE =
  "radial-gradient(125% 105% at 50% 48%, rgba(10,21,38,0.5) 0%, rgba(10,21,38,0.66) 55%, rgba(10,21,38,0.86) 100%)";

function Actions() {
  return (
    <>
      <CTA to={conversationHref()} kind="platinum" external={HAS_WHATSAPP}>
        Ask Amelia, our AI Sales Agent
      </CTA>
      <CTA to="/difference" kind="line">
        How We're Different
      </CTA>
    </>
  );
}

/**
 * The newcomer's way in. Deliberately a text link rather than a third button:
 * most first-time buyers are not ready to talk to anyone yet, and the contact
 * form has to stay the only primary action on the page.
 */
function NewToOffPlan() {
  return (
    <Link
      to="/off-plan"
      className="group inline-flex items-center gap-2.5 border-b border-gold/60 pb-1 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ivory/85 transition-colors hover:border-gold hover:text-ivory"
    >
      New to off-plan? Start here
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function HomeHero() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    rootRef,
    () => {
      // ——— ambient: a slow breath of light, never a zoom you can catch ———
      gsap.fromTo(
        bgWrapRef.current,
        { scale: 1.04 },
        { scale: 1.1, duration: 24, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
      gsap.fromTo(
        lightRef.current,
        { xPercent: -22, yPercent: -6, opacity: 0.25 },
        { xPercent: 22, yPercent: 6, opacity: 0.6, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true },
      );

      // ——— entrance: mark → masked split headline → sub → actions ———
      const split = new SplitText(headlineRef.current, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
      });
      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(markRef.current, { autoAlpha: 0, scale: 0.9, y: 12, duration: 0.9 })
        .from(
          split.chars,
          { autoAlpha: 0, yPercent: 118, rotateX: -55, stagger: 0.02, duration: 0.95 },
          "-=0.4",
        )
        .from(subRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.55")
        .from(ctaRef.current, { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.4")
        .from(cueRef.current, { autoAlpha: 0, duration: 0.6 }, "-=0.15");

      // The entrance runs on rAF, which browsers suspend in a background tab.
      // A page opened in one would otherwise sit on the timeline's from-state —
      // an invisible mark and headline — until it is focused. GSAP does resume
      // on visibility change, but the hero is the LCP content, so it must never
      // depend on that: if the document is hidden at mount, jump to the end and
      // let the reader arrive at the settled frame.
      if (document.hidden) tl.progress(1);

      // ——— a parallax lift as the hero leaves, so the seam is never abrupt ———
      gsap.to(bgWrapRef.current, {
        yPercent: -7,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => split.revert();
    },
    [],
  );

  return (
    <section
      ref={rootRef}
      className="hero-4k-home relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-ink text-ivory"
    >
      <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
        <Plate kind="hero" {...HERO_BG} eager className="h-full w-full" />
        {!reduced && <div ref={lightRef} aria-hidden className="hero-light" />}
        <div aria-hidden className="absolute inset-0" style={{ background: VIGNETTE }} />
      </div>

      <div className="container-site relative z-[1] text-center">
        {/* mark alone (sanctioned lockup 2) — the wordmark would double the headline */}
        <SereneMark ref={markRef} tone="white" title="Serene" className="mx-auto h-20 w-auto md:h-28" />
        <Eyebrow className="mt-8 justify-center text-silver">{COPY.eyebrow}</Eyebrow>
        <h1 ref={headlineRef} className="type-display mx-auto mt-4 max-w-[22ch]">
          {COPY.title}
        </h1>
        <p ref={subRef} className="type-body-lg mx-auto mt-5 max-w-[52ch] text-ivory/80">
          {COPY.sub}
        </p>
        <div ref={ctaRef} className="mt-11 md:mt-14">
          <div className="flex flex-wrap justify-center gap-4">
            <Actions />
          </div>
          <div className="mt-8 flex justify-center">
            <NewToOffPlan />
          </div>
        </div>
      </div>

      {/* scroll cue — pure CSS keyframes, so it never traps paint */}
      {!reduced && (
        <div
          ref={cueRef}
          aria-hidden
          className="absolute bottom-7 left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex"
        >
          <span className="text-[9.5px] uppercase tracking-[0.25em] text-ivory/50">Scroll</span>
          <span className="relative block h-11 w-px overflow-hidden bg-ivory/20">
            <span className="hero-cue absolute inset-x-0 top-0 block h-3.5 bg-ivory/85" />
          </span>
        </div>
      )}
    </section>
  );
}
