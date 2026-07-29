import { useState } from "react";
import { Link } from "react-router";
import { Eyebrow, Section } from "~/components/primitives";
import { Accordion } from "~/components/Accordion";
import faqs from "../../content/faqs.json";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "FAQs",
    description:
      "Plain answers on buying off-plan in the UAE, working with Serene, Amelia, and the legal framework: escrow, RERA, and your protections.",
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

      <Section className="pt-40">
        <Eyebrow className="text-fog">Questions</Eyebrow>
        <h1 className="type-display mt-6">Asked, answered.</h1>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-7 gap-y-2 border-y border-ink/14 py-3.5">
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
          <Accordion items={list} />
          <p className="mt-10 text-[15.5px] text-ink/70">
            A question we haven't answered?{" "}
            <Link to="/amelia?ref=faqs" className="text-brass underline underline-offset-2">
              Ask Amelia
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-brass underline underline-offset-2">
              write to us
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
