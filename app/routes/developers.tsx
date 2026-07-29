import { Link } from "react-router";
import { Eyebrow, Ledger, Plate, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/CollaborationsBand";
import { AmeliaBand } from "~/components/AmeliaBand";
import { developers, developmentsByDeveloper } from "~/lib/content";
import { SITE, meta as buildMeta } from "~/lib/site";
import type { Developer } from "~/lib/content";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Developers",
    description:
      "The Serene registry: the developers we are registered with, presented as institutions with track records, delivery history, and notable works.",
    path: "/developers",
  });
}

/* A registry entry — the institution set as an editorial spread: the lockup as
   a stamp, the name in the house light weight, the record in a ledger, and the
   addresses it carries in the register. The whole entry is the link. */
function RegistryEntry({ developer, flip }: { developer: Developer; flip: boolean }) {
  const inRegister = developmentsByDeveloper(developer.slug).length;
  return (
    <Link
      to={`/developers/${developer.slug}`}
      className="group grid items-center gap-8 border-t border-ink/14 py-12 md:grid-cols-12 md:gap-7 md:py-16"
    >
      <div className={`relative overflow-hidden md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
        <Plate
          kind={developer.plate}
          image={developer.image}
          alt={developer.name}
          className="aspect-[16/11] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
        <BrandMark slug={developer.slug} name={developer.name} />
        <h2 className="type-headline mt-6 transition-colors duration-300 group-hover:text-brass">
          {developer.name}
        </h2>
        <p className="type-body-lg mt-3 max-w-[46ch] text-ink/70">{developer.tagline}</p>
        <Ledger
          className="mt-7"
          cells={[
            { k: "Founded", v: developer.founded },
            { k: "Delivered", v: developer.delivered },
            { k: "HQ", v: developer.hq },
            ...(inRegister > 0
              ? [{ k: "In the register", v: `${inRegister} ${inRegister === 1 ? "address" : "addresses"}` }]
              : []),
          ]}
        />
        {developer.notable.length > 0 && (
          <p className="type-cap mt-5 text-fog">Notable: {developer.notable.join(" · ")}</p>
        )}
        <span className="mt-7 inline-flex items-center gap-2.5 border-b border-gold pb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em]">
          The full record
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function Developers() {
  return (
    <>
      <Section className="pt-40">
        <Reveal exit>
          <Eyebrow className="text-fog">The Registry</Eyebrow>
        </Reveal>
        <SplitHeading as="h1" className="type-display mt-6 max-w-[20ch]">
          The institutions behind every address.
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="type-body-lg mt-6 max-w-[54ch] text-ink/70">
            We transact only with developers we are registered with. Each is presented here the way
            it deserves, as an institution with a record, not a logo on a slide.
          </p>
          <Ledger
            className="mt-10"
            cells={[
              { k: "Registered partners", v: String(developers.length) },
              { k: "Licence", v: SITE.rera },
            ]}
          />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <div className="border-b border-ink/14">
          {developers.map((dev, i) => (
            <Reveal key={dev.slug}>
              <RegistryEntry developer={dev} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </Section>

      <AmeliaBand
        title="Delivery records, escrow history, handover punctuality. Ask."
        cta="Ask Amelia about our partners"
        refId="developers-index"
      />
    </>
  );
}
