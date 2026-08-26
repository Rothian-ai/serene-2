import { SplitHeading } from "~/components/SplitHeading";
import { Eyebrow, QuietLink, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { MARKET_CASE, MARKET_FACTS, MARKET_SOURCES } from "~/lib/strategy";
import { SITE } from "~/lib/site";

/**
 * "The market, on the record" — the credibility band, rebuilt.
 *
 * Serene Bay is a new house, so this band publishes no figures about itself:
 * no transaction volume, no residences placed, no years of trading, no returns.
 * What it publishes instead are the four published market figures that make the
 * case for the model (strategy §2), each with its source named and linked. The
 * numbers are the argument, not the boast.
 */
export function MetricsMonument() {
  return (
    <Section>
      {/* header — title left, the reason for the figures right */}
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5">
          <Eyebrow className="text-fog">The market we are answering</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[18ch]">
            {MARKET_CASE.headline}
          </SplitHeading>
        </Reveal>
        {/* the narrative in full: this is the only place it appears now */}
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
          {MARKET_CASE.body.map((para) => (
            <p key={para} className="type-body-lg mt-5 text-ink/76 first:mt-0">
              {para}
            </p>
          ))}
          <p className="type-title mt-7 max-w-[34ch] border-l border-brass pl-5 font-light text-ink/80">
            {MARKET_CASE.pull}
          </p>
          <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">{MARKET_CASE.close}</p>
          <p className="type-cap mt-7 flex items-center gap-2.5 text-fog">
            <span
              aria-hidden
              className="seal-platinum h-7 w-7 shrink-0 text-[13px] font-semibold leading-none"
            >
              ✓
            </span>
            {SITE.rera} · verifiable.
          </p>
        </Reveal>
      </div>

      {/* the band — four cells on one shared rule, each figure carrying its source */}
      <RevealGroup className="mt-12 grid grid-cols-2 gap-x-7 gap-y-12 md:mt-16 md:grid-cols-4">
        {MARKET_FACTS.map((m) => (
          <RevealItem key={m.label} className="flex flex-col border-t border-ink/14 pt-6">
            {/* several of these are ranges, so they are set, not counted to */}
            <div
              className={`font-extralight leading-none tracking-[-0.02em] tabular-nums text-[clamp(2.1rem,3.4vw,3.4rem)] ${
                m.accent ? "text-brass" : "text-ink"
              }`}
            >
              {m.display}
            </div>
            <p className="type-cap mt-4 text-ink/70">{m.label}</p>
            <a
              href={m.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-fog underline decoration-ink/25 underline-offset-4 transition-colors hover:text-brass"
            >
              {m.source} ↗
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-9">
        <p className="type-cap max-w-[86ch] text-fog">{MARKET_SOURCES}</p>
        <div className="mt-7">
          <QuietLink to="/difference">Why the model follows from this</QuietLink>
        </div>
      </Reveal>
    </Section>
  );
}
