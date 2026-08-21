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
import { COMMITMENTS, PROBLEMS } from "~/lib/strategy";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "The Difference",
    description:
      "Serene Bay's advisors are salaried, not commissioned. No cold calls, no kickbacks, cross-developer shortlists, and a relationship that continues past reservation. The full comparison against a commission-only broker and buying direct.",
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
          Paid to be right, not to close.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[52ch] text-ivory/72">
          Every other agent in this market earns nothing until you sign. Change how the advisor is
          paid and everything downstream of it changes: what you are shown, how fast you are asked
          to decide, and whether anyone is still there a year after handover.
        </p>
      </Hero>

      {/* ② What the incentive does — the problem, stated without hedging */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">The Incentive</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[17ch]">
              A structure, not a shortage of good people.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">
              There are capable, honest agents in Dubai. The problem is not character, it is
              arithmetic: commission-only pay on 40–70% splits, tens of thousands of brokers
              competing for the same buyers, and average tenure that has fallen to six months or
              less. Under those conditions the market rewards volume and speed — not comparison,
              verification and long-term stewardship.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              Serene Bay's opportunity is not to out-hustle that model. It is to be structurally
              incapable of it.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-11 grid gap-x-7 gap-y-9 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {PROBLEMS.map((p) => (
            <RevealItem key={p.k} className="border-t border-ink/16 pt-5">
              <span className="type-data text-fog">{p.k}</span>
              <h3 className="type-title mt-2">{p.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink/68">{p.copy}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ③ The four commitments — each set as an editorial row */}
      <div className="bg-frost">
        <Section>
          <Reveal exit>
            <Eyebrow className="text-fog">Four Commitments</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[20ch]">
              Four things the rest of the market cannot promise.
            </SplitHeading>
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
          <Eyebrow className="text-fog">Side by Side</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[22ch]">
            The three ways to buy off-plan in Dubai.
          </SplitHeading>
          <p className="type-body-lg mt-6 max-w-[58ch] text-ink/72">
            A commission-only broker, the developer's own sales team, or a salaried advisory. The
            differences are structural, so they are predictable — which is why they can be set out
            in a table rather than argued about.
          </p>
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

      {/* ⑥ No kickbacks — the principle held at every handoff, not just the sale */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-6">
            <Reveal exit>
              <Eyebrow className="text-fog">At Every Handoff</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[20ch]">
              No kickbacks. Including the ones you would never see.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="type-body-lg mt-7 max-w-[52ch] text-ink/78">
                Closing incentives paid back out of an agent's own commission are an openly
                discussed habit in this market. Ours is a simpler rule, and it holds past the sale:
                every specialist we introduce — surveyor, mortgage advisor, interior designer,
                letting agent — is an independent option you are free to use or ignore, and never
                one we are paid to recommend.
              </p>
              <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-ink/65">
                The same rule is why we do not place unsolicited calls. UAE telemarketing rules have
                tightened around exactly the behaviour this industry is known for; a call-on-request
                model is not a constraint we work around, it is the position we start from.
              </p>
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
              already provides for documented broker relationships and disclosed commission — we
              use it as intended. And because we take no seller-side listings, the dual-agency
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
        eyebrow="Test It"
        title="Put the claim to an advisor and see what comes back."
        copy="Ask the awkward version of the question — which projects pay you least, what you would tell me not to buy, who inspects the unit. A salaried advisor can answer all three."
        secondary="The nine stages"
        secondaryTo="/lifecycle"
        image="/images/about-understand.jpg"
        alt="An architectural section drawing, read in full"
      />
    </>
  );
}
