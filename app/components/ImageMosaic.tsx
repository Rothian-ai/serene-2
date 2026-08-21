import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Plate } from "~/components/primitives";
import type { PlateKind } from "~/lib/content";

/**
 * An editorial image band: three frames on a staggered baseline, each drifting
 * at a different rate as the band passes. The differential speed is what makes
 * it read as depth rather than decoration — the outer frames travel further
 * than the centre one, so the group separates slightly and re-settles.
 *
 * Each frame also wipes in from its own bottom edge (clip-path inset) with the
 * photograph settling from a small overscale inside the mask, which is the
 * house image-reveal already used by `Hero`.
 *
 * Under prefers-reduced-motion the drift and the wipe both drop out and the
 * three frames simply sit there — the layout is doing the work, not the motion.
 */

export interface MosaicFrame {
  image: string;
  alt: string;
  kind: PlateKind;
  caption?: string;
  /** aspect + vertical offset, so the three do not sit on one baseline */
  className: string;
  /** drift distance in percent across the band's travel — outer frames move more */
  drift: number;
}

function Frame({ frame, index }: { frame: MosaicFrame; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${frame.drift}%`, `${-frame.drift}%`]);

  return (
    <motion.div
      ref={ref}
      className={frame.className}
      style={reduced ? undefined : { y }}
      initial={reduced ? undefined : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduced ? undefined : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay: index * 0.12, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className="group relative h-full w-full overflow-hidden">
        <Plate
          kind={frame.kind}
          image={frame.image}
          alt={frame.alt}
          className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      {frame.caption && <p className="type-cap mt-3 text-fog">{frame.caption}</p>}
    </motion.div>
  );
}

export function ImageMosaic({ frames }: { frames: MosaicFrame[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-12 md:gap-7">
      {frames.map((f, i) => (
        <Frame key={f.image} frame={f} index={i} />
      ))}
    </div>
  );
}
