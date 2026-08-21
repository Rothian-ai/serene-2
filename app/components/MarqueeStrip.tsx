/**
 * A slow, continuous strip of the four structural commitments, on the ink
 * ground. The track holds two identical halves; translating by -50% loops
 * seamlessly (the `.marquee` rules in app.css). It pauses on hover and on
 * keyboard focus, and under prefers-reduced-motion it stops moving and becomes
 * a horizontally scrollable row instead.
 *
 * This is the one piece of ambient, non-scroll-driven motion on the site. It
 * earns its place because the four claims are the shortest possible statement
 * of the model, and reading them go past is how a visitor who scrolls fast
 * still meets them.
 */

const CLAIMS = [
  "Salaried advisors",
  "No commission per deal",
  "No cold calls",
  "No kickbacks",
  "Cross-developer comparison",
  "Independent snagging as standard",
  "Present through construction",
  "Still here at resale",
];

function Half({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {CLAIMS.map((c) => (
        <span key={c} className="flex items-center whitespace-nowrap">
          <span className="type-eyebrow px-7 text-ivory/72">{c}</span>
          <span aria-hidden className="h-1 w-1 shrink-0 rotate-45 bg-gold/70" />
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div className="marquee overflow-hidden border-y border-ivory/12 bg-ink py-5" tabIndex={0}>
      <div className="marquee-track flex">
        <Half />
        {/* the duplicate half is what makes the -50% translate seamless */}
        <Half ariaHidden />
      </div>
    </div>
  );
}
