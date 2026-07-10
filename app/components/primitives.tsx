import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import { useRef } from "react";
import type { ReactNode } from "react";
import { fadeRise, revealVariants, stagger, viewportOnce } from "~/lib/motion";
import type { RevealVariant } from "~/lib/motion";
import type { PlateKind } from "~/lib/content";

/* ——— Reveal: the default entrance. Animates once, never re-triggers.
       `variant` selects the move (fade-up | fade | scale | mask). ——— */

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  exit = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  /** when true the content also gracefully fades out as it leaves the viewport */
  exit?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={exit ? { once: false, amount: 0.2 } : viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  exit = false,
}: {
  children: ReactNode;
  className?: string;
  exit?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={exit ? { once: false, amount: 0.2 } : viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeRise}>
      {children}
    </motion.div>
  );
}

/* ——— Seam: a soft gradient bridge between two grounds, so the eye is guided
       from one section to the next instead of meeting a hard colour edge. ——— */

const seamMap = {
  "ivory-ink": "from-ivory to-ink",
  "ink-ivory": "from-ink to-ivory",
  "ivory-navy": "from-ivory to-navy",
  "navy-ivory": "from-navy to-ivory",
  "ink-navy": "from-ink to-navy",
  "navy-ink": "from-navy to-ink",
} as const;

export function Seam({ variant }: { variant: keyof typeof seamMap }) {
  return <div aria-hidden className={`h-16 w-full bg-gradient-to-b ${seamMap[variant]} md:h-24`} />;
}

