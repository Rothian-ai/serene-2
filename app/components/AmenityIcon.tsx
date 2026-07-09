import type { ReactNode } from "react";

/**
 * Amenity icons — a small inline-SVG set, no dependency. Stroke-based, 1px,
 * square terminals (honours the radius-0 aesthetic), colour inherited via
 * `currentColor`. Each glyph is 1–3 primitives — restraint over detail.
 * Keyed by the icon token authored in frontmatter (`pool · Rooftop Pool`);
 * unknown keys fall back to a hairline mark so the grid never breaks.
 */

const glyphs: Record<string, ReactNode> = {
  gym: (
    <>
      <path d="M2 9v6M5 7v10M19 7v10M22 9v6" />
      <path d="M5 12h14" />
    </>
  ),
  pool: (
    <>
      <path d="M3 15c1.5 0 1.5 1.2 3 1.2S9 15 10.5 15 12 16.2 13.5 16.2 15 15 16.5 15 18 16.2 19.5 16.2 21 15 21 15" />
      <path d="M3 19c1.5 0 1.5 1.2 3 1.2S9 19 10.5 19 12 20.2 13.5 20.2 15 19 16.5 19 18 20.2 19.5 20.2 21 19 21 19" />
      <path d="M8 15V5h4a2 2 0 0 1 2 2M8 9h6" />
    </>
  ),
  cycling: (
    <>
      <circle cx="6" cy="16" r="4" />
      <circle cx="18" cy="16" r="4" />
      <path d="M6 16l4-8h5M9 8h4l4 8M13 8l-2 8" />
    </>
  ),
  pavilion: (
    <>
      <path d="M3 9l9-5 9 5" />
      <path d="M5 9v11h14V9" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  courts: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 12h18M12 4v16" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6M7 20l5-7 5 7M8 10h8" />
    </>
  ),
  spa: (
    <>
      <path d="M12 21c0-5 3-8 3-8s-6-1-6 4M12 21c0-5-3-8-3-8s6-1 6 4" />
      <path d="M12 13c0-4 3-9 0-11-3 2 0 7 0 11" />
    </>
  ),
  retail: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  park: (
    <>
      <path d="M12 3l6 9h-4v8h-4v-8H6l6-9z" />
    </>
  ),
  concierge: (
    <>
      <path d="M4 18h16M12 18V8M6 18a6 6 0 0 1 12 0" />
      <path d="M10 8a2 2 0 0 1 4 0" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  beach: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M12 2v1.5M12 12.5V14M18 8h-1.5M7.5 8H6M16.2 4.2l-1 1M8.8 11.2l-1 1M16.2 11.8l-1-1M8.8 4.8l-1-1" />
      <path d="M3 18c1.5 0 1.5 1.2 3 1.2S9 18 10.5 18 12 19.2 13.5 19.2 15 18 16.5 18 18 19.2 19.5 19.2 21 18 21 18" />
    </>
  ),
  amenity: (
    <>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
};

export function AmenityIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  const glyph = glyphs[name] ?? glyphs.amenity;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}
