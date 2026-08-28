/**
 * A developer's lockup, rendered through a CSS mask.
 *
 * The logos arrive as mixed sources — SVG, PNG and WebP — in whatever
 * colours their owners use. Painting them as images would put a dozen different
 * palettes on one page. Masking instead means the artwork supplies only the
 * shape and the page supplies the colour, so the register reads as one ink-toned
 * set and can take the brass on hover like any other mark on the site.
 *
 * A developer with no logo on file falls back to the name in the house light
 * weight, which is why `BRAND_LOGOS` can stay a partial map.
 */
const BRAND_LOGOS: Record<string, { src: string; w: string }> = {
  emaar: { src: "/images/brands/dev-emaar.svg", w: "w-[120px] md:w-[150px]" },
  aldar: { src: "/images/brands/dev-aldar.png", w: "w-[58px] md:w-[70px]" },
  "sobha-realty": { src: "/images/brands/dev-sobha.svg", w: "w-[112px] md:w-[140px]" },
  nakheel: { src: "/images/brands/dev-nakheel.svg", w: "w-[120px] md:w-[150px]" },
  meraas: { src: "/images/brands/dev-meraas.svg", w: "w-[112px] md:w-[140px]" },
  binghatti: { src: "/images/brands/dev-binghatti.svg", w: "w-[108px] md:w-[135px]" },
  arada: { src: "/images/brands/dev-arada.svg", w: "w-[108px] md:w-[135px]" },
  "ahs-properties": { src: "/images/brands/dev-ahs-properties.png", w: "w-[69px] md:w-[85px]" },
  "al-zorah": { src: "/images/brands/dev-al-zorah.png", w: "w-[120px] md:w-[150px]" },
  "bnw-developments": { src: "/images/brands/dev-bnw-developments.webp", w: "w-[58px] md:w-[70px]" },
  "bt-properties": { src: "/images/brands/dev-bt-properties.webp", w: "w-[120px] md:w-[150px]" },
  "grovy-developments": { src: "/images/brands/dev-grovy-developments.svg", w: "w-[58px] md:w-[70px]" },
  "hre": { src: "/images/brands/dev-hre.png", w: "w-[72px] md:w-[88px]" },
  "object-1": { src: "/images/brands/dev-object-1.svg", w: "w-[120px] md:w-[150px]" },
  "omniyat": { src: "/images/brands/dev-omniyat.svg", w: "w-[120px] md:w-[150px]" },
  "pantheon": { src: "/images/brands/dev-pantheon.png", w: "w-[120px] md:w-[150px]" },
  "rak-properties": { src: "/images/brands/dev-rak-properties.svg", w: "w-[120px] md:w-[150px]" },
  "reef-luxury-developments": { src: "/images/brands/dev-reef-luxury-developments.svg", w: "w-[94px] md:w-[115px]" },
  "sol-properties": { src: "/images/brands/dev-sol-properties.webp", w: "w-[76px] md:w-[93px]" },
};

/** The mask paints the mark, so the ground decides which fill it takes. */
const TONES = {
  ink: { mark: "bg-ink/80 group-hover:bg-brass", text: "text-ink/80" },
  ivory: { mark: "bg-ivory/75 group-hover:bg-ivory", text: "text-ivory/80" },
} as const;

/**
 * Whether a slug has real artwork on file. Callers that print the name as a
 * caption need this: without a logo the mark IS the name, so rendering both
 * gives "AHS PropertiesAHS Properties".
 */
export const hasBrandLogo = (slug: string) => Boolean(BRAND_LOGOS[slug]);

export function BrandMark({
  slug,
  name,
  tone = "ink",
  compact = false,
  className = "",
}: {
  slug: string;
  name: string;
  /** "ink" on light grounds, "ivory" on the dark band */
  tone?: keyof typeof TONES;
  /** grid cells: cap the mark's height so a wordmark and a logo agree */
  compact?: boolean;
  className?: string;
}) {
  const logo = BRAND_LOGOS[slug];
  const t = TONES[tone];
  /* Most of the register has no logo file yet, so the fallback is the common
     case rather than the exception and has to hold its own beside real artwork.
     In a grid it is set to the mark's own height and left-aligned with it, so a
     row mixing the two reads as one row. */
  if (!logo) {
    return (
      <span
        className={
          compact
            ? `font-light leading-none text-[1.05rem] tracking-[0.01em] sm:text-[1.15rem] ${t.text}`
            : `font-light leading-none text-[clamp(1.4rem,2.6vw,2rem)] ${t.text}`
        }
      >
        {name}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={`block ${compact ? "h-8 md:h-9" : "h-9 md:h-11"} ${logo.w} ${t.mark} transition-colors duration-300 ${className}`}
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