/* ——— Eyebrow: gold tick + tracked label. Colour from parent (brass on ivory, gold on dark). ——— */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`type-eyebrow flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className="h-px w-[22px] bg-current opacity-90" />
      <span>{children}</span>
    </div>
  );
}

/* ——— Buttons: the primary action is polished platinum (the one metallic moment
       per surface); everything else is flat blue/ink or a quiet line. Gold is
       never a fill — it survives only as small accents (ticks, rails, one seal). ——— */

const btnBase =
  "inline-block cursor-pointer text-[12.5px] font-semibold uppercase tracking-[0.1em] px-8 py-[15px] text-center transition-[background-color,border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-[2px] active:translate-y-0 motion-reduce:transform-none motion-reduce:hover:translate-y-0";

type BtnKind = "platinum" | "solid" | "solid-ivory" | "line" | "line-ink";

const btnKinds: Record<BtnKind, string> = {
  platinum: "btn-platinum",
  solid: "bg-ink text-ivory hover:bg-ink/85",
  "solid-ivory": "bg-ivory text-ink hover:bg-ivory/90",
  line: "border border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory/5",
  "line-ink": "border border-ink/35 text-ink hover:border-ink",
};

export function CTA({
  to,
  kind = "solid",
  children,
  onClick,
  external,
  className = "",
}: {
  to: string;
  kind?: BtnKind;
  children: ReactNode;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}) {
  const cls = `${btnBase} ${btnKinds[kind]} ${className}`;
  if (external) {
    return (
      <a href={to} className={cls} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Quiet link — hairline gold underline, arrow travels on hover. */
export function QuietLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 border-b border-gold pb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/* ——— Plate: photographic surface. Licensed photography drops in via the
       `image` frontmatter field; the CSS plate is the art-directed stand-in. ——— */

export function Plate({
  kind,
  image,
  alt = "",
  className = "",
  children,
  parallax = false,
  eager = false,
  srcSet,
  avifSrcSet,
  sizes,
}: {
  kind: PlateKind;
  image?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
  /** scroll-bound drift, ≤8% displacement — images only, always subtle */
  parallax?: boolean;
  /** above-the-fold (LCP) images load eagerly at high priority */
  eager?: boolean;
  srcSet?: string;
  /** modern-format source set (AVIF), offered before the JPEG fallback */
  avifSrcSet?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const drift = parallax && !reduced;
  // React 18 drops the camelCase `fetchPriority` prop with a warning, losing
  // the LCP hint — forward the lowercase DOM attribute instead.
  const priority: Record<string, string> = eager ? { fetchpriority: "high" } : {};
  return (
    <div ref={ref} className={`plate plate-${kind} ${className}`}>
      {image &&
        (drift ? (
          <motion.img
            src={image}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            style={{ y }}
            className="scale-[1.14]"
          />
        ) : avifSrcSet ? (
          <picture>
            <source type="image/avif" srcSet={avifSrcSet} sizes={sizes ?? "100vw"} />
            <img
              src={image}
              alt={alt}
              srcSet={srcSet}
              sizes={srcSet ? (sizes ?? "100vw") : undefined}
              loading={eager ? "eager" : "lazy"}
              {...priority}
              decoding="async"
            />
          </picture>
        ) : (
          <img
            src={image}
            alt={alt}
            srcSet={srcSet}
            sizes={srcSet ? (sizes ?? "100vw") : undefined}
            loading={eager ? "eager" : "lazy"}
            {...priority}
            decoding="async"
          />
        ))}
      {children}
    </div>
  );
}

/* ——— Ledger: the data grammar — hairline-ruled label/value cells. ——— */

export function Ledger({
  cells,
  dark = false,
  className = "",
}: {
  cells: Array<{ k: string; v: ReactNode }>;
  dark?: boolean;
  className?: string;
}) {
  const rule = dark ? "border-ivory/16" : "border-ink/14";
  const label = dark ? "text-silver" : "text-fog";
  return (
    <div className={`flex flex-wrap gap-x-7 gap-y-3 border-y py-3.5 ${rule} ${className}`}>
      {cells.map(({ k, v }) => (
        <div key={k} className="flex flex-col gap-0.5">
          <span className={`text-[10.5px] font-semibold uppercase tracking-[0.13em] ${label}`}>
            {k}
          </span>
          <span className="type-data">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ——— FullScreen: a viewport-filling panel for the marquee moments — one
       statement, centred, edge to edge. Content-dense sections keep `Section`.
       SSR-complete (no hidden initial state); reduced-motion safe by construction. ——— */

const panelTone = {
  ivory: "bg-ivory text-ink",
  ink: "bg-ink text-ivory",
  navy: "bg-navy text-ivory", // navy is Amelia's alone
} as const;

/** animated scroll cue — pure CSS (.hero-cue), no JS, so it never traps paint */
function PanelCue({ dark }: { dark: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center md:bottom-10">
      <span
        aria-hidden
        className={`hero-cue block h-9 w-px ${dark ? "bg-ivory/45" : "bg-ink/35"}`}
      />
    </div>
  );
}

export function FullScreen({
  children,
  className = "",
  tone = "ivory",
  align = "center",
  cue = false,
  id,
  bg,
  minH = "min-h-[100svh]",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof panelTone;
  /** center = vertically centred statement; start = top-aligned, clears the fixed header */
  align?: "center" | "start";
  cue?: boolean;
  id?: string;
  /** full-bleed background layer (e.g. a <Plate>) behind the content, dark tones only */
  bg?: ReactNode;
  /** min-height utility — override to make a panel less than full-viewport */
  minH?: string;
}) {
  const justify = align === "center" ? "justify-center" : "justify-start pt-32 md:pt-40";
  return (
    <section
      id={id}
      className={`relative flex ${minH} flex-col overflow-hidden ${justify} ${panelTone[tone]} ${className}`}
    >
      {bg && (
        <>
          <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full">{bg}</div>
          {/* legibility scrim: dark on the left (text) easing to reveal the photo,
              plus a soft floor so the scroll cue reads */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/55 to-ink/20"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent"
          />
        </>
      )}
      <div className="relative mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">{children}</div>
      {cue && <PanelCue dark={tone !== "ivory"} />}
    </section>
  );
}

/* ——— Section shell: standard vertical rhythm + horizontal margins. ——— */

export function Section({
  children,
  className = "",
  tight = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`${tight ? "py-8 md:py-12" : "py-12 md:py-18"} ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">{children}</div>
    </section>
  );
}
