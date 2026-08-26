import {
  Eyebrow,
  Reveal,
  RevealGroup,
  RevealItem,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ComparisonTable } from "~/components/ComparisonTable";
import { PaidBand } from "~/components/PaidBand";
import { TwoRoutes } from "~/components/TwoRoutes";
import { ConversationBand } from "~/components/ConversationBand";
import {
  COMPARISON_INTRO,
  COMPLIANCE,
  COMPLIANCE_INTRO,
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
 * The Difference carries three of the document's pages: "Compare", "Going
 * direct" and "How we are paid". Going direct belongs with the comparison
 * rather than on /off-plan, where it sat until now: the table's middle column
 * is the direct route, so the case against it and the comparison of it were on
 * two different pages. The order reads broad, then narrow, then us — all three
 * options in a table, the one real objection taken apart, then how we are paid.
 *
 * The four commitments and the market case live on the homepage.
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

      {/* ② Going direct — the table's middle column, taken apart */}
      <TwoRoutes />

      {/* ③ How we are paid — the money, stated without euphemism */}
      <PaidBand />

      {/* ④ Documented, not asserted — the paperwork that already exists */}
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
