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
  suffix?: string;
  label: string;
  accent?: boolean;
}> = [
  { to: 24, suffix: "B+", label: "AED in transactions advised", accent: true },
  { to: 11000, suffix: "+", label: "Residences placed for clients" },
  { to: 60, suffix: "+", label: "Communities across Dubai & Abu Dhabi" },
  { to: 18, suffix: "+", label: "Years on Emirates off-plan" },
];

export function MetricsMonument() {
  return (
    <Section>
      {/* header — title left, intent right */}
      <div className="grid gap-8 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5">
          <Eyebrow className="text-brass">By the Record</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[14ch]">
            The measure of the house.
          </SplitHeading>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:col-start-8 md:pt-2">
          <p className="type-body-lg max-w-[46ch] text-ink/72">
            We publish what we are and answer what you ask — registered with the developers we
            represent, and built to inform rather than to chase.
          </p>
          <p className="type-cap mt-5 flex items-center gap-2.5 text-fog">
            <span aria-hidden className="seal-gold h-7 w-7 shrink-0 text-[13px] font-semibold leading-none">
              ✓
            </span>
            {SITE.rera} · verifiable.
          </p>
        </Reveal>
      </div>

      {/* the band — four equal cells on one shared rule, figures set to one size */}
      <RevealGroup className="mt-12 grid grid-cols-2 gap-x-7 gap-y-12 md:mt-16 md:grid-cols-4">
        {METRICS.map((m) => (
          <RevealItem key={m.label} className="border-t border-ink/14 pt-6">
            <div
              className={`font-extralight leading-none tracking-[-0.02em] tabular-nums text-[clamp(2.5rem,3.8vw,3.75rem)] ${
                m.accent ? "text-brass" : "text-ink"
              }`}
            >
              <Counter to={m.to} suffix={m.suffix} />
            </div>
            <p className="type-cap mt-4 text-fog">{m.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
