import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { BodySection } from "~/lib/content";

/**
 * The masterpiece narrative — DAMAC-style sticky project storytelling.
 * A pinned rail on the left carries the section index + the persistent
 * fact ledger; the right column reads the body one chapter at a time.
 * Scroll progress drives the active-section state (the index highlights,
 * a gold thread fills) — a scroll-driven state change, not a page change.
 *
 * SSR renders every section open and the first index active, so prerendered
 * HTML paints complete. The scrollspy + smooth scroll are post-mount only.
 */

type Fact = { k: string; v: ReactNode };

export function DevelopmentNarrative({
  sections,
  facts,
}: {
  sections: BodySection[];
  facts: Fact[];
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  // scrollspy — the section nearest the viewport's middle band is "active"
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [sections.length]);

  // a gold thread that fills the rail as the register is read
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });
  const threadScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  function goTo(i: number) {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section ref={railRef} className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          {/* ——— left: section index + persistent facts ——— */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-28">
              {/* section nav — desktop only; scroll-driven active state */}
              <nav aria-label="Sections" className="hidden md:block">
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-px bg-ink/12">
                    <motion.div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-full origin-top bg-gold"
                      style={reduced ? undefined : { scaleY: threadScale }}
                    />
                  </div>
                  <ul className="flex flex-col gap-4">
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          aria-current={i === active ? "true" : undefined}
                          className="group flex items-baseline gap-3 text-left"
                        >
                          <span
                            className={`type-data transition-colors duration-300 ${
                              i === active ? "text-brass" : "text-fog/60"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`text-[15px] leading-snug transition-colors duration-300 ${
                              i === active
                                ? "text-ink"
                                : "text-ink/45 group-hover:text-ink/70"
                            }`}
                          >
                            {s.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>

              {/* the fact ledger — persistent while the register is read */}
              <dl className="mt-0 md:mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/14 pt-6 md:grid-cols-1 md:gap-y-4">
                {facts.map((f) => (
                  <div key={f.k} className="flex flex-col gap-0.5">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-fog">
                      {f.k}
                    </dt>
                    <dd className="type-data">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ——— right: the register, one chapter at a time ——— */}
          <div className="md:col-span-7 md:col-start-6">
            <div className="flex flex-col gap-16 md:gap-24">
              {sections.map((s, i) => (
                <article
                  key={s.id}
                  id={s.id}
                  data-idx={i}
                  ref={(el) => {
                    sectionRefs.current[i] = el;
                  }}
                  className="scroll-mt-28"
                >
                  <div className="type-data mb-4 text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="type-headline mb-6">{s.title}</h2>
                  <div
                    className="prose-serene"
                    dangerouslySetInnerHTML={{ __html: s.html }}
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
