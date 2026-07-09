import { useCallback, useEffect, useRef, useState } from "react";
import { Plate } from "~/components/primitives";
import type { GalleryImage, PlateKind } from "~/lib/content";

/**
 * Cinematic carousel — the development's full-viewport image reader, and one
 * of only two full-height moments on the page (the other is the hero). Slides
 * crossfade (CSS opacity) with a slow ken-burns breath on the active surface.
 *
 * SSR-safe by construction: the built HTML paints slide 0 static (opacity-100,
 * no animation), and every enhancement — ken-burns, autoplay — is gated behind
 * a post-mount `enhanced` flag (desktop + motion-on), exactly as
 * HorizontalShowcase does. No `initial` animation, so hydration never mismatches.
 * The reduced-motion rule in app.css neutralises the crossfade + ken-burns to
 * instant swaps; the controls always work.
 */

const AUTOPLAY_MS = 6000;

export function CinematicCarousel({
  slides,
  plate,
  title,
}: {
  slides: GalleryImage[];
  plate: PlateKind;
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  // desktop + motion-on gate for ken-burns and autoplay (mirrors HorizontalShowcase)
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnhanced(desktop.matches && !reduce.matches);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + count) % count),
    [count],
  );

  // gentle autoplay — only when enhanced and not being interacted with
  useEffect(() => {
    if (!enhanced || paused || count < 2) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [enhanced, paused, count, active]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${title} — gallery`}
      className="relative flex min-h-[78svh] flex-col justify-end overflow-hidden bg-ink text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      {/* ——— slides: absolutely stacked, crossfaded by opacity ——— */}
      <div aria-hidden className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.src + i}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className={`h-full w-full ${isActive && enhanced ? "carousel-kenburns" : ""}`}>
                <Plate
                  kind={plate}
                  image={slide.src}
                  alt={slide.caption ?? title}
                  eager={i === 0}
                  className="h-full w-full"
                />
              </div>
            </div>
          );
        })}
        {/* legibility scrim — dark floor rising from the bottom, never a flat wall */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.72) 0%, rgba(11,10,8,0.32) 40%, rgba(11,10,8,0.05) 66%, transparent 82%)",
          }}
        />
      </div>

      {/* ——— overlay content ——— */}
      <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-6 pb-10 pt-32 md:px-12 md:pb-12 lg:px-20">
        <div className="type-eyebrow flex items-center gap-2.5 text-gold">
          <span aria-hidden className="h-px w-[22px] bg-current opacity-90" />
          <span>The Frames</span>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-16 md:pt-24">
          {/* caption + counter */}
          <div className="min-w-0">
            <div className="type-data text-ivory/55">
              {String(active + 1).padStart(2, "0")}
              <span className="mx-2 text-ivory/30">/</span>
              {String(count).padStart(2, "0")}
            </div>
            {slides[active].caption && (
              <p className="type-body-lg mt-2 max-w-[44ch] text-ivory/85">{slides[active].caption}</p>
            )}
          </div>

          {/* controls */}
          {count > 1 && (
            <div className="flex items-center gap-3">
              {/* direct-nav ticks */}
              <div className="mr-3 hidden items-center gap-2 md:flex">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to frame ${i + 1}`}
                    aria-current={i === active ? "true" : undefined}
                    className={`h-px w-8 cursor-pointer transition-colors duration-300 ${
                      i === active ? "bg-gold" : "bg-ivory/25 hover:bg-ivory/50"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous frame"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ivory/30 text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/5"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next frame"
                className="flex h-11 w-11 cursor-pointer items-center justify-center border border-ivory/30 text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/5"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
