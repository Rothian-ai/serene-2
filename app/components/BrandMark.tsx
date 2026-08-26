/**
 * A developer's lockup, rendered through a CSS mask.
 *
 * The seven logos arrive as mixed sources: six SVGs and one PNG, in whatever
 * colours their owners use. Painting them as images would put seven different
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
};

export function BrandMark({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const logo = BRAND_LOGOS[slug];
  if (!logo) {
    return (
      <span className="font-light leading-none text-[clamp(1.4rem,2.6vw,2rem)] text-ink/80">
        {name}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={`block h-9 md:h-11 ${logo.w} bg-ink/80 transition-colors duration-300 group-hover:bg-brass ${className}`}
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
