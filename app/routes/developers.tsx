import { Eyebrow, Ledger, Reveal, Section } from "~/components/primitives";
import { DeveloperCard } from "~/components/cards";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developers } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Developers",
    description:
      "The Serene registry: the developers we are registered with, presented as institutions — track records, delivery history, notable works.",
    path: "/developers",
  });
}

export default function Developers() {
  return (
    <>
      <Section className="pt-40">
        <Eyebrow className="text-brass">The Registry</Eyebrow>
        <h1 className="type-display mt-6 max-w-[20ch]">
          The institutions behind every address.
        </h1>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ink/70">
          We transact only with developers we are registered with. Each is presented here the way
          it deserves — as an institution with a record, not a logo on a slide.
        </p>
        <Ledger
          className="mt-10"
          cells={[
            { k: "Registered partners", v: String(developers.length) },
            { k: "Licence", v: SITE.rera },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-7">
          {developers.map((dev, i) => (
            <Reveal key={dev.slug} className={i % 2 === 1 ? "md:mt-16" : ""}>
              <DeveloperCard developer={dev} />
              <Ledger
                className="mt-4"
                cells={[
                  { k: "Founded", v: dev.founded },
                  { k: "Delivered", v: dev.delivered },
                  { k: "HQ", v: dev.hq },
                ]}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <AmeliaBand
        title="Delivery records, escrow history, handover punctuality — ask."
        cta="Ask Amelia about our partners"
        refId="developers-index"
      />
    </>
  );
}
