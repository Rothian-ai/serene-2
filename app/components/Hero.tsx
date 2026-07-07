import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plate } from "~/components/primitives";
import type { PlateKind } from "~/lib/content";
import { EASE_INOUT, EASE_QUIET } from "~/lib/motion";

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
  return (
    <div className={`relative flex ${height} items-end overflow-hidden bg-ink text-ivory`}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)", scale: 1.06 }}
        animate={
          reduced
            ? { opacity: 1, transition: { duration: 0.3 } }
            : {
                clipPath: "inset(0% 0 0 0)",
                scale: 1,
                transition: {
                  clipPath: { duration: 1.1, ease: EASE_INOUT },
                  scale: { duration: 1.3, ease: EASE_QUIET },
                },
              }
        }
      >
        <Plate kind={plate} image={image} className="h-full w-full">
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
              "linear-gradient(to top, rgba(11,10,8,0.55) 0%, rgba(11,10,8,0.15) 38%, transparent 60%)",
          }}
        />
      </motion.div>
      <div className="relative z-[1] w-full">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-40 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: reduced ? 0 : 0.5, ease: EASE_QUIET },
            }}
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
