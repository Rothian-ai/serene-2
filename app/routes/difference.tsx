import {
  CTA,
  Eyebrow,
  Ledger,
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
import { DirectRebuttal } from "~/components/DirectRebuttal";
import { ConversationBand } from "~/components/ConversationBand";
import {
  COMMITMENTS,
  COMMITMENTS_INTRO,
  COMPARISON_INTRO,
  COMPLIANCE,
  COMPLIANCE_INTRO,
  MARKET_CASE,
  PRECEDENT,
} from "~/lib/strategy";
import { SITE, meta as buildMeta } from "~/lib/site";

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
 * The Difference — strategy §2 (what is broken), §3 (the four commitments),
 * §5 (the direct comparison) and §6 (the "going direct" rebuttal) on one page.
 * This is the understanding stage of the journey: the page that has to be read
 * before a shortlist means anything.
 */
export default function Difference() {
  return (
    <>
      {/* ① Hero — held short; the argument reads on, not down */}
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">The Difference</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[19ch]">
          Advice you can trace back to your interest.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">
          Our advisors are salaried. They earn nothing extra for choosing one developer, one
          project or one unit over another. What they are paid to do is be right for you, before
          the reservation, and for the years after it.
        </p>
      </Hero>

      {/* ② What the incentive does — the problem, stated without hedging */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">{MARKET_CASE.eyebrow}</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[19ch]">
              {MARKET_CASE.headline}
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            {MARKET_CASE.body.map((para) => (
              <p key={para} className="type-body-lg mt-5 text-ink/80 first:mt-0">
                {para}
              </p>
            ))}
            <p className="type-title mt-7 max-w-[34ch] border-l border-brass pl-5 font-light text-ink/80">
              {MARKET_CASE.pull}
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">{MARKET_CASE.close}</p>
          </Reveal>
        </div>

      </Section>

      {/* ③ The four commitments — each set as an editorial row */}
      <div className="bg-frost">
        <Section>
          <Reveal exit>
            <Eyebrow className="text-fog">{COMMITMENTS_INTRO.eyebrow}</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[18ch]">
              {COMMITMENTS_INTRO.headline}
            </SplitHeading>
            <p className="type-body-lg mt-6 max-w-[58ch] text-ink/72">{COMMITMENTS_INTRO.body}</p>
          </Reveal>
          <div className="mt-11 hairline-b md:mt-14">
            {COMMITMENTS.map((c) => (
              <Reveal key={c.k}>
                <div className="hairline-t grid gap-4 py-9 md:grid-cols-12 md:gap-7 md:py-11">
                  <div className="md:col-span-4">
                    <span className="type-data text-fog">{c.k}</span>
                    <h3 className="type-title mt-2 max-w-[16ch]">{c.claim}</h3>
                    <p className="type-cap mt-2 text-brass">{c.title}</p>
                  </div>
                  <p className="type-body-lg md:col-span-7 md:col-start-6 text-ink/76">{c.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* ④ The comparison — §5, the table */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-fog">{COMPARISON_INTRO.eyebrow}</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[24ch]">
            {COMPARISON_INTRO.headline}
          </SplitHeading>
          <p className="type-body-lg mt-6 max-w-[58ch] text-ink/72">{COMPARISON_INTRO.body}</p>
        </Reveal>
        <Reveal className="mt-10 md:mt-12" variant="mask">
          <Plate
            kind="render"
            image="/images/mercedes-benz-places-04.jpg"
            alt="Two glass towers against a clouded sky"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
          <p className="type-cap mt-3 text-fog">
            Two routes to the same building. Only one of them puts someone beside you.
          </p>
        </Reveal>
        <div className="mt-11 md:mt-14">
          <ComparisonTable />
        </div>
      </Section>

      {/* ⑤ The objection — the rebuttal, on ink */}
      <DirectRebuttal cta={false} />

      {/* ⑥ Documented, not asserted — the paperwork that already exists */}
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

      {/* ⑦ Precedent — the model is forty years old, just not here */}
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
              <p className="type-cap mt-3 text-fog">
                Present when called upon, invisible otherwise.
              </p>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ⑦ Licensing & registry — the trust ledger */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative border border-ink/18 p-8 md:p-12">
            <Eyebrow className="text-fog">Licensed &amp; Registered</Eyebrow>
            <Ledger
              className="mt-6"
              cells={[
                { k: "Licence", v: SITE.rera },
                { k: "Advisor pay", v: "Salaried" },
                { k: "Markets", v: "Dubai · Abu Dhabi" },
                { k: "Represents", v: "Buyers only" },
              ]}
            />
            <p className="mt-6 max-w-[62ch] text-[15.5px] leading-relaxed text-ink/70">
              We transact only under formal broker registration with each developer, and every
              purchase moves through RERA-regulated escrow. RERA's Form A, B and I framework
              already provides for documented broker relationships and disclosed commission, and
              we use it as intended. And because we take no seller-side listings, the dual-agency
              conflict is designed out rather than disclosed. Verify the licence; we would in your
              position.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTA to="/contact" kind="solid">Speak with an advisor</CTA>
              <CTA to="/lifecycle" kind="line-ink">The nine stages</CTA>
            </div>
          </div>
        </Reveal>
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
