import { Counter } from "~/components/Counter";
import { SplitHeading } from "~/components/SplitHeading";
import { Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { developers, developments } from "~/lib/content";
import { SITE } from "~/lib/site";

/**
 * The credibility monument — "At a Glance" band. A heading and intent statement
 * on top; below, a full-width row of figures divided by hairline rules, each
 * counting up on scroll-in.
 *
 * PLACEHOLDER figures — headline numbers for the design stage. Replace with real
 * audited figures before launch (see README "Before launch").
 */

const METRICS: Array<{
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
  accent?: boolean;
}> = [
  { to: 24, prefix: "AED ", suffix: "B+", label: "Transaction value advised", accent: true },
  { to: 11000, suffix: "+", label: "Residences placed for clients" },
  { to: 60, suffix: "+", label: "Communities across Dubai & Abu Dhabi" },
  { to: 18, suffix: "+", label: "Years on Emirates off-plan" },
];

export function MetricsMonument() {
  return (
    <Section>
      {/* header — title left, intent right */}
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-4">
          <Eyebrow className="text-brass">By the Record</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[10ch]">
            At a glance.
          </SplitHeading>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
          <p className="type-body-lg max-w-[52ch] text-ink/72">
            We publish what we are and answer what you ask — registered with the developers we
            represent, and built to inform rather than to chase.
          </p>
          <p className="type-cap mt-5 text-fog">{SITE.rera} · verifiable.</p>
        </Reveal>
      </div>

      {/* the band — figures divided by hairline rules */}
      <RevealGroup className="mt-12 grid grid-cols-2 gap-y-12 md:mt-16 md:grid-cols-4 md:gap-y-0">
        {METRICS.map((m) => (
          <RevealItem key={m.label} className="border-l border-ink/15 px-5 md:px-7">
            <div
              className={`font-light leading-[0.92] tracking-[-0.03em] tabular-nums text-[clamp(3.25rem,7vw,6rem)] ${
                m.accent ? "text-brass" : "text-ink"
              }`}
            >
              <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} />
            </div>
            <p className="type-cap mt-5 max-w-[22ch] text-fog">{m.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
