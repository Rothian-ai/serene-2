import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import { gsap, useGsapContext, MQ } from "~/lib/gsap";
import { STAGES } from "~/lib/strategy";
import { LifecycleSpine } from "~/components/LifecycleRail";

/**
 * The lifecycle, as a pinned photographic column.
 *
 * On desktop the left column pins while the nine stages scroll past on the
 * right; each stage's photograph crossfades in as its text reaches the middle
 * of the viewport, and a hairline rail fills alongside. One GSAP timeline per
 * stage — no scrub on the images themselves, so the crossfades stay crisp
 * rather than smearing under fast scrolling.
 *
 * Everything degrades by construction:
 *   · below md, and under prefers-reduced-motion, it renders `LifecycleSpine` —
 *     the same nine stages as plain editorial rows, no pin, no JS;
 *   · SSR paints the desktop markup complete at stage one, so the prerendered
 *     HTML is never a blank frame waiting for hydration.
 *
 * Reservation sits between stages 3 and 4. The rail marks that line, because
 * it is the whole argument of the page.
 */

const HANDOFF_AFTER = "03";

export function StickyStages() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  useGsapContext(
    rootRef,
    ({ mm }) => {
      mm.add(MQ.desktop, () => {
        const frames = frameRefs.current.filter(Boolean) as HTMLDivElement[];
        const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];

        // the rail fills across the whole descent
        gsap.to(railRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top center",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // each row owns its own frame: crossfade in on enter, out on leave-back
        rows.forEach((row, i) => {
          gsap.set(frames[i], { autoAlpha: i === 0 ? 1 : 0 });
          if (i === 0) return;
          ScrollTriggerFor(row, () => {
            setActive(i);
            gsap.to(frames[i], { autoAlpha: 1, duration: 0.7, ease: "power2.out" });
            gsap.to(frames.slice(0, i).concat(frames.slice(i + 1)), {
              autoAlpha: 0,
              duration: 0.7,
              ease: "power2.out",
            });
          }, () => {
            setActive(i - 1);
            gsap.to(frames[i], { autoAlpha: 0, duration: 0.7, ease: "power2.out" });
            gsap.to(frames[i - 1], { autoAlpha: 1, duration: 0.7, ease: "power2.out" });
          });
        });

        // a slow drift on the pinned frame so the column is never dead still
        gsap.to(frameRefs.current[0]?.parentElement ?? null, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });
    },
    [],
  );

  // Below md and under reduced motion the spine is the whole component.
  if (reduced) return <LifecycleSpine />;

  return (
    <>
      {/* mobile / tablet — the editorial spine, unpinned */}
      <div className="lg:hidden">
        <LifecycleSpine />
      </div>

      {/* desktop — pinned photographic column beside the scrolling stages */}
      <div ref={rootRef} className="hidden lg:grid lg:grid-cols-12 lg:gap-7">
        <div className="lg:col-span-5">
          <div className="sticky top-[14vh] overflow-hidden">
            <div className="relative aspect-[4/5] w-full will-change-transform">
              {STAGES.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => { frameRefs.current[i] = el; }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Plate
                    kind={i % 2 === 0 ? "interior" : "stone"}
                    image={s.image}
                    alt={s.alt}
                    className="h-full w-full"
                  />
                </div>
              ))}
              {/* stage counter over the frame — the one figure that moves */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <span
                  aria-hidden
                  className="font-extralight leading-none tabular-nums text-[clamp(2.5rem,4vw,4rem)] text-ivory/90"
                  style={{ textShadow: "0 2px 18px rgba(10,21,38,0.55)" }}
                >
                  {STAGES[active]?.n}
                </span>
                <span className="type-cap text-ivory/70">of nine</span>
              </div>
            </div>
          </div>
        </div>

        {/* the stages — each row a trigger for its own frame */}
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="relative pl-8">
            {/* the rail: a hairline that fills as the reader descends */}
            <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-ink/14">
              <div
                ref={railRef}
                className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-brass"
              />
            </div>

            {STAGES.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="py-12 first:pt-0 last:pb-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="type-data text-fog">{s.n}</span>
                  <h2 className="type-title">{s.title}</h2>
                </div>
                <p className="type-cap mt-2 text-brass">{s.label}</p>
                <p className="type-body-lg mt-5 max-w-[52ch] text-ink/76">{s.copy}</p>
                {/* what the market does instead — the contrast is the argument */}
                <p className="mt-5 max-w-[52ch] border-l border-ink/20 pl-5 text-[14.5px] leading-relaxed text-ink/58">
                  <span className="type-eyebrow mr-2 text-fog">What the market does instead</span>
                  {s.contrast}
                </p>
                {s.partners.length > 0 && (
                  <div className="mt-5">
                    <p className="type-eyebrow text-fog">Specialists introduced</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {s.partners.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 type-cap text-ink/68">
                          <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-silver" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.n === HANDOFF_AFTER && (
                  <div className="mt-9 flex items-center gap-4 border-t border-brass/40 pt-5">
                    <span className="type-eyebrow text-brass">Reservation</span>
                    <span className="type-cap text-ink/60">
                      Paid at stage three. Gone by stage four.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * A row-centred ScrollTrigger. Kept as a helper so the crossfade wiring above
 * reads as intent rather than configuration.
 */
function ScrollTriggerFor(trigger: HTMLElement, onEnter: () => void, onLeaveBack: () => void) {
  // ScrollTrigger is created through gsap so the surrounding gsap.context()
  // still owns it and reverts it on unmount.
  gsap.to(trigger, {
    // a no-op tween: the trigger is the point, the callbacks do the work
    duration: 0.01,
    scrollTrigger: {
      trigger,
      start: "top 55%",
      end: "bottom 55%",
      onEnter,
      onLeaveBack,
    },
  });
}
