import {
  Eyebrow,
  Ledger,
  Plate,
  QuietLink,
  Reveal,
  RevealGroup,
  RevealItem,
  Seam,
  Section,
} from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developers } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "About",
    description:
      "Serene is a licensed, AI-native advisory for UAE off-plan real estate. Registered with the developers it represents, and committed in writing to never placing an unsolicited call.",
    path: "/about",
  });
}

const MOVEMENTS = [
  {
    n: "01",
    title: "Ask",
    copy: "Bring a question — a district, a payment plan, a doubt. Amelia answers with data, at whatever hour the question arrives.",
  },
  {
    n: "02",
    title: "Understand",
    copy: "Transaction histories, escrow rules, service charges, handover records. The full picture, stated plainly, before any commitment.",
  },
  {
    n: "03",
    title: "Decide",
    copy: "In your own time. When you are ready to proceed, we act. Until then, silence — ours, not yours.",
  },
];

export default function About() {
  return (
    <>
      {/* ① Hero — photographic, held short; the page reads on, not down */}
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-gold">The House</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[18ch]">
          Built on information, not persistence.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[42ch] text-ivory/72">
          A licensed advisory for off-plan property in Dubai and Abu Dhabi — with the one
          conviction that serious buyers are persuaded by information, never pressure.
        </p>
      </Hero>

      {/* ② Stance — statement left, argument right */}
      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal exit className="md:col-span-5">
            <Eyebrow className="text-brass">Why we exist</Eyebrow>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[16ch]">
              A sound decision deserves an unhurried process.
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-2">
            <p className="type-body-lg text-ink/80">
              Buying off-plan in the Emirates is a sound decision too often wrapped in an unsound
              experience — the calls, the pressure, the urgency that isn't yours. We removed all
              of it. What remains is an advisory: licensed, registered, and staffed by an
              intelligence that answers questions instead of chasing closings.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              Our buyers are in Mumbai and Shanghai, London and Sydney. They are used to private
              banks and patient counsel. We built the property advisory they would expect.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ③ The Serene Way — the site's only numbered device (flowing content) */}
      <Section>
        <Reveal exit>
          <Eyebrow className="text-brass">The Serene Way</Eyebrow>
        </Reveal>
        <RevealGroup className="mt-9 grid gap-9 md:grid-cols-3">
          {MOVEMENTS.map((m) => (
            <RevealItem key={m.n} className="border-t border-ink/14 pt-4">
              <div className="type-data text-brass">
                {m.n} — {m.title.toUpperCase()}
              </div>
              <p className="mt-2.5 max-w-[38ch] text-[15.5px] leading-relaxed text-ink/70">
                {m.copy}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ④ Licensing & registry — the open-corner frame monument (flowing content) */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative border border-ink/18 p-8 md:p-12">
            <Eyebrow className="text-brass">Licensed &amp; Registered</Eyebrow>
            <Ledger
              className="mt-6"
              cells={[
                { k: "Licence", v: SITE.rera },
                { k: "Registered developers", v: String(developers.length) },
                { k: "Markets", v: "Dubai · Abu Dhabi" },
              ]}
            />
            <p className="mt-6 max-w-[62ch] text-[15.5px] leading-relaxed text-ink/70">
              Every development we present is anchored to a developer we are formally registered
              with, and every transaction moves through RERA-regulated escrow. Verify the licence;
              we would in your position.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ⑤ The Commitment — the charter, on ink, held to its content */}
      <Seam variant="ivory-ink" />
      <div className="bg-ink text-ivory">
        <Section>
          <div className="mx-auto max-w-[880px] text-center">
            <Reveal exit>
              <Eyebrow className="justify-center text-gold">The Commitment</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" mode="chars" className="type-display mt-6">
              You will never receive a call you didn't ask for.
            </SplitHeading>
            <Reveal delay={0.12}>
              <p className="type-body-lg mx-auto mt-8 max-w-[58ch] text-ivory/75">
                No cold calls. No follow-up campaigns. No passing your number to a sales floor. If
                you leave, you have left; if you return, we simply pick up where you stopped. This
                is not a courtesy — it is the model, in writing.
              </p>
            </Reveal>
          </div>
        </Section>
      </div>
      <Seam variant="ink-ivory" />

      {/* ⑥ The Standard — counsel left, the material of it right */}
      <Section className="pt-0">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-7">
          <div className="md:col-span-6">
            <Reveal exit>
              <Eyebrow className="text-brass">The Standard</Eyebrow>
            </Reveal>
            <SplitHeading as="h2" className="type-headline mt-6 max-w-[20ch]">
              Counsel that waits for the question.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="type-body-lg mt-7 max-w-[52ch] text-ink/78">
                Private banking earned its trust by being available and never insistent — present
                when called upon, invisible otherwise. We hold the acquisition of property to the
                same standard: a house you can consult at any hour, and one that will never consult
                you uninvited.
              </p>
              <div className="mt-9">
                <QuietLink to="/developments">See what we represent</QuietLink>
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
            <p className="type-cap mt-3 text-fog">Present when called upon — invisible otherwise.</p>
          </Reveal>
        </div>
      </Section>

      <AmeliaBand title="The advisory is open. Bring a question." refId="about" />
    </>
  );
}
