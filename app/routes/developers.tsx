import { Link } from "react-router";
import { Eyebrow, Plate, QuietLink, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { ConversationBand } from "~/components/ConversationBand";
import { developers } from "~/lib/content";
import type { PlateKind } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "dark" as const };

export function meta() {
  return buildMeta({
    title: "Developers",
    description:
      "Cross-developer, selected on suitability, with the due diligence disclosed. Every developer Serene is registered with, each with its own record.",
    path: "/developers",
  });
}

/**
 * The register as one directory of image tiles.
 *
 * This page has been three things. Editorial spreads read well, but only the
 * few records with photography could carry one, so the rest arrived as an "also
 * registered with" list and the split read as a ranking. Replacing it with a
 * hairline grid fixed the ranking and lost the pictures.
 *
 * So: one tile per developer, identical in size and structure, and every one of
 * them carries an art-directed ground rather than a photograph. We hold licensed
 * photography for only a few of them, and putting a real building behind those
 * and a plate behind the rest reinstates exactly the hierarchy this page had to
 * lose. The plates are the same six surfaces used
 * across the site, so the wall reads as one set and the subject of every tile is
 * the developer's mark rather than the picture behind it.
 *
 * It also grows the right way: a twenty-ninth registration is one more tile. If
 * photography ever exists for all of them, passing image={d.image} to the Plate
 * is the whole change.
 */

/* Six grounds cycled by position. Four columns against six kinds means neither
   the tile beside a given one nor the tile above it can repeat its ground, and
   nothing about which ground a tile gets is a judgement on the developer
   standing on it. */
const GROUNDS: PlateKind[] = ["render", "glass", "dusk", "stone", "interior", "hero"];

export default function Developers() {
  return (
    <>
      <Hero plate="render" image="/images/dev-emaar.jpg" height="min-h-[60svh]">
        <Eyebrow className="text-silver">{REGISTER_INTRO.eyebrow}</Eyebrow>
        <SplitHeading as="h1" mode="chars" className="type-display mt-5 max-w-[20ch]">
          {REGISTER_INTRO.headline}
        </SplitHeading>
        <p className="type-body-lg mt-6 max-w-[54ch] text-ivory/72">{REGISTER_INTRO.full}</p>
      </Hero>

      <Section>
        <Reveal exit>
          <p className="type-body-lg max-w-[58ch] text-ink/74">{REGISTER_INTRO.body}</p>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:gap-x-6 md:gap-y-11 lg:grid-cols-4">
            {developers.map((d, i) => (
              <li key={d.slug}>
                <Link to={`/developers/${d.slug}`} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Plate
                      kind={GROUNDS[i % GROUNDS.length]}
                      /* .plate carries position:relative in plain CSS, which outranks
                         an `absolute` utility — so size it rather than pin it. */
                      className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    {/* The scrim is what guarantees the mark reads whatever
                        ground it lands on. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/52 to-ink/34 transition-opacity duration-500 group-hover:opacity-85"
                    />
                    <span className="absolute inset-0 flex items-center justify-center px-5">
                      <BrandMark slug={d.slug} name={d.name} tone="ivory" />
                    </span>
                  </span>
                  <span className="type-title mt-4 block text-[1.05rem] transition-colors duration-300 group-hover:text-brass">
                    {d.name}
                  </span>
                  {/* No tagline. Some entries carry one and most do not, and a
                      cell two lines taller than its neighbours is the ranking
                      this page had to stop implying; the tagline opens the
                      entry's own page instead.

                      And not "the record" for the link: only a few of these
                      pages carry a ledger, and that word promises one. "The
                      registration" is true of a thin entry and a full one
                      alike. */}
                  <span className="type-cap mt-2 flex items-center gap-2 text-fog">
                    The registration
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <QuietLink to="/properties">The addresses they are building</QuietLink>
        </Reveal>
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
