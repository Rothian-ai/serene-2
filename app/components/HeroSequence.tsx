import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import { SereneMark } from "~/components/SereneMark";
import { gsap, SplitText, useGsapContext } from "~/lib/gsap";

/**
 * The homepage cinematic hero — a pinned, scroll-driven narrative over actual
 * photography. Three centred chapters crossfade on a scrubbed ScrollTrigger:
 *   1. a minimal brand title-card (mark + tagline);
 *   2. the approach;
 *   3. Amelia — the one place a CTA appears.
 * GSAP owns ambient life (a slow breath + drifting light), the flash-free
 * entrance (mark → masked split tagline → sub), and the crossfade. A centred
 * vignette keeps text legible over the photography. Under prefers-reduced-motion
 * it collapses to a single static title-card. SSR renders complete at chapter 1.
 */

/**
 * Hero background video. Empty by default (no licensed footage ships in the
 * repo). Drop a muted, looping clip at e.g. `/videos/hero.webm` (webm + an mp4
 * fallback) and set the path here — it plays over the still, which stays as the
 * poster/reduced-motion frame. Keep it short, dark, and calm, graded to the house look.
 */
const HERO_VIDEO = { webm: "", mp4: "" };

const CHAPTERS = [
  {
    eyebrow: "",
    title: "UAE's First AI Native Real Estate Agency",
    sub: "Serenity, elevated. Off-plan real estate and curated addresses across Dubai and Abu Dhabi.",
  },
  {
    eyebrow: "The Approach",
    title: "Advised with data, never persuasion.",
    sub: "Districts, payment plans, escrow, handover records: the full picture, before any commitment.",
  },
  {
    eyebrow: "The Advisory",
    title: "Ask anything. Answered on the record.",
    sub: "An AI advisory available at any hour, and incapable of a cold call.",
  },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="type-eyebrow mb-6 flex items-center justify-center text-ivory/75">
      <span>{children}</span>
    </div>
  );
}

/** Inert coming-soon chip — the CTA is kept, but has nowhere to go yet. */
function ComingSoon() {
  return (
    <span className="btn-platinum inline-block cursor-default px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em]">
      Coming Soon
    </span>
  );
}

// Chapter-1 (title card / LCP) and chapter-3 grounds. Swapped per request:
// the title card now opens on amelia-dusk, and the skyline moves to Amelia's slide.
const TITLE_BG = { image: "/images/amelia-dusk.jpg" };
const AMELIA_BG = {
  image: "/images/hero-dusk.jpg",
  srcSet: "/images/hero-dusk-800.jpg 800w, /images/hero-dusk-1280.jpg 1280w, /images/hero-dusk.jpg 1600w",
  avifSrcSet:
    "/images/hero-dusk-800.avif 800w, /images/hero-dusk-1280.avif 1280w, /images/hero-dusk-1600.avif 1600w",
};

/** A centred vignette — dark enough to read white text, light enough to keep the photo. */
const VIGNETTE =
  "radial-gradient(125% 105% at 50% 48%, rgba(10,21,38,0.5) 0%, rgba(10,21,38,0.66) 55%, rgba(10,21,38,0.86) 100%)";

/** Static fallback — reduced motion. The title-card over the photograph. */
function StaticHero() {
  return (
    <div className="relative flex min-h-[92svh] items-center justify-center overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0">
        <Plate kind="dusk" {...TITLE_BG} eager className="h-full w-full" />
        <div aria-hidden className="absolute inset-0" style={{ background: VIGNETTE }} />
      </div>
      <div className="container-site relative z-[1] text-center">
        <SereneMark title="Serene" className="mx-auto h-20 w-auto md:h-28" />
        <h1 className="type-display mt-8">{CHAPTERS[0].title}</h1>
        <p className="type-body-lg mx-auto mt-5 max-w-[44ch] text-ivory/80">{CHAPTERS[0].sub}</p>
        <div className="mt-9 flex justify-center">
          <ComingSoon />
        </div>
      </div>
    </div>
  );
}

