import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { gsap, useGsapContext } from "~/lib/gsap";
import { Ledger, Plate } from "~/components/primitives";
import type { Development } from "~/lib/content";
import { getDeveloper } from "~/lib/content";

/**
 * Pinned horizontal showcase — the "masterpiece gallery". On desktop the
 * section pins to the viewport (GSAP ScrollTrigger) and the register pans
 * sideways as the visitor scrolls; the pin lasts exactly the track's overflow
 * width, so the last panel fully arrives before release — no early stop, no
 * jump, distance recomputed on every refresh/resize. On touch / reduced-motion
 * it degrades to a native swipe row (also the SSR first paint).
 */

function Panel({ development, index }: { development: Development; index: number }) {
  const dev = getDeveloper(development.developer);
  return (
    <Link
      to={`/developments/${development.slug}`}
      className="group flex w-[80vw] shrink-0 flex-col sm:w-[54vw] lg:w-[34vw]"
    >
      <div className="relative h-[52vh] overflow-hidden">
        <Plate
          kind={development.plate}
          image={development.image}
          alt={development.title}
          className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: "linear-gradient(to top, rgba(11,10,8,0.62), transparent 58%)" }}
        />
        <span className="type-data absolute left-4 top-4 text-ivory/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-4 bottom-4 translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
          <div className="type-eyebrow text-dawn">
            {development.district}, {development.city}
          </div>
          <h3 className="type-title mt-2 text-ivory">{development.title}</h3>
        </div>
      </div>
      <Ledger
        className="mt-4"
        cells={[
          { k: "Developer", v: dev?.name ?? development.developer },
          { k: "Handover", v: development.handover },
          { k: "From", v: development.priceFrom },
        ]}
      />
      <span className="mt-4 inline-flex items-center gap-2 border-b border-gold pb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">
        Discover
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
      </span>
    </Link>
  );
}

function Header() {
  return (
    <div className="mx-auto flex max-w-[1440px] items-baseline justify-between px-6 md:px-12 lg:px-20">
      <div className="type-eyebrow flex items-center gap-2.5 text-brass">
        <span aria-hidden className="h-px w-[22px] bg-current opacity-90" />
        <span>Current Developments</span>
      </div>
      <span className="type-cap hidden text-fog md:inline">Scroll to explore →</span>
    </div>
  );
}

function Track({
  developments,
  trackRef,
}: {
  developments: Development[];
  trackRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={trackRef}
      className="flex items-stretch gap-8 px-6 will-change-transform md:px-12 lg:px-20"
    >
      {developments.map((d, i) => (
        <Panel key={d.slug} development={d} index={i} />
      ))}
      <Link
        to="/developments"
        className="group flex w-[70vw] shrink-0 flex-col justify-center sm:w-[40vw] lg:w-[24vw]"
      >
        <h3 className="type-headline max-w-[10ch]">The full register.</h3>
        <span className="mt-6 inline-flex items-center gap-2.5 border-b border-gold pb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em]">
          All Developments
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </span>
      </Link>
    </div>
  );
}

/** Desktop / motion-on — GSAP pin + scrub, distance = track overflow width. */
function PinnedShowcase({ developments }: { developments: Development[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    sectionRef,
    () => {
      const track = trackRef.current!;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });
    },
    [developments.length],
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen flex-col justify-center overflow-hidden py-20"
    >
      <Header />
      <div className="mt-10">
        <Track developments={developments} trackRef={trackRef} />
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="relative h-px w-full bg-ink/12">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-brass"
          />
        </div>
      </div>
    </section>
  );
}

/** Touch / reduced-motion / SSR first paint — native swipe row (no pin). */
function SwipeShowcase({ developments }: { developments: Development[] }) {
  return (
    <section className="py-24 md:py-32">
      <Header />
      <div className="mt-10 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Track developments={developments} />
      </div>
    </section>
  );
}

export function HorizontalShowcase({ developments }: { developments: Development[] }) {
  // SSR + first paint render the swipe row; the pin is a post-mount, desktop,
  // motion-on enhancement — so first paint is always correct.
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnhanced(desktop.matches && !reduce.matches);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  return enhanced ? (
    <PinnedShowcase developments={developments} />
  ) : (
    <SwipeShowcase developments={developments} />
  );
}
