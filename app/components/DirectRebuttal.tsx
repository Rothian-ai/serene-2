import { CTA, Eyebrow, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { DIRECT_REBUTTAL } from "~/lib/strategy";

/**
 * Strategy §6 — the one argument the house is willing to put in writing, and
 * the answer to the only real objection an off-plan buyer has: why not go
 * direct? It sits on the ink ground, alone, because it is the whole case.
 *
 * The money mechanics are stated as a footnote rather than a headline: this is
 * how Dubai's off-plan commission model already works, not a Serene Bay claim.
 */
export function DirectRebuttal({ cta = true }: { cta?: boolean }) {
  return (
    <div className="bg-ink text-ivory">
      <Section>
        <div className="grid gap-9 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-silver">The Objection</Eyebrow>
            <p className="type-title mt-5 max-w-[18ch] font-light text-ivory/70">
              “{DIRECT_REBUTTAL.question}”
            </p>
          </Reveal>
          <div className="md:col-span-7 md:col-start-6">
            <SplitHeading as="h2" className="type-headline max-w-[26ch]">
              {DIRECT_REBUTTAL.headline}
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="type-body-lg mt-7 max-w-[58ch] text-ivory/76">
                {DIRECT_REBUTTAL.body}
              </p>
              <p className="type-cap mt-7 max-w-[58ch] border-l border-gold pl-5 text-ivory/55">
                {DIRECT_REBUTTAL.note}
              </p>
              {cta && (
                <div className="mt-10 flex flex-wrap gap-4">
                  <CTA to="/difference" kind="platinum">
                    The full comparison
                  </CTA>
                  <CTA to="/contact" kind="line">
                    Speak with an advisor
                  </CTA>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </Section>
    </div>
  );
}
