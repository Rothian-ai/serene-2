import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { CTA, Plate } from "~/components/primitives";
import { gsap, SplitText, useGsapContext } from "~/lib/gsap";

/**
 * The homepage cinematic hero — a pinned, scroll-driven narrative that stays
 * *alive* while idle. GSAP owns everything here:
 *   • ambient life — a slow ken-burns breath + a drifting light bloom, looping
 *     with no interaction;
 *   • entrance — eyebrow → masked split-text headline → sub → CTAs, staggered,
 *     flash-free (set in a layout effect before paint);
 *   • sequence — three chapters + three backgrounds crossfade on a scrubbed
 *     ScrollTrigger, with a gold progress rail and a handoff scrim at release.
 *
 * Under prefers-reduced-motion it collapses to a single static hero.
 * SSR renders complete at chapter 1 (chapters 2–3 start hidden inline).
 */

/**
 * Hero background video. Empty by default (no licensed footage ships in the
 * repo). Drop a muted, looping clip at e.g. `/videos/hero.webm` (webm + an mp4
 * fallback) and set the path here — it plays over the ken-burns still, which
 * stays as the poster/reduced-motion frame. Keep it short, dark, and calm
 * (a slow dusk skyline drift), graded to match the house look.
 */
const HERO_VIDEO = { webm: "", mp4: "" };

const CHAPTERS = [
  {
    eyebrow: "Dubai & Abu Dhabi · Off-Plan",
    title: "The address is only the beginning.",
    sub: "Off-plan property in the Emirates, advised with data and held to a single standard.",
  },
  {
    eyebrow: "The Standard",
    title: "Advised with data. Never with a call you didn't ask for.",
    sub: "Serious buyers are persuaded by information, not persistence.",
  },
  {
    eyebrow: "Amelia",
    title: "Ask anything. Answered at midnight, in detail.",
    sub: "An AI advisory that holds the record — and never places a call.",
  },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="type-eyebrow mb-6 flex items-center gap-2.5 text-ivory/75">
      <span aria-hidden className="h-px w-[22px] bg-current opacity-90" />
      <span>{children}</span>
    </div>
  );
}

