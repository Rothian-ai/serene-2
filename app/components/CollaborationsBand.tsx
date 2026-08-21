import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import { developers, developments, getDeveloper } from "~/lib/content";

/**
 * Collaborations — "A new realm of curated collaborations." A pinned heading +
 * brand row sits at the top of the block; a masonry grid (higher z-index,
 * negative-margined) slides up from below and covers it — the "clash" — while
 * the head fades and blurs over the same distance. Columns drift at different
 * speeds for depth. All motion is client-only and collapses under
 * prefers-reduced-motion (the head stays put, the grid simply sits below).
 *
 * The names are the registry itself — the developers we are registered with,
 * set large; every grid card is a development, and opens its page.
 */

const COL_SPEEDS = [0.85, 1.15, 0.9, 1.05];

/** Real developer lockups (see public/images/brands/CREDITS). Rendered through
    a CSS mask so mixed sources read as one ink-toned register. */
const BRAND_LOGOS: Record<string, { src: string; w: string }> = {
  emaar: { src: "/images/brands/dev-emaar.svg", w: "w-[120px] md:w-[150px]" },
  aldar: { src: "/images/brands/dev-aldar.png", w: "w-[58px] md:w-[70px]" },
  "sobha-realty": { src: "/images/brands/dev-sobha.svg", w: "w-[112px] md:w-[140px]" },
  nakheel: { src: "/images/brands/dev-nakheel.svg", w: "w-[120px] md:w-[150px]" },
  meraas: { src: "/images/brands/dev-meraas.svg", w: "w-[112px] md:w-[140px]" },
  binghatti: { src: "/images/brands/dev-binghatti.svg", w: "w-[108px] md:w-[135px]" },
  arada: { src: "/images/brands/dev-arada.svg", w: "w-[108px] md:w-[135px]" },
};

// one card per development, in register order — the branded collaborations included
type Card = { slug: string; image?: string; plate: string; label: string; developer: string };
const CARDS: Card[] = developments
  .slice(0, 8)
  .map((d) => ({ slug: d.slug, image: d.image, plate: d.plate, label: d.title, developer: d.developer }));

export function BrandMark({ slug, name }: { slug: string; name: string }) {
  const logo = BRAND_LOGOS[slug];
  if (!logo) {
    return (
      <span className="font-light leading-none text-[clamp(1.6rem,3vw,2.4rem)] text-ink/80">{name}</span>
    );
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={`block h-9 md:h-11 ${logo.w} bg-ink/80 transition-colors duration-300 group-hover:bg-brass`}
      style={{
        WebkitMaskImage: `url("${logo.src}")`,
        maskImage: `url("${logo.src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

function CardTile({ card, kind }: { card: Card; kind: "tall" | "short" | "" }) {
  const aspect = kind === "tall" ? "aspect-[3/4.6]" : kind === "short" ? "aspect-[3/3.2]" : "aspect-[3/4]";
  const dev = getDeveloper(card.developer);
  return (
    <Link
      to={`/developments/${card.slug}`}
      className={`group relative block overflow-hidden bg-ink text-ivory ${aspect}`}
    >
      <Plate
        kind={card.plate as never}
        image={card.image}
        alt={card.label}
        className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,21,38,0.6) 0%, rgba(10,21,38,0.05) 42%, transparent 62%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-dawn" />
          <span className="type-title text-[1.05rem] text-ivory">{card.label}</span>
        </div>
        {dev && <span className="type-eyebrow mt-1.5 block pl-3.5 text-ivory/60">{dev.name}</span>}
      </div>
    </Link>
  );
}

export function CollaborationsBand() {
  const reduced = useReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const grid = gridRef.current;
    const head = headRef.current;
    if (!grid || !head) return;
    let ticking = false;

    const update = () => {
      const rect = grid.getBoundingClientRect();
      const vh = window.innerHeight;
      // clash fade: 0 while the grid is well below the head, 1 once it covers it
      const fadeStart = 440;
      const fadeEnd = 60;
      let clash = (fadeStart - rect.top) / (fadeStart - fadeEnd);
      clash = Math.max(0, Math.min(1, clash));
      head.style.opacity = String(1 - clash);
      head.style.transform = `translateY(${(-clash * 46).toFixed(1)}px) scale(${(1 - clash * 0.05).toFixed(3)})`;
      // column parallax — clamped so it stays a subtle drift, never a gap
      const scrolled = vh / 2 - rect.top;
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        const speed = COL_SPEEDS[i % COL_SPEEDS.length];
        const offset = Math.max(-90, Math.min(90, scrolled * (speed - 1)));
        col.style.transform = `translateY(${offset.toFixed(1)}px)`;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  // distribute cards across 4 columns, with the reference's staggered tops
  const columns: Card[][] = [[], [], [], []];
  CARDS.forEach((c, i) => columns[i % 4].push(c));
  const colOffset = ["", "md:mt-16", "md:mt-8", "md:mt-24"];
  const tileKind = (col: number, row: number): "tall" | "short" | "" =>
    (col + row) % 3 === 0 ? "tall" : (col + row) % 3 === 1 ? "short" : "";

  return (
    /* NOTE: no overflow-hidden here — an overflow-clipping ancestor disables
       position:sticky, which kills the pin and therefore the clash. */
    <section className="relative bg-ivory">
      <div className="container-site relative h-[780px] md:h-[900px]">
        <div ref={headRef} className="sticky top-0 z-[1] pt-24 will-change-[opacity,transform] md:pt-28">
          <h2 className="mx-auto max-w-[24ch] text-center type-headline uppercase tracking-[0.06em]">
            Registered with each of them. Beholden to none
          </h2>
          <p className="mx-auto mt-5 max-w-[60ch] text-center type-body-lg text-ink/64">
            We transact only under formal registration with these institutions — and because our
            advisors are salaried, we have no reason to favour one over another. Each name carries
            the addresses it holds in the register.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-8 border-b border-ink/12 pb-10 md:mt-12 md:gap-x-8 lg:gap-x-10">
            {developers.map((dev) => (
              <Link
                key={dev.slug}
                to={`/developers/${dev.slug}`}
                className="group block text-center"
                aria-label={dev.name}
              >
                <BrandMark slug={dev.slug} name={dev.name} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="container-site relative z-[2] -mt-[320px] grid grid-cols-2 gap-5 pb-24 md:-mt-[420px] md:grid-cols-4"
      >
        {columns.map((col, ci) => (
          <div
            key={ci}
            ref={(el) => {
              colRefs.current[ci] = el;
            }}
            className={`flex flex-col gap-5 will-change-transform ${colOffset[ci]}`}
          >
            {col.map((card, ri) => (
              <CardTile key={`${ci}-${ri}`} card={card} kind={tileKind(ci, ri)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
