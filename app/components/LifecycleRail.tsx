import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { CHAIN_INTRO, STAGES } from "~/lib/strategy";

/**
 * The nine-stage buyer value chain, as a rail rather than a grid.
 *
 * Nine equal cells of prose is the wrong shape for this: it reads as a list of
 * services when the argument is about *where the market leaves*. So the rail
 * sets the nine as marks on one continuous rule and colours the break — the
 * first three muted, the six after the handoff in brass. The document's own
 * sentence carries the reason ("paid at stage three and gone by stage four"),
 * so the picture states it and the intro explains it, neither repeating itself.
 *
 * Three across on a phone, five at sm, all nine at lg; the rule runs through
 * every cell at every width, so the sequence never breaks visually.
 */

/** Stages after the point a commission-only agent has been paid. */
const AFTER_HANDOFF = 3;

export function LifecycleRail() {
  return (
    <Section>
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5" exit>
          <Eyebrow className="text-fog">{CHAIN_INTRO.eyebrow}</Eyebrow>
          <SplitHeading as="h2" className="type-display mt-5 max-w-[16ch]">
            {CHAIN_INTRO.headline}
          </SplitHeading>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
          <p className="type-body-lg text-ink/74">{CHAIN_INTRO.body}</p>
          <div className="mt-7">
            <QuietLink to="/lifecycle">The lifecycle in full</QuietLink>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-12 md:mt-16">
        <ol className="grid grid-cols-3 gap-x-5 gap-y-10 sm:grid-cols-5 lg:grid-cols-9 lg:gap-x-4">
          {STAGES.map((s) => {
            const ours = Number(s.n) > AFTER_HANDOFF;
            return (
              <li key={s.n}>
                {/* the rule, then the mark sitting on it */}
                <div className={`h-px w-full ${ours ? "bg-brass/55" : "bg-ink/18"}`} />
                <span
                  aria-hidden
                  className={`-mt-[4px] block h-[7px] w-[7px] rotate-45 ${
                    ours ? "bg-brass" : "bg-ink/30"
                  }`}
                />
                <div className={`type-data mt-5 ${ours ? "text-brass" : "text-fog"}`}>{s.n}</div>
                <p
                  className={`mt-1.5 text-[13.5px] leading-snug ${
                    ours ? "text-ink" : "text-ink/55"
                  }`}
                >
                  {s.label}
                </p>
              </li>
            );
          })}
        </ol>
      </Reveal>

      {/* the legend, in the document's own words */}
      <Reveal className="mt-10">
        <div className="flex flex-wrap gap-x-10 gap-y-3">
          <p className="type-cap flex items-center gap-2.5 text-ink/55">
            <span aria-hidden className="h-[7px] w-[7px] rotate-45 bg-ink/30" />
            01–03 Paid at stage three
          </p>
          <p className="type-cap flex items-center gap-2.5 text-ink/80">
            <span aria-hidden className="h-[7px] w-[7px] rotate-45 bg-brass" />
            04–09 Gone by stage four
          </p>
        </div>
      </Reveal>
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
              <p className="type-cap mt-2 text-brass">{s.label}</p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="type-body-lg text-ink/76">{s.copy}</p>
              <p className="mt-5 max-w-[58ch] border-l border-ink/20 pl-5 text-[14.5px] leading-relaxed text-ink/58">
                <span className="type-eyebrow mr-2 text-fog">What the market does instead</span>
                {s.contrast}
              </p>
              {(s.when || s.artefact) && (
                <dl className="mt-5 flex flex-col gap-2">
                  {s.when && (
                    <div className="flex flex-wrap gap-x-3">
                      <dt className="type-eyebrow text-fog">When</dt>
                      <dd className="type-cap text-ink/70">{s.when}</dd>
                    </div>
                  )}
                  {s.artefact && (
                    <div className="flex flex-wrap gap-x-3">
                      <dt className="type-eyebrow text-fog">Paperwork</dt>
                      <dd className="type-cap text-ink/70">{s.artefact}</dd>
                    </div>
                  )}
                </dl>
              )}
              {s.partners.length > 0 && (
                <div className="mt-5">
                  <p className="type-eyebrow text-fog">Specialists introduced</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {s.partners.map((p) => (
                      <li key={p} className="type-cap flex items-start gap-2.5 text-ink/68">
                        <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-silver" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
