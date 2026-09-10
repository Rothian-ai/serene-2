import { useState } from "react";
import { AdvisorLink, Eyebrow, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { ConversationBand } from "~/components/ConversationBand";
import { Accordion } from "~/components/Accordion";
import { track } from "~/lib/analytics";
import faqs from "../../content/faqs.json";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "FAQs",
    description:
      "Plain answers on buying off-plan in the UAE: who pays the commission, whether going direct is cheaper, what happens after handover, and how Serene Bay's salaried advisors are paid.",
    path: "/faqs",
  });
}

type Faq = { category: string; question: string; answer: string };
const ALL: Faq[] = faqs as Faq[];
const CATEGORIES = ["All", ...Array.from(new Set(ALL.map((f) => f.category)))];

export default function Faqs() {
  const [cat, setCat] = useState("All");
  const list = ALL.filter((f) => cat === "All" || f.category === cat);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: ALL.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />

      <Hero plate="glass" image="/images/the-cove-tower-three-02.jpg" height="min-h-[58svh]">
        <Eyebrow className="text-silver">Questions</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[16ch]">
          Asked, answered.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[52ch] text-ivory/72">
          Including the questions a commission-only agent would rather you didn't ask.
        </p>
      </Hero>

      <Section className="pt-14">
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 border-y border-ink/14 py-3.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`type-data cursor-pointer uppercase tracking-[0.08em] transition-colors ${
                cat === c ? "text-ink" : "text-fog hover:text-ink"
              }`}
              aria-pressed={cat === c}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="max-w-[880px]">
          <Accordion
            items={list}
            onOpen={(item) => track("faq_open", { question: item.question, category: cat })}
          />
          <p className="mt-10 text-[15.5px] text-ink/70">
            A question we haven't answered?{" "}
            <AdvisorLink context="a question the FAQs did not answer">
              Put it to an advisor
            </AdvisorLink>
            . You will get a written reply, and a call only if you ask for one.
          </p>
        </div>
      </Section>

      <ConversationBand
        eyebrow="Still Unsure"
        title="The awkward questions are the useful ones."
        copy="Which projects pay us least, what we would tell you not to buy, who inspects the unit before you release the final payment. A salaried advisor can answer all three without flinching."
        secondary="How the model works"
        secondaryTo="/difference"
        image="/images/about-glass.jpg"
        alt="A curtain-wall facade in close detail"
      />
    </>
  );
}
