import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Plate } from "~/components/primitives";
import type { PlateKind } from "~/lib/content";
import { EASE_INOUT, EASE_QUIET, isHydrated } from "~/lib/motion";

/**
 * Cinematic hero — one of the four sanctioned cinematic moments.
 * Mask reveal + scale-settle on the surface; fade-rise on the type.
 * A slow ken-burns drift keeps the surface alive; an optional scroll cue
 * invites the descent. `video` (optional) plays muted/looped over the plate.
 * All motion collapses under prefers-reduced-motion.
 */
export function Hero({
  plate,
  image,
  srcSet,
  avifSrcSet,
  video,
  children,
  overline,
  height = "min-h-[88svh]",
  direction,
  scrollCue = false,
}: {
  plate: PlateKind;
  image?: string;
  srcSet?: string;
  avifSrcSet?: string;
  video?: string;
  children: ReactNode;
  /** small tracked label above the title — structure for tall heroes */
  overline?: ReactNode;
  height?: string;
  direction?: string;
  /** the descending invitation — home and other full-height heroes only */
  scrollCue?: boolean;
}) {
  const reduced = useReducedMotion();
  // Prerendered HTML must paint the hero complete — the mask reveal plays
  // only on client-side navigations (captured once at mount).
  const [animateIn] = useState(() => isHydrated() && !reduced);
  const ref = useRef<HTMLDivElement>(null);
  // ambient drift: the surface eases upward as the visitor scrolls past (≤8%)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  return (
    <div ref={ref} className={`relative flex ${height} items-end overflow-hidden bg-ink text-ivory`}>
      <motion.div
        className="absolute inset-x-0 top-0 -bottom-[10%]"
        style={reduced ? undefined : { y: bgY }}
        initial={animateIn ? { clipPath: "inset(100% 0 0 0)" } : false}
        animate={
          animateIn
            ? { clipPath: "inset(0% 0 0 0)", transition: { duration: 1.1, ease: EASE_INOUT } }
            : undefined
        }
      >
        {/* ken-burns: a slow breath of light, never a zoom you can catch */}
        <motion.div
          className="h-full w-full"
          style={{ transformOrigin: "50% 55%" }}
          initial={animateIn ? { scale: 1.08 } : false}
          animate={
            reduced
              ? undefined
              : animateIn
                ? {
                    scale: [1.03, 1.06],
                    transition: {
                      scale: {
                        duration: 22,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1.2,
                      },
                    },
                  }
                : { scale: [1.005, 1.05] }
          }
          transition={
            reduced || animateIn
              ? undefined
              : { duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
          }
        >
          <Plate kind={plate} image={image} srcSet={srcSet} avifSrcSet={avifSrcSet} eager className="h-full w-full">
            {video && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={video}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            )}
          </Plate>
        </motion.div>
        {/* legibility scrim — from edges, never a flat wall */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,21,38,0.7) 0%, rgba(10,21,38,0.3) 42%, rgba(10,21,38,0.06) 65%, transparent 80%)",
          }}
        />
      </motion.div>
      <div className="relative z-[1] w-full">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-40 md:px-12 lg:px-20">
          {overline && (
            <motion.div
              initial={animateIn ? { opacity: 0, y: 16 } : false}
              animate={
                animateIn
                  ? { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4, ease: EASE_QUIET } }
                  : undefined
              }
            >
              {overline}
            </motion.div>
          )}
          <motion.div
            initial={animateIn ? { opacity: 0, y: 24 } : false}
            animate={
              animateIn
                ? { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.55, ease: EASE_QUIET } }
                : undefined
            }
          >
            {children}
          </motion.div>
        </div>
      </div>
      {scrollCue && (
        <motion.div
          aria-hidden
          className="absolute bottom-7 left-1/2 z-[1] hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex"
          initial={animateIn ? { opacity: 0 } : false}
          animate={animateIn ? { opacity: 1, transition: { duration: 0.8, delay: 1.3 } } : undefined}
        >
          <span className="text-[9.5px] uppercase tracking-[0.25em] text-ivory/50">Scroll</span>
          <span className="relative block h-11 w-px overflow-hidden bg-ivory/20">
            {!reduced && (
              <motion.span
                className="absolute inset-x-0 top-0 block h-3.5 bg-ivory/85"
                animate={{ y: ["-14px", "44px"] }}
                transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
              />
            )}
          </span>
        </motion.div>
      )}
      {direction && (
        <span
          aria-hidden
          className="absolute bottom-3 left-6 z-[1] text-[9.5px] uppercase tracking-[0.1em] text-ivory/35 md:left-12"
        >
          {direction}
        </span>
      )}
    </div>
  );
}
