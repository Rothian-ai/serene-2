import { Counter } from "~/components/Counter";
import { SplitHeading } from "~/components/SplitHeading";
import { Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { developers, developments } from "~/lib/content";
import { SITE } from "~/lib/site";

/**
 * The credibility monument — adapts Omniyat's metrics band to Serene's
 * grammar: quantitative proof, stated once, on ivory with gold as an edge.
 * Every figure is real and derivable (registry size, live developments,
 * the two emirates, and the USP: zero cold calls). Numbers count up on
 * scroll-in; the RERA licence anchors it as verifiable.
 */

const METRICS: Array<{ to: number; suffix?: string; label: string; accent?: boolean }> = [
  { to: developers.length, label: "Developers we are registered with" },
  { to: developments.length, label: "Developments under advisory" },
  { to: 2, label: "Emirates — Dubai & Abu Dhabi" },
  { to: 0, label: "Cold calls placed. Not now, not ever.", accent: true },
];

export function MetricsMonument() {
  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-12 md:gap-7">
        <Reveal className="md:col-span-5">
          <Eyebrow className="text-brass">By the Record</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[16ch]">
            Everything here is on the record.
          </SplitHeading>
          <p className="type-body-lg mt-6 max-w-[42ch] text-ink/72">
            We publish what we are and answer what you ask — registered with the developers we
            represent, and built to inform rather than to chase.
          </p>
          <p className="type-cap mt-6 text-fog">{SITE.rera} · verifiable.</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-x-7 gap-y-12 md:col-span-6 md:col-start-7 md:mt-4">
          {METRICS.map((m) => (
            <RevealItem key={m.label} className="border-t border-ink/14 pt-5">
              <span aria-hidden className="mb-4 block h-px w-6 bg-gold" />
              <div
                className={`font-extralight leading-none tracking-[-0.02em] tabular-nums text-[clamp(2.75rem,5.5vw,4.75rem)] ${
                  m.accent ? "text-brass" : "text-ink"
                }`}
              >
                <Counter to={m.to} suffix={m.suffix} />
              </div>
              <p className="type-cap mt-4 max-w-[20ch] text-fog">{m.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