/** Static fallback — reduced motion. */
function StaticHero() {
  return (
    <div className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0">
        <Plate
          kind="hero"
          image="/images/hero-dusk.jpg"
          srcSet="/images/hero-dusk-800.jpg 800w, /images/hero-dusk-1280.jpg 1280w, /images/hero-dusk.jpg 1600w"
          avifSrcSet="/images/hero-dusk-800.avif 800w, /images/hero-dusk-1280.avif 1280w, /images/hero-dusk-1600.avif 1600w"
          eager
          className="h-full w-full"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.72) 0%, rgba(11,10,8,0.3) 45%, transparent 78%)",
          }}
        />
      </div>
      <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 md:px-12 lg:px-20">
        <Eyebrow>{CHAPTERS[0].eyebrow}</Eyebrow>
        <h1 className="type-display-xl max-w-[15ch]">{CHAPTERS[0].title}</h1>
        <p className="type-body-lg mt-6 max-w-[46ch] text-ivory/80">{CHAPTERS[0].sub}</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <CTA to="/amelia?ref=home-hero" kind="line">Ask Amelia</CTA>
          <CTA to="/developments" kind="line">Explore Developments</CTA>
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
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
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

      // ——— entrance: eyebrow → masked split headline → sub → CTAs → cue ———
      const split = new SplitText(headlineRef.current, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
      });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { autoAlpha: 0, y: 18, duration: 0.7 })
        .from(
          split.chars,
          { autoAlpha: 0, yPercent: 118, rotateX: -55, stagger: 0.02, duration: 0.95 },
          "-=0.35",
        )
        .from(subRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.55")
        .from(ctaRef.current, { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.45")
        .from(cueRef.current, { autoAlpha: 0, duration: 0.6 }, "-=0.15");

      // ——— sequence: chapters + backgrounds crossfade on scrub ———
      const seq = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (railRef.current) gsap.set(railRef.current, { scaleY: self.progress });
            if (scrimRef.current) {
              // deepen the scrim toward the end for the handoff into §Philosophy
              gsap.set(scrimRef.current, { opacity: 0.6 + self.progress * 0.4 });
            }
          },
        },
      });
      // subtle parallax lift across the whole descent
      seq.to(bgWrapRef.current, { yPercent: -8, ease: "none", duration: 3 }, 0);
      // chapter 1 → 2
      seq
        .to(chapters[0], { autoAlpha: 0, yPercent: -14, duration: 0.5 }, 0.55)
        .to(bgs[0], { autoAlpha: 0, duration: 0.6 }, 0.55)
        .fromTo(bgs[1], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.55)
        .fromTo(chapters[1], { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 0.8)
        // chapter 2 → 3
        .to(chapters[1], { autoAlpha: 0, yPercent: -14, duration: 0.5 }, 1.75)
        .to(bgs[1], { autoAlpha: 0, duration: 0.6 }, 1.75)
        .fromTo(bgs[2], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.75)
        .fromTo(chapters[2], { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, 2.0);

      return () => split.revert();
    },
    [],
  );

  if (reduced) return <StaticHero />;

  const hasVideo = HERO_VIDEO.webm || HERO_VIDEO.mp4;
  const bgNodes = [
    <Plate
      key="hero"
      kind="hero"
      image="/images/hero-dusk.jpg"
      srcSet="/images/hero-dusk-800.jpg 800w, /images/hero-dusk-1280.jpg 1280w, /images/hero-dusk.jpg 1600w"
      avifSrcSet="/images/hero-dusk-800.avif 800w, /images/hero-dusk-1280.avif 1280w, /images/hero-dusk-1600.avif 1600w"
      eager
      className="h-full w-full"
    >
      {hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-dusk.jpg"
          aria-hidden
        >
          {HERO_VIDEO.webm && <source src={HERO_VIDEO.webm} type="video/webm" />}
          {HERO_VIDEO.mp4 && <source src={HERO_VIDEO.mp4} type="video/mp4" />}
        </video>
      )}
    </Plate>,
    <Plate key="render" kind="render" image="/images/cove-tower.jpg" className="h-full w-full" />,
    <Plate key="dusk" kind="dusk" image="/images/amelia-dusk.jpg" className="h-full w-full" />,
  ];

  return (
    <section ref={rootRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen items-end overflow-hidden bg-ink text-ivory">
        {/* crossfading backgrounds + ambient light (parallax + breath on wrap) */}
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
          <div
            ref={scrimRef}
            aria-hidden
            className="absolute inset-0"
            style={{
              opacity: 0.6,
              background:
                "linear-gradient(to top, rgba(11,10,8,0.86) 0%, rgba(11,10,8,0.34) 48%, rgba(11,10,8,0.06) 72%, transparent 86%)",
            }}
          />
        </div>

        {/* progress rail — desktop */}
        <div className="absolute right-8 top-1/2 z-[2] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
          <span className="type-data text-ivory/50">01</span>
          <div className="relative h-40 w-px bg-ivory/20">
            <div ref={railRef} className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-gold" />
          </div>
          <span className="type-data text-ivory/50">03</span>
        </div>

        {/* the statement stack + persistent action */}
        <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-6 pb-20 md:px-12 lg:px-20">
          <div className="relative h-[280px] sm:h-[300px] md:h-[320px]">
            {/* chapter 1 — entrance-animated */}
            <div ref={(el) => { chapterRefs.current[0] = el; }} className="absolute inset-x-0 bottom-0">
              <div ref={eyebrowRef}>
                <Eyebrow>{CHAPTERS[0].eyebrow}</Eyebrow>
              </div>
              <h1 ref={headlineRef} className="type-display-xl max-w-[15ch]">
                {CHAPTERS[0].title}
              </h1>
              <p ref={subRef} className="type-body-lg mt-6 max-w-[46ch] text-ivory/80">
                {CHAPTERS[0].sub}
              </p>
            </div>
            {/* chapters 2 & 3 — hidden until the scrub brings them in */}
            {CHAPTERS.slice(1).map((c, i) => (
              <div
                key={c.eyebrow}
                ref={(el) => { chapterRefs.current[i + 1] = el; }}
                className="absolute inset-x-0 bottom-0"
                style={{ opacity: 0 }}
              >
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <h2 className="type-display-xl max-w-[15ch]">{c.title}</h2>
                <p className="type-body-lg mt-6 max-w-[46ch] text-ivory/80">{c.sub}</p>
              </div>
            ))}
          </div>
          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <CTA to="/amelia?ref=home-hero" kind="line">Ask Amelia</CTA>
            <CTA to="/developments" kind="line">Explore Developments</CTA>
          </div>
        </div>

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
