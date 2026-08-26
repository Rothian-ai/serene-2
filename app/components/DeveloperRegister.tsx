import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, as a drifting band on the frost ground.
 *
 * A tonal step rather than a dark one: ink is spoken for on this page by the
 * hero and the close, and a third dark stretch between them read as a stripe.
 * Frost gives the band its edges without borrowing that weight, and without
 * adding another hairline to a page that has four grids of them.
 *
 * The one real fault of the earlier band is fixed rather than re-skinned. A
 * marquee's duration covers one full translate, so a fixed 48s means the strip
 * runs faster with every mark added — seven drift, thirty blur. The duration is
 * now derived from the count, so the pace per mark holds however long the
 * register gets.
 *
 * Only the first half is reachable: the duplicate exists to make the loop
 * seamless, so it is hidden from assistive technology and out of the tab order,
 * or every developer would be announced and tabbed to twice. Under
 * prefers-reduced-motion the animation stops, the band becomes an ordinary
 * scrollable row, and the duplicate is hidden — a repeat is only seamlessness
 * while it is moving.
 */

/** Seconds per mark. Seven at this rate is the 48s the text strip used to run. */
const SECONDS_PER_MARK = 7;

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
            className="group flex items-center px-9 py-1 md:px-14"
            tabIndex={duplicate ? -1 : undefined}
            aria-label={duplicate ? undefined : `${d.name}, the full record`}
          >
            <BrandMark slug={d.slug} name={d.name} />
          </Link>
          <span aria-hidden className="h-1 w-1 shrink-0 rotate-45 bg-gold/70" />
        </span>
      ))}
    </div>
  );
}

export function DeveloperRegister() {
  const duration = { "--marquee-duration": `${developers.length * SECONDS_PER_MARK}s` };

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

      {/* the ground sits outside the masked box, so it stays solid while the
          marks dissolve at both edges */}
      <div className="mt-14 bg-frost md:mt-20">
        <div className="marquee marquee-fade overflow-hidden py-10" tabIndex={0}>
          <div className="marquee-track flex" style={duration as CSSProperties}>
            <Half />
            <Half duplicate />
          </div>
        </div>
      </div>
    </>
  );
}
