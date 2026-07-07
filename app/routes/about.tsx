import { Eyebrow, Ledger, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
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
      <Hero plate="glass" image="/images/about-glass.jpg" height="min-h-[62svh]">
        <Eyebrow className="text-dawn">The House</Eyebrow>
        <h1 className="type-display mt-5 max-w-[16ch]">
          Built on information, not persistence.
        </h1>
      </Hero>

      {/* stance */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7 md:col-start-2">
            <p className="type-body-lg text-ink/80">
              Serene exists because buying off-plan in the Emirates is a sound decision too often
              wrapped in an unsound experience — the calls, the pressure, the urgency that isn't
              yours. We removed all of it. What remains is an advisory: licensed, registered, and
              staffed by an intelligence that answers questions instead of chasing closings.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              Our buyers are in Mumbai and Shanghai, London and Sydney. They are used to private
              banks and patient counsel. We built the property advisory they would expect.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* the serene way — the site's only numbered device */}
      <Section className="pt-0">
        <Eyebrow className="text-brass">The Serene Way</Eyebrow>
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

      {/* licensing & registry — the open-corner frame monument */}
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

      {/* the commitment — the no-cold-calls charter */}
      <div className="bg-ink text-ivory">
        <Section>
          <Eyebrow className="text-gold">The Commitment</Eyebrow>
          <Reveal>
            <h2 className="type-headline mt-6 max-w-[26ch]">
              You will never receive a call you didn't ask for.
            </h2>
            <p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-ivory/75">
              No cold calls. No follow-up campaigns. No passing your number to a sales floor. If
              you leave, you have left; if you return, we simply pick up where you stopped. This
              is not a courtesy — it is the model, in writing.
            </p>
          </Reveal>
        </Section>
      </div>

      <AmeliaBand title="The advisory is open. Bring a question." refId="about" />
    </>
  );
}
