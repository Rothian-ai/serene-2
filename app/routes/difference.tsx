import {
  Eyebrow,
  Plate,
  QuietLink,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ComparisonTable } from "~/components/ComparisonTable";
import { PaidBand } from "~/components/PaidBand";
import { ConversationBand } from "~/components/ConversationBand";
import {
  COMPARISON_INTRO,
  COMPLIANCE,
  COMPLIANCE_INTRO,
  PRECEDENT,
} from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "The Difference",
    description:
      "Every agent in Dubai is paid on commission. That is the whole problem. Serene Bay's advisors are salaried, so there is no financial reason to prefer one developer, one project or one unit over another.",
    path: "/difference",
  });
}

/**
 * The Difference carries two of the document's pages: "Compare" and "How we
 * are paid". The four commitments and the market case live on the homepage
 * now, and the going-direct rebuttal on /off-plan, so nothing here repeats
 * a section a reader has already passed.
 */
export default function Difference() {
  return (
    <>
      {/* Hero — the page is Compare then How we are paid; the hero is the first
          of those, so the band below can keep its own heading without echoing it */}
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">{COMPARISON_INTRO.eyebrow}</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[21ch]">
          {COMPARISON_INTRO.headline}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">{COMPARISON_INTRO.body}</p>
      </Hero>

      {/* ① The comparison — the table the hero introduced */}
      <Section>
        <ComparisonTable />
      </Section>

      {/* ② How we are paid — the money, stated without euphemism */}
      <PaidBand />

      {/* ③ Documented, not asserted — the paperwork that already exists */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-fog">{COMPLIANCE_INTRO.eyebrow}</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[22ch]">
            {COMPLIANCE_INTRO.headline}
          </SplitHeading>
        </Reveal>
        <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 md:mt-14 md:grid-cols-2">
          {COMPLIANCE.map((c) => (
            <RevealItem key={c.title} className="border-t border-ink/16 pt-5">
              <h3 className="type-title max-w-[24ch]">{c.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/70">{c.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ④ Precedent — the model is forty years old, just not here */}
      <div className="bg-frost">
        <Section>
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
            <div className="md:col-span-6">
              <Reveal exit>
                <Eyebrow className="text-fog">{PRECEDENT.eyebrow}</Eyebrow>
              </Reveal>
              <SplitHeading as="h2" className="type-headline mt-6 max-w-[20ch]">
                {PRECEDENT.headline}
              </SplitHeading>
              <Reveal delay={0.1}>
                {PRECEDENT.body.map((para, i) => (
                  <p
                    key={para}
                    className={
                      i === 0
                        ? "type-body-lg mt-7 max-w-[54ch] text-ink/78"
                        : "mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-ink/65"
                    }
                  >
                    {para}
                  </p>
                ))}
                <div className="mt-9">
                  <QuietLink to="/lifecycle">Where those specialists come in</QuietLink>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
              <Plate
                kind="interior"
                image="/images/saadiyat-grove-residences-02.jpg"
                alt="A calm interior in natural light"
                className="aspect-[4/5]"
                parallax
              />
            </Reveal>
          </div>
        </Section>
      </div>

      <ConversationBand
        eyebrow="Request a conversation"
        title="We will not call you unless you ask us to."
        copy="Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence."
        secondary="The nine stages"
        secondaryTo="/lifecycle"
        image="/images/about-understand.jpg"
        alt="An architectural section drawing, read in full"
      />
    </>
  );
}
