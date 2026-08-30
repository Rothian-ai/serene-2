import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { ConversationBand } from "~/components/ConversationBand";
import { developers } from "~/lib/content";
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
 * The register as one directory, every entry the same shape.
 *
 * It used to be two tiers: seven as full editorial spreads, then the rest under
 * "Also registered with". That split was about which records I had research for,
 * but it did not read that way — it read as a ranking, seven principals and
 * twenty-one hangers-on, which is not true of any of them. They are all
 * registrations of exactly the same kind.
 *
 * So the index is a directory: one cell per developer, one shape, one link
 * each. Depth belongs on the individual pages, where a fuller record simply
 * makes a longer page rather than a better position in a list.
 */
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
          <ul className="grid grid-cols-2 gap-x-7 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {developers.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/developers/${d.slug}`}
                  className="group flex h-full flex-col border-t border-ink/16 pt-6"
                >
                  {/* fixed height so a logo and a wordmark occupy the same box
                      and no row looks more important than another */}
                  <span className="flex h-12 items-center">
                    <BrandMark slug={d.slug} name={d.name} compact />
                  </span>
                  <span className="type-title mt-4 text-[1.05rem] transition-colors duration-300 group-hover:text-brass">
                    {d.name}
                  </span>
                  {/* No tagline here, though seven of them have one. A cell with
                      two extra lines of prose stands taller than its neighbours,
                      and a directory where some entries are visibly bigger reads
                      as a ranking — which is the exact thing this page had to
                      stop doing. The tagline still opens the record page. */}
                  <span className="type-cap mt-auto pt-5 flex items-center gap-2 text-fog">
                    The record
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

        <Reveal className="mt-12">
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
