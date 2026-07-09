import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import { developments } from "~/lib/content";

/**
 * Collaborations — "A new realm of curated collaborations." A pinned heading +
 * brand row sits at the top of the block; a masonry grid (higher z-index,
 * negative-margined) slides up from below and covers it — the "clash" — while
 * the head fades and blurs over the same distance. Columns drift at different
 * speeds for depth. All motion is client-only and collapses under
 * prefers-reduced-motion (the head stays put, the grid simply sits below).
 *
 * PLACEHOLDER roster/imagery for the design stage — logos are the collaboration
 * houses on hand; grid cards reuse the development photography. Swap for the
 * real collaboration set + licensed lockups before launch.
 */

const BRANDS = [
  { name: "Giorgio Armani", logo: "/images/brands/armani.svg" },
  { name: "Bulgari", logo: "/images/brands/bvlgari.svg" },
  { name: "Fendi Casa", logo: "/images/brands/fendi.svg" },
  { name: "Roberto Cavalli", logo: "/images/brands/cavalli.svg" },
  { name: "Aston Martin", logo: "/images/brands/aston-martin.svg" },
  { name: "Bugatti", logo: "/images/brands/bugatti.svg" },
];

const COL_SPEEDS = [0.85, 1.15, 0.9, 1.05];

// build ~8 image cards from the developments (main + first gallery frame)
type Card = { image?: string; plate: string; label: string };
const CARDS: Card[] = developments
  .flatMap((d) => {
    const items: Card[] = [{ image: d.image, plate: d.plate, label: d.title }];
    if (d.gallery[1]) items.push({ image: d.gallery[1].src, plate: d.plate, label: d.title });
    return items;
  })
  .slice(0, 8);

function BrandLogo({ src, name }: { src: string; name: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className="block h-8 w-[130px] bg-ink/70 transition-colors duration-300 hover:bg-brass md:h-9 md:w-[150px]"
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
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
  return (
    <article className={`relative overflow-hidden bg-ink text-ivory ${aspect}`}>
      <Plate kind={card.plate as never} image={card.image} alt={card.label} className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(11,10,8,0.6) 0%, rgba(11,10,8,0.05) 42%, transparent 62%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 md:p-5">
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-dawn" />
        <span className="type-title text-[1.05rem] text-ivory">{card.label}</span>
      </div>
    </article>
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
      head.style.filter = `blur(${(clash * 4).toFixed(1)}px)`;
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
    <section className="relative overflow-hidden bg-ivory">
      <div className="relative mx-auto h-[900px] max-w-[1440px] px-6 md:h-[1040px] md:px-12 lg:px-20">
        <div ref={headRef} className="sticky top-0 z-[1] pt-24 will-change-[opacity,transform,filter] md:pt-28">
          <h2 className="mx-auto max-w-[22ch] text-center type-headline uppercase tracking-[0.06em]">
            A new realm of curated collaborations
          </h2>
          <p className="mx-auto mt-5 max-w-[58ch] text-center type-body-lg text-ink/64">
            The residences we represent are shaped with the houses that define modern luxury — a
            short, deliberate register of the names behind the addresses.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 border-b border-ink/12 pb-12 md:mt-14">
            {BRANDS.map((b) => (
              <BrandLogo key={b.name} src={b.logo} name={b.name} />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={gridRef}
        className="relative z-[2] mx-auto -mt-[340px] grid max-w-[1440px] grid-cols-2 gap-5 px-6 pb-24 md:-mt-[380px] md:grid-cols-4 md:px-12 lg:px-20"
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