export function HeroSequence() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const bgRefs = useRef<Array<HTMLDivElement | null>>([]);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markRef = useRef<SVGSVGElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    rootRef,
    () => {
      const bgs = bgRefs.current.filter(Boolean) as HTMLDivElement[];
      const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];

      // ——— ambient: a slow breath of light, never a zoom you can catch ———
      gsap.fromTo(
        bgWrapRef.current,
        { scale: 1.05 },
        { scale: 1.12, duration: 24, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
      gsap.fromTo(
        lightRef.current,
        { xPercent: -22, yPercent: -6, opacity: 0.25 },
        { xPercent: 22, yPercent: 6, opacity: 0.6, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true },
      );

      // ——— entrance: mark → masked split tagline → sub ———
      const split = new SplitText(headlineRef.current, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
      });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(markRef.current, { autoAlpha: 0, scale: 0.9, y: 12, duration: 0.9 })
        .from(
          split.chars,
          { autoAlpha: 0, yPercent: 118, rotateX: -55, stagger: 0.02, duration: 0.95 },
          "-=0.4",
        )
        .from(subRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.55")
        .from(ctaRef.current, { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.4")
        .from(cueRef.current, { autoAlpha: 0, duration: 0.6 }, "-=0.15");

      // ——— sequence: chapters + grounds crossfade on scrub ———
      const seq = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (railRef.current) gsap.set(railRef.current, { scaleY: self.progress });
            if (scrimRef.current) gsap.set(scrimRef.current, { opacity: 0.85 + self.progress * 0.15 });
          },
        },
      });
      // Hold the timeline at its original length. The removed parallax tween
      // ran `duration: 3` and was what set it; without a spacer the timeline
      // ends at 2.5, which re-maps every crossfade onto the scroll and leaves
      // chapter 3 fully visible only at the very last instant.
      seq.to({}, { duration: 3 }, 0);
      // chapter 1 → 2
      seq
        .to(chapters[0], { autoAlpha: 0, yPercent: -12, duration: 0.5 }, 0.55)
        .to(bgs[0], { autoAlpha: 0, duration: 0.6 }, 0.55)
        .fromTo(bgs[1], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.55)
        .fromTo(chapters[1], { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 0.8)
        // chapter 2 → 3
        .to(chapters[1], { autoAlpha: 0, yPercent: -12, duration: 0.5 }, 1.75)
        .to(bgs[1], { autoAlpha: 0, duration: 0.6 }, 1.75)
        .fromTo(bgs[2], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.75)
        .fromTo(chapters[2], { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 2.0);

      return () => split.revert();
    },
    [],
  );

  if (reduced) return <StaticHero />;

  const hasVideo = HERO_VIDEO.webm || HERO_VIDEO.mp4;
  const bgNodes = [
    <Plate key="title" kind="dusk" {...TITLE_BG} eager className="h-full w-full">
      {hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={TITLE_BG.image}
          aria-hidden
        >
          {HERO_VIDEO.webm && <source src={HERO_VIDEO.webm} type="video/webm" />}
          {HERO_VIDEO.mp4 && <source src={HERO_VIDEO.mp4} type="video/mp4" />}
        </video>
      )}
    </Plate>,
    <Plate key="render" kind="render" image="/images/cove-tower.jpg" className="h-full w-full" />,
    <Plate key="amelia" kind="hero" {...AMELIA_BG} className="h-full w-full" />,
  ];

  return (
    <section ref={rootRef} className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-ink text-ivory">
        {/* crossfading grounds + ambient light (a slow breath on the wrap — no
            parallax lift: translating this viewport-sized layer would slide it
            off the ground beneath and reveal the ink surface at the bottom) */}
        <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
          {bgNodes.map((node, i) => (
            <div
              key={i}
              ref={(el) => { bgRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {node}
            </div>
          ))}
          <div ref={lightRef} aria-hidden className="hero-light" />
          <div ref={scrimRef} aria-hidden className="absolute inset-0" style={{ opacity: 0.85, background: VIGNETTE }} />
        </div>

        {/* progress rail — desktop */}
        <div className="absolute right-8 top-1/2 z-[2] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
          <span className="type-data text-ivory/50">01</span>
          <div className="relative h-40 w-px bg-ivory/20">
            <div ref={railRef} className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-silver" />
          </div>
          <span className="type-data text-ivory/50">03</span>
        </div>

        {/* three centred chapters, stacked and crossfading */}
        {/* chapter 1 — the minimal title-card, entrance-animated */}
        <div
          ref={(el) => { chapterRefs.current[0] = el; }}
          className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="pointer-events-auto">
            {/* mark alone (sanctioned lockup 2) — the wordmark would double the
                headline beneath it */}
            <SereneMark
              ref={markRef}
              title="Serene"
              className="mx-auto h-20 w-auto md:h-28"
            />
            <h1 ref={headlineRef} className="type-display mt-8 max-w-[20ch]">
              {CHAPTERS[0].title}
            </h1>
            <p ref={subRef} className="type-body-lg mx-auto mt-5 max-w-[46ch] text-ivory/80">
              {CHAPTERS[0].sub}
            </p>
            <div ref={ctaRef} className="mt-9 flex justify-center">
              <ComingSoon />
            </div>
          </div>
        </div>

        {/* chapters 2 & 3 — hidden until the scrub brings them in */}
        {CHAPTERS.slice(1).map((c, i) => (
          <div
            key={c.eyebrow}
            ref={(el) => { chapterRefs.current[i + 1] = el; }}
            className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="pointer-events-auto">
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h2 className="type-display mx-auto max-w-[20ch]">{c.title}</h2>
              <p className="type-body-lg mx-auto mt-5 max-w-[46ch] text-ivory/80">{c.sub}</p>
              <div className="mt-9 flex justify-center">
                <ComingSoon />
              </div>
            </div>
          </div>
        ))}

        {/* scroll cue */}
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
      </div>
    </section>
  );
}
