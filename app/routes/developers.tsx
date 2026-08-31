import { data, Link, useLoaderData } from "react-router";
import type { HeadersArgs, LoaderFunctionArgs } from "react-router";
import { Eyebrow, Plate, QuietLink, Reveal, Section } from "~/components/primitives";
import { Hero } from "~/components/Hero";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { ConversationBand } from "~/components/ConversationBand";
import { developers } from "~/lib/content";
import type { PlateKind } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";
import { fetchAllProjects, isAmeliaConfigured, serverTiming } from "~/lib/amelia.server";
import type { Timing } from "~/lib/amelia.server";
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

const FRESH = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const BRIEF = "public, max-age=0, s-maxage=15";

export function headers({ loaderHeaders }: HeadersArgs) {
  const out: Record<string, string> = {
    "Cache-Control": loaderHeaders.get("Cache-Control") ?? FRESH,
  };
  const timing = loaderHeaders.get("Server-Timing");
  if (timing) out["Server-Timing"] = timing;
  return out;
}

/**
 * The wall is drawn from the catalogue now, not from the content folder.
 *
 * The curated list and the register drifted the way two hand-kept lists always
 * do: developers joined the catalogue that no one wrote a markdown file for,
 * and files outlived registrations. So the loader asks Amelia who is actually
 * on the register today, and the curated entries only decide where a tile
 * links — a researched profile page when one exists, the developer's own
 * addresses on the register when it does not.
 *
 * The curated wall still renders whole when the catalogue is unreachable or
 * unconfigured: a fresh clone shows the register as last written rather than
 * an empty page.
 */
interface RegisterDeveloper {
  name: string;
  logoUrl: string | null;
  logoOnDark: boolean;
  count: number;
  /** the curated entry's slug, when this developer has a researched page */
  entry: string | null;
}

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function loader({ request }: LoaderFunctionArgs) {
  if (!isAmeliaConfigured()) {
    return data({ register: null }, { headers: { "Cache-Control": BRIEF } });
  }
  const timing: Timing = { upstreamMs: 0, shapeMs: 0 };
  try {
    const cards = await fetchAllProjects(request.signal, timing);
    const byName = new Map<string, RegisterDeveloper>();
    for (const c of cards) {
      const name = c.developer?.name?.trim();
      if (!name) continue;
      const key = squash(name);
      const held = byName.get(key);
      if (held) {
        held.count += 1;
        if (!held.logoUrl) held.logoUrl = c.developer?.logoUrl ?? null;
      } else {
        byName.set(key, {
          name,
          logoUrl: c.developer?.logoUrl ?? null,
          logoOnDark: Boolean(c.developer?.logoOnDark),
          count: 1,
          entry:
            developers.find((d) => squash(d.name) === key || squash(d.slug) === key)?.slug ??
            null,
        });
      }
    }
    const register = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
    return data(
      { register: register.length > 0 ? register : null },
      { headers: { "Cache-Control": FRESH, "Server-Timing": serverTiming(timing) } },
    );
  } catch {
    // A catalogue outage is not a broken page: the curated wall stands in.
    return data({ register: null }, { headers: { "Cache-Control": BRIEF } });
  }
}

/* Six grounds cycled by position. Four columns against six kinds means neither
   the tile beside a given one nor the tile above it can repeat its ground, and
   nothing about which ground a tile gets is a judgement on the developer
   standing on it. */
const GROUNDS: PlateKind[] = ["render", "glass", "dusk", "stone", "interior", "hero"];

/** One tile of the wall: art-directed ground, scrim, and the developer's mark. */
function Tile({
  index,
  to,
  mark,
  name,
  caption,
}: {
  index: number;
  to: string;
  mark: React.ReactNode;
  name: string;
  caption: string;
}) {
  return (
    <li>
      <Link to={to} className="group block">
        <span className="relative block aspect-[4/3] overflow-hidden">
          <Plate
            kind={GROUNDS[index % GROUNDS.length]}
            /* .plate carries position:relative in plain CSS, which outranks
               an `absolute` utility — so size it rather than pin it. */
            className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          {/* The scrim is what guarantees the mark reads whatever ground it
              lands on. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/52 to-ink/34 transition-opacity duration-500 group-hover:opacity-85"
          />
          <span className="absolute inset-0 flex items-center justify-center px-5">{mark}</span>
        </span>
        <span className="type-title mt-4 block text-[1.05rem] transition-colors duration-300 group-hover:text-brass">
          {name}
        </span>
        <span className="type-cap mt-2 flex items-center gap-2 text-fog">
          {caption}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function Developers() {
  const { register } = useLoaderData<typeof loader>();

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
            {register
              ? register.map((d, i) => (
                  <Tile
                    key={d.name}
                    index={i}
                    to={
                      d.entry
                        ? `/developers/${d.entry}`
                        : `/properties?developer=${encodeURIComponent(d.name)}`
                    }
                    name={d.name}
                    /* Not "the record" for a link into a thin entry: only the
                       researched pages carry a ledger, and that word promises
                       one. The register filter is honest for everyone else. */
                    caption={`${d.count} ${d.count === 1 ? "address" : "addresses"} · ${
                      d.entry ? "The registration" : "On the register"
                    }`}
                    mark={
                      d.logoUrl ? (
                        /* The catalogue's own artwork. Light lockups stand
                           straight on the scrim; dark ones get a pearl plate. */
                        <span
                          className={`inline-flex max-w-[78%] items-center justify-center ${
                            d.logoOnDark ? "" : "bg-ivory/95 px-3.5 py-2.5"
                          }`}
                        >
                          <img
                            src={d.logoUrl}
                            alt=""
                            loading="lazy"
                            className="max-h-11 w-auto max-w-full object-contain md:max-h-12"
                          />
                        </span>
                      ) : (
                        <BrandMark slug={d.entry ?? squash(d.name)} name={d.name} tone="ivory" />
                      )
                    }
                  />
                ))
              : developers.map((d, i) => (
                  <Tile
                    key={d.slug}
                    index={i}
                    to={`/developers/${d.slug}`}
                    name={d.name}
                    caption="The registration"
                    mark={<BrandMark slug={d.slug} name={d.name} tone="ivory" />}
                  />
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
