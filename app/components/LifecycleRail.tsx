import { Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { STAGES } from "~/lib/strategy";

/**
 * The nine-stage buyer lifecycle (strategy §4), in the house's data grammar:
 * hairline-ruled cells, the stage number set as a figure, no cards and no
 * gradients. The `compact` variant is the homepage summary — nine short cells
 * and a link on; the full variant is the /lifecycle page's spine.
 *
 * Reservation sits between stages 3 and 4, which is exactly where the rest of
 * the market stops. The rail marks that line rather than describing it.
 */

const HANDOFF_AFTER = "03";

export function LifecycleRail() {
  return (
    <Section>
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5" exit>
          <Eyebrow className="text-fog">The Lifecycle</Eyebrow>
          <SplitHeading as="h2" className="type-display mt-5 max-w-[14ch]">
            Nine stages. One relationship.
          </SplitHeading>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
          <p className="type-body-lg text-ink/74">
            A commission-only agent is paid once, at reservation, and has every financial reason to
            move to the next lead. Six of these nine stages happen after that point. They are the
            reason Serene Bay exists.
          </p>
          <div className="mt-7">
            <QuietLink to="/lifecycle">The lifecycle in full</QuietLink>
          </div>
        </Reveal>
      </div>

      <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {STAGES.map((s) => (
          <RevealItem key={s.n} className="border-t border-ink/14 pt-5">
            <div className="flex items-baseline gap-3">
              <span className="type-data text-fog">{s.n}</span>
              <h3 className="type-title">{s.title}</h3>
            </div>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{s.short}</p>
            {s.n === HANDOFF_AFTER && (
              <p className="type-cap mt-4 flex items-center gap-2 text-brass">
                <span aria-hidden className="h-px w-6 bg-brass" />
                Most agents stop here
              </p>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

/**
 * The full spine — every stage set as an editorial row, with the independent
 * specialists it introduces named. Used on /lifecycle.
 */
export function LifecycleSpine() {
  return (
    <div className="hairline-b">
      {STAGES.map((s) => (
        <Reveal key={s.n}>
          <div className="hairline-t grid gap-4 py-9 md:grid-cols-12 md:gap-7 md:py-11">
            <div className="md:col-span-4">
              <div
                className="font-extralight leading-none tracking-[-0.02em] tabular-nums text-[clamp(2rem,3vw,2.75rem)] text-ink/25"
                aria-hidden
              >
                {s.n}
              </div>
              <h2 className="type-title mt-3 max-w-[20ch]">{s.title}</h2>
              <p className="type-cap mt-2 text-brass">{s.short}</p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="type-body-lg text-ink/76">{s.copy}</p>
              {s.specialists && (
                <p className="type-cap mt-5 flex flex-wrap items-center gap-2 text-fog">
                  <span
                    aria-hidden
                    className="seal-platinum h-6 w-6 shrink-0 text-[11px] font-semibold leading-none"
                  >
                    ✓
                  </span>
                  Introduced, never required: {s.specialists}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
