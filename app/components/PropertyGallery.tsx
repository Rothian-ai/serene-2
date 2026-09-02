import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import { sizedImage, sizedSrcSet } from "~/lib/amelia";

/**
 * The photography, as a set rather than a strip.
 *
 * A uniform three-across grid gave nine identical frames and said nothing about
 * which one mattered. This is the editorial alternative: the lead photograph
 * holds a double frame, the rest sit beside it, and everything past the fifth
 * frame folds into one labelled tile — the catalogue sends a dozen or more per
 * property, and a wall of every one of them is a chore, not an invitation.
 *
 * Every frame opens the viewer at its own photograph. The viewer is a native
 * <dialog>, which brings focus containment and Escape for free; arrows and a
 * counter do the rest. No thumbnails inside it — the grid behind it is the
 * thumbnails.
 */

export interface GalleryImage {
  url: string;
  caption: string | null;
}

/** How many frames the wall shows before folding into the "all N" tile. */
const WALL_MAX = 5;

/* The wall's shape depends on how many photographs exist. Each count maps to
   one grid so there are never holes: 2 sits as a pair, 3 gives the lead a
   double frame with two beside it, 4 adds a wide foot, 5 fills the classic
   quad. The aspect on the grid container is what sizes the rows — the frames
   just fill their cells. */
const GRIDS: Record<number, string> = {
  2: "md:grid-cols-2 md:aspect-[16/6]",
  3: "md:grid-cols-3 md:grid-rows-2 md:aspect-[16/8]",
  4: "md:grid-cols-4 md:grid-rows-2 md:aspect-[16/7]",
  5: "md:grid-cols-4 md:grid-rows-2 md:aspect-[16/7]",
};

function frameShape(count: number, i: number): string {
  // Mobile is one honest column: the lead full-width, the rest paired.
  const mobile = i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]";
  const md =
    i === 0 && count >= 3
      ? "md:col-span-2 md:row-span-2"
      : count === 4 && i === 3
        ? "md:col-span-2"
        : "";
  return `${mobile} md:aspect-auto md:h-full ${md}`;
}

export function PropertyGallery({ name, images }: { name: string; images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  const count = images.length;

  const openAt = useCallback((i: number) => {
    setCurrent(i);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);
  // The lock is released here as well as on the `close` event: every control in
  // the viewer routes through this, and the event covers what does not (the
  // browser's own Escape).
  const close = useCallback(() => {
    document.body.style.overflow = "";
    dialogRef.current?.close();
  }, []);
  const step = useCallback(
    (d: number) => setCurrent((c) => (c + d + count) % count),
    [count],
  );

  // ← / → page the viewer while it is open; Escape is the dialog's own. The
  // scroll lock is released on the native `close` event so every way out —
  // the button, the ground, Escape — restores the page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      // The browser's own cancel also closes; handling it here too means the
      // viewer still closes where an embedder swallows the default.
      if (e.key === "Escape") close();
    };
    const onClose = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step, close]);

  if (count === 0) return null;

  const wall = images.slice(0, Math.min(count, WALL_MAX));
  const folded = count > WALL_MAX;
  const active = images[current];

  return (
    <>
      {count === 1 ? (
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`Open the photograph of ${name}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden"
        >
          <div className="aspect-[16/10] md:aspect-[21/10]">
            <Plate
              kind="render"
              image={sizedImage(images[0].url, 1920)}
              srcSet={sizedSrcSet(images[0].url, [960, 1280, 1920])}
              sizes="100vw"
              alt={images[0].caption ?? `${name}, photograph`}
              className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>
        </button>
      ) : (
        <div className={`grid grid-cols-2 gap-2.5 md:gap-3 ${GRIDS[wall.length] ?? GRIDS[5]}`}>
          {wall.map((img, i) => {
            const isFold = folded && i === wall.length - 1;
            return (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => openAt(i)}
                aria-label={
                  isFold
                    ? `Open all ${count} photographs of ${name}`
                    : `Open photograph ${i + 1} of ${count}`
                }
                className={`group relative block w-full cursor-zoom-in overflow-hidden ${frameShape(wall.length, i)}`}
              >
                <Plate
                  kind="render"
                  image={sizedImage(img.url, 960)}
                  srcSet={sizedSrcSet(img.url, [640, 960, 1280])}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={img.caption ?? `${name}, photograph ${i + 1}`}
                  className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                {isFold && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/72 text-ivory transition-colors duration-300 group-hover:bg-ink/60">
                    <span className="type-data text-[1.05rem]">All {count} photographs</span>
                    <span className="type-cap text-ivory/70">Open the set</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ——— the viewer ——— */}
      <dialog
        ref={dialogRef}
        aria-label={`${name}, photographs`}
        onClick={(e) => {
          // The dialog fills the viewport, so a click that reaches the element
          // itself (not the frame or the controls) is a click on the ground.
          if (e.target === dialogRef.current) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink/[0.97] p-0 text-ivory backdrop:bg-ink/80"
      >
        <div className="flex h-full flex-col">
          <div className="container-site flex items-center justify-between gap-6 py-5">
            <p className="type-eyebrow text-silver">{name}</p>
            <div className="flex items-center gap-5">
              <p className="type-data tabular-nums text-silver">
                {current + 1} / {count}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close the photographs"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ivory/35 text-[1.15rem] leading-none transition-colors hover:border-ivory"
              >
                ×
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <motion.img
              key={current}
              src={sizedImage(active.url, 1920)}
              alt={active.caption ?? `${name}, photograph ${current + 1}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-h-full max-w-full select-none object-contain"
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photograph"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-ivory/35 bg-ink/40 transition-colors hover:border-ivory md:left-6"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photograph"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-ivory/35 bg-ink/40 transition-colors hover:border-ivory md:right-6"
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="container-site flex min-h-[3.5rem] items-center justify-center py-4">
            {active.caption && <p className="type-cap text-center text-silver">{active.caption}</p>}
          </div>
        </div>

        {/* the neighbours, decoded before they are asked for */}
        {count > 1 && (
          <div hidden aria-hidden>
            <img src={sizedImage(images[(current + 1) % count].url, 1920)} alt="" />
            <img src={sizedImage(images[(current - 1 + count) % count].url, 1920)} alt="" />
          </div>
        )}
      </dialog>
    </>
  );
}
