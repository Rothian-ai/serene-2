import { Link } from "react-router";
import { Eyebrow, Ledger, Plate, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { ConversationBand } from "~/components/ConversationBand";
import { developers } from "~/lib/content";
import type { Developer } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Developers",
    description:
      "Cross-developer, selected on suitability, with the due diligence disclosed. The developers Serene is registered with, each with its founding, its delivery record and its notable works.",
    path: "/developers",
  });
}

/**
 * A registry entry, set as an editorial spread rather than a card: the lockup
 * as a stamp, the name in the house light weight, the record in a ledger. The
 * whole row is the link, and alternate rows flip so the page reads as a
 * register rather than a grid of tiles.
 */
function RegistryEntry({ developer, flip }: { developer: Developer; flip: boolean }) {
  return (
    <Link
      to={`/developers/${developer.slug}`}
      className="group grid items-center gap-8 border-t border-ink/14 py-12 md:grid-cols-12 md:gap-7 md:py-16"
    >
      <div
        className={`relative overflow-hidden md:col-span-5 ${
          flip ? "md:order-2 md:col-start-8" : ""
        }`}
      >
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
      <Hero plate="render" image="/images/dev-emaar.jpg" height="min-h-[64svh]">
        <Eyebrow className="text-silver">{REGISTER_INTRO.eyebrow}</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          The developers we are registered with.
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">{REGISTER_INTRO.full}</p>
      </Hero>

      <Section>
        <div className="hairline-b">
          {developers.map((d, i) => (
            <RegistryEntry key={d.slug} developer={d} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <ConversationBand
        eyebrow="Request a conversation"
        title="We will not call you unless you ask us to."
        copy="Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence."
        context="a specific developer"
        secondary="How we are different"
        secondaryTo="/difference"
        image="/images/about-understand.jpg"
        alt="An architectural section drawing, read in full"
      />
    </>
  );
}
