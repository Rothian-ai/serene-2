import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Eyebrow, QuietLink, Reveal, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { BrandMark } from "~/components/BrandMark";
import { developers } from "~/lib/content";
import type { Developer } from "~/lib/content";
import { REGISTER_INTRO } from "~/lib/strategy";

/**
 * The register, as two counter-drifting rows on the frost ground.
 *
 * One row of twenty-eight was the problem: a marquee's duration has to scale
 * with its length or it speeds up as marks are added, so twenty-eight meant a
 * 196-second loop and a visitor scrolling past saw two developers. Split across
 * two rows it is fourteen each, 98 seconds, and twice as many marks are on
 * screen at any moment. Running them in opposite directions is what makes the
 * pair read as one wall rather than two unrelated strips.
 *
 * Everything the single row had is kept: the duration derives from the row's own
 * count so the pace per mark never changes, both rows pause together on hover
 * and focus (which needs the marquee-wall class on the pair, since .marquee
 * scopes only to the row the pointer is actually over), the duplicate halves
 * are hidden from assistive technology and taken out of the tab order, and
 * under prefers-reduced-motion the animation stops, the rows become ordinary
 * scrollable strips and the duplicates are hidden.
 *
 * Some of the register has no logo file yet, so BrandMark's wordmark fallback
 * carries those. Every mark links: each developer has a page, whether or not
 * there is a written profile behind it.
 */

/** Seconds per mark. Holds the pace steady however long the register gets. */
const SECONDS_PER_MARK = 7;

function Row({
  marks,
  reverse = false,
}: {
  marks: Developer[];
  reverse?: boolean;
}) {
  const duration = { "--marquee-duration": `${marks.length * SECONDS_PER_MARK}s` };
  const half = (duplicate: boolean) => (
    <div
      className={`flex shrink-0 items-center${duplicate ? " marquee-dup" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {marks.map((d) => (
        <span key={d.slug} className="flex items-center">
          <Link
            to={`/developers/${d.slug}`}
            className="group flex items-center px-8 py-1 md:px-11"
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

  return (
    <div className="marquee marquee-fade overflow-hidden py-3" tabIndex={0}>
      <div
        className={`flex ${reverse ? "marquee-track-reverse" : "marquee-track"}`}
        style={duration as CSSProperties}
      >
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}

export function DeveloperRegister() {
  // split down the middle; an odd count leaves the extra mark on the top row
  const cut = Math.ceil(developers.length / 2);
  const top = developers.slice(0, cut);
  const bottom = developers.slice(cut);

  return (
    <div className="bg-frost">
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
          </Reveal>
        </div>
      </Section>

      <div className="marquee-wall mt-9 flex flex-col gap-2 md:mt-11">
        <Row marks={top} />
        <Row marks={bottom} reverse />
      </div>

      <Section className="pt-0">
        <Reveal className="mt-9">
          <QuietLink to="/developers">All {developers.length} developers</QuietLink>
        </Reveal>
      </Section>
    </div>
  );
}
