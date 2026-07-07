import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Plate } from "~/components/primitives";
import type { PlateKind } from "~/lib/content";
import { EASE_INOUT, EASE_QUIET, isHydrated } from "~/lib/motion";

/**
 * Cinematic hero — one of the four sanctioned cinematic moments.
 * Mask reveal + scale-settle on the surface; fade-rise on the type.
 * `video` (optional) plays muted/looped over the plate when provided.
 */
export function Hero({
  plate,
  image,
  video,
  children,
  height = "min-h-[88svh]",
  direction,
}: {
  plate: PlateKind;
  image?: string;
  video?: string;
  children: ReactNode;
  height?: string;
  direction?: string;
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
        initial={animateIn ? { clipPath: "inset(100% 0 0 0)", scale: 1.06 } : false}
        animate={
          animateIn
            ? {
                clipPath: "inset(0% 0 0 0)",
                scale: 1,
                transition: {
                  clipPath: { duration: 1.1, ease: EASE_INOUT },
                  scale: { duration: 1.3, ease: EASE_QUIET },
                },
              }
            : undefined
        }
      >
        <Plate kind={plate} image={image} eager className="h-full w-full">
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
        {/* legibility scrim — from edges, never a flat wall */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.68) 0%, rgba(11,10,8,0.28) 42%, rgba(11,10,8,0.05) 65%, transparent 80%)",
          }}
        />
      </motion.div>
      <div className="relative z-[1] w-full">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-40 md:px-12 lg:px-20">
          <motion.div
            initial={animateIn ? { opacity: 0, y: 24 } : false}
            animate={
              animateIn
                ? { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: EASE_QUIET } }
                : undefined
            }
          >
            {children}
          </motion.div>
        </div>
      </div>
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
