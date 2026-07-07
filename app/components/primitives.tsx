import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router";
import { useRef } from "react";
import type { ReactNode } from "react";
import { fadeRise, stagger, viewportOnce } from "~/lib/motion";
import type { PlateKind } from "~/lib/content";

/* ——— Reveal: the default entrance. Animates once, never re-triggers. ——— */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeRise}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
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

/* ——— Eyebrow: gold tick + tracked label. Colour from parent (brass on ivory, gold on dark). ——— */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`type-eyebrow flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className="h-px w-[22px] bg-current opacity-90" />
      <span>{children}</span>
    </div>
  );
}

/* ——— Buttons: two species — solid and quiet. Gold fill exists once per page (Amelia). ——— */

const btnBase =
  "inline-block cursor-pointer text-[12.5px] font-semibold uppercase tracking-[0.1em] px-8 py-[15px] transition-colors duration-300 text-center";

type BtnKind = "solid" | "solid-ivory" | "gold" | "line" | "line-ink";

const btnKinds: Record<BtnKind, string> = {
  solid: "bg-ink text-ivory hover:bg-ink/85",
  "solid-ivory": "bg-ivory text-ink hover:bg-ivory/90",
  gold: "bg-gold text-ink hover:bg-dawn",
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
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const drift = parallax && !reduced;
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
        ) : (
          <img
            src={image}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
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
    <section id={id} className={`${tight ? "py-16" : "py-24 md:py-32"} ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">{children}</div>
    </section>
  );
}
