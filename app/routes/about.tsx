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
import { AmeliaBand } from "~/components/AmeliaBand";
import { COMMITMENTS } from "~/lib/strategy";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "About",
    description:
      "Serene Bay is a licensed off-plan buyer advisory in Dubai and Abu Dhabi, built for the overseas investor: salaried advisors, cross-developer counsel, no cold calls, and a relationship that runs from first enquiry to eventual exit.",
    path: "/about",
  });
}

/**
 * Who we work for — the overseas, non-resident buyer the strategy is built
 * around (§2.5). Each movement carries its own photograph, as before.
 */
const MOVEMENTS = [
  {
    n: "01",
    title: "You are not in the country",
    copy: "Non-resident, investment-driven purchases account for the majority of Dubai transactions. Nearly every one of those buyers is managing a large asset in a construction and legal environment they cannot walk into on a Saturday.",
    image: "/images/about-ask.jpg",
    alt: "A quiet lounge in warm evening light",
  },
  {
    n: "02",
    title: "You want comparison, not inventory",
    copy: "A developer's sales team will only show you its own projects. An agent on commission will favour the ones that pay best. What a serious buyer actually wants is the shortlist that survives comparison — and the reasoning behind it.",
    image: "/images/about-understand.jpg",
    alt: "An architectural section drawing, read in full",
  },
  {
    n: "03",
    title: "You need someone there in year three",
    copy: "When the build slips, when the unit needs inspecting before you release final payment, when a tenant is due or a fixed rate ends. This is the part of ownership that decides whether the investment worked.",
    image: "/images/about-decide.jpg",
    alt: "A door standing open to warm light",
  },
];

export default function About() {
  return (
    <>
      {/* ① Hero — photographic, held short; the page reads on, not down */}
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">The House</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[18ch]">
          A brokerage built the other way round.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[50ch] text-ivory/72">
          Serene Bay is a licensed off-plan buyer advisory in Dubai and Abu Dhabi. Our advisors are
          salaried, our shortlists cross developers, and the relationship does not end at the
          signature.
        </p>
      </Hero>

      {/* ② Why we exist — the white space, stated plainly */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-fog">Why we exist</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[17ch]">
              Someone in the room has to represent the buyer.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">
              In an off-plan transaction the other side of the table is a professional, repeat-player
              sales organisation. Its job is to sell its own inventory, and it does that job well.
              What has been missing in Dubai is the counterpart: a house whose only job is the
              buyer's side of the same conversation, and which is not paid more for saying yes.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              The exclusive buyer's agent has existed in the United States since the mid-1980s for
              exactly this reason. No equivalent — salaried advisors, no seller-side conflict, full
              lifecycle service — operates at scale in Dubai's off-plan market. That gap is the
              whole business.
            </p>
            <div className="mt-8">
              <QuietLink to="/difference">How the model works</QuietLink>
            </div>
          </Reveal>
        </div>

        {/* the argument, in material — one wide, quiet plate */}
        <Reveal className="mt-10 md:mt-14">
          <Plate
            kind="stone"
            image="/images/about-light.jpg"
            alt="An atrium in plaster and daylight"
            className="aspect-[16/10] sm:aspect-[16/7] lg:aspect-[21/7]"
            parallax
          />
          <p className="type-cap mt-3 text-fog">Room to think: the whole premise, in one frame.</p>
        </Reveal>
      </Section>

      {/* ③ Who we work for — three movements, each with its photograph */}
      <Section className="pt-0">
        <Reveal exit>
          <Eyebrow className="text-fog">Who We Work For</Eyebrow>
          <SplitHeading as="h2" className="type-headline mt-5 max-w-[20ch]">
            The overseas buyer, specifically.
          </SplitHeading>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-9 md:grid-cols-3 md:gap-7">
          {MOVEMENTS.map((m) => (
            <RevealItem key={m.n}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Plate kind="interior" image={m.image} alt={m.alt} className="h-full w-full" />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,21,38,0.66) 0%, rgba(10,21,38,0.12) 38%, transparent 60%)",
                  }}
                />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="type-data text-silver/90">{m.n}</div>
                  <h3 className="type-title mt-1.5 text-ivory">{m.title}</h3>
                </div>
              </div>
              <p className="mt-4 max-w-[38ch] text-[15.5px] leading-relaxed text-ink/70">
                {m.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ④ How we are built — the four commitments, in short form */}
      <div className="bg-frost">
        <Section>
          <Reveal exit>
            <Eyebrow className="text-fog">How We Are Built</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-9 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((c) => (
              <RevealItem key={c.k} className="border-t border-ink/16 pt-5">
                <span className="type-data text-fog">{c.k}</span>
                <h3 className="type-title mt-2">{c.claim}</h3>
                <p className="type-cap mt-3 text-brass">{c.title}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10">
            <QuietLink to="/difference">Each one, in full</QuietLink>
          </Reveal>
        </Section>
      </div>

      {/* ⑤ Licensing & registry — the open-corner frame monument */}
      <Section>
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
              purchase moves through RERA-regulated escrow. We take no seller-side listings, so
              the dual-agency conflict a buyer would otherwise carry does not exist here. Verify
              the licence; we would in your position.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ⑥ The commitment — the charter, on ink, meeting the page on a hard edge */}
      <div className="bg-ink text-ivory">
        <Section>
          <div className="mx-auto max-w-[880px] text-center">
            <Reveal exit>
              <Eyebrow className="justify-center text-silver">The Commitment</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" mode="chars" className="type-display mt-6">
              You will never receive a call you didn't ask for.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="type-body-lg mx-auto mt-8 max-w-[58ch] text-ivory/75">
                No cold calls. No follow-up campaigns. No passing your number to a sales floor —
                there is no sales floor. If you leave, you have left; if you return, we pick up
                where you stopped. This is not a courtesy. It is the model, in writing, and it is
                the direction UAE telemarketing rules have been moving for years.
              </p>
              <div className="mt-11 flex flex-wrap justify-center gap-4">
                <CTA to="/contact" kind="platinum">Speak with an advisor</CTA>
                <CTA to="/lifecycle" kind="line">The nine stages</CTA>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ⑦ The standard — counsel left, the material of it right */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-6">
            <Reveal exit>
              <Eyebrow className="text-fog">The Standard</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[20ch]">
              Counsel that waits for the question.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="type-body-lg mt-7 max-w-[52ch] text-ink/78">
                A good independent adviser is not paid by any single fund manager, and is trusted for
                exactly that reason: available and never insistent, present when called upon,
                invisible otherwise. We hold the acquisition of property to the same standard — a
                house you can consult at any hour, and one that will never consult you uninvited.
              </p>
              <div className="mt-9">
                <QuietLink to="/faqs">The questions we get asked</QuietLink>
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
            <p className="type-cap mt-3 text-fog">Present when called upon, invisible otherwise.</p>
          </Reveal>
        </div>
      </Section>

      <AmeliaBand title="The advisory is open. Bring a question." refId="about" />
    </>
  );
}
