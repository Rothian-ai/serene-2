import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, as a drifting band on ink.
 *
 * Two reasons it is not another ruled grid. The homepage already ran four of
 * those in sequence — the commitments, this, the value chain, the market
 * figures — and it ran ivory or frost the whole way from the hero to the close.
 * A dark band solves both at once: it breaks the device and it gives the page
 * its one change of ground.
 *
 * The motion is the site's existing marquee (`.marquee` in app.css, kept from
 * the text strip this replaces): two identical halves, translated by -50% for a
 * seamless loop, at 48s — a drift rather than a scroll. It pauses on hover and
 * on keyboard focus, and under prefers-reduced-motion the animation stops and
 * the band becomes an ordinary horizontally scrollable row.
 *
 * Only the first half is reachable. The duplicate exists to make the loop
 * seamless, so it is hidden from assistive technology and taken out of the tab
 * order — otherwise every developer would be announced and tabbed to twice.
 */
function Half({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center${duplicate ? " marquee-dup" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {developers.map((d) => (
        <span key={d.slug} className="flex items-center">
          <Link
            to={`/developers/${d.slug}`}
            className="group flex items-center px-9 py-1 md:px-12"
            tabIndex={duplicate ? -1 : undefined}
            aria-label={duplicate ? undefined : `${d.name}, the full record`}
          >
            <BrandMark slug={d.slug} name={d.name} tone="ivory" />
          </Link>
          <span aria-hidden className="h-1 w-1 shrink-0 rotate-45 bg-gold/70" />
        </span>
      ))}
    </div>
  );
}

export function DeveloperRegister() {
  return (
    <>
      <Section className="pb-0">
        <div className="grid gap-8 md:grid-cols-12 md:gap-7">
          <Reveal className="md:col-span-5" exit>
            <Eyebrow className="text-fog">{REGISTER_INTRO.eyebrow}</Eyebrow>
            <SplitHeading as="h2" className="type-display mt-5 max-w-[16ch]">
              {REGISTER_INTRO.headline}
            </SplitHeading>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7 md:pt-3">
            <p className="type-body-lg text-ink/74">{REGISTER_INTRO.body}</p>
            <div className="mt-7">
              <QuietLink to="/developers">The full register</QuietLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* full-bleed: the band runs edge to edge, outside the container */}
      <div className="marquee mt-14 overflow-hidden border-y border-ivory/12 bg-ink py-9 md:mt-20" tabIndex={0}>
        <div className="marquee-track flex">
          <Half />
          <Half duplicate />
        </div>
      </div>
    </>
  );
}
