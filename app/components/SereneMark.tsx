import { forwardRef, useId } from "react";

/**
 * The Serene mark — four towers, the open frame, the breaking spire.
 *
 * A faithful re-trace of the supplied artwork (`public/logo/serene-mark.png`),
 * vectorised from its alpha silhouette at 4x so every edge is exact; the same
 * geometry as the mark on the printed card. The MARK ALONE — the wordmark is
 * not part of it (sanctioned lockup 2), so it never doubles a "Serene" set in
 * type beside or beneath it.
 *
 * Finish is the metallic silver the brand requires (never gold), built from the
 * Platinum ramp with the polished-metal recipe in the Brand Guidelines (S4):
 * a 135° highlight -> mid -> shadow -> re-highlight diagonal.
 *
 *   tone="platinum"  dark grounds (navy, ink, photography) — the bright foil
 *   tone="graphite"  light grounds (pearl) — the same metal, darker ramp so it
 *                    holds contrast instead of dissolving into the surface
 *   tone="white"     flat ivory, for the smallest sizes where a gradient reads
 *                    as noise
 *   tone="current"   inherits `currentColor`
 *
 * The viewBox carries 6 units of padding around the artwork. The paths run
 * edge to edge of their own bounding box (measured: zero margin on all four
 * sides) and an SVG clips at its viewport, so without the padding the open
 * frame's outer verticals sit exactly on the clip boundary and get shaved by
 * antialiasing. At header size one unit is under a fifth of a pixel, so the
 * right-hand tower simply looks cut off. This is the same fix already carried
 * on the alpha branch.
 *
 * Aspect is locked by the viewBox; set a height and let the width follow, so
 * the tower ratio can never stretch.
 */

const PLATINUM: Array<[string, string]> = [
  ["0", "#ffffff"],
  [".22", "#edf0f3"],
  [".46", "#cbcfd6"],
  [".68", "#aeb4bd"],
  [".86", "#979da6"],
  ["1", "#c6cbd1"],
];

// the same metal, stepped down the ramp: reads on Pearl without going flat
// Steel (#8A9099) as the top stop measures 2.74:1 on Pearl — under the 3:1 WCAG
// floor for graphical objects — so the ramp starts a hair deeper (3.08:1), the
// same in-family deepening already applied to the brass/fog text tokens.
const GRAPHITE: Array<[string, string]> = [
  ["0", "#868c95"],
  [".22", "#767c85"],
  [".46", "#5e646c"],
  [".68", "#4b5058"],
  [".86", "#3a3f46"],
  ["1", "#666c75"],
];

export type MarkTone = "platinum" | "graphite" | "white" | "current";

export const SereneMark = forwardRef<
  SVGSVGElement,
  {
    tone?: MarkTone;
    className?: string;
    /** give it a title only when the mark is the sole naming of the brand */
    title?: string;
  }
>(function SereneMark({ tone = "platinum", className = "", title }, ref) {
  const raw = useId();
  const id = `sm${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const stops = tone === "graphite" ? GRAPHITE : PLATINUM;
  const metallic = tone === "platinum" || tone === "graphite";
  const fill = metallic ? `url(#${id})` : tone === "white" ? "#f3f4f7" : "currentColor";

  return (
    <svg
      ref={ref}
      viewBox="-6 -6 170.12 216.12"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {metallic && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {stops.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <g fill={fill}>
      <path d="M88.5 0L89 0L89.88 2L89.88 5.75L90.75 8L94 12L94.25 14L94.62 42.25L94.62 43.75L96.75 45.75L102.5 49.25L104 50.75L104.88 52.25L104.88 75.25L106 76.75L106 77.5L107.5 79L108 79L108.75 80.12L109.75 80.12L112.75 82.75L113.75 85.5L113.75 201.25L112.25 204L110.25 204.12L83.75 203.94L81.5 203.94L80 201.75L80 37.5L81.5 35L83 35L84 33.75L84.75 32L85 12.25L85 9.5L86.75 7.75L87.75 5.5Z" />
      <path d="M4 34L43.25 33.88L45.25 33.88L46.75 35.5L46 37L43.75 37.75L7 37.75L5.25 38.5L4 40.25L4 198.25L5.25 200L6.75 200.88L14.25 200.69L17.75 200.69L19 199.5L20.12 197.75L20.12 119L21 117L24.75 112.75L33.25 104.38L35 104.38L36 105.75L36 201.75L34.5 204L32.5 204.12L3.5 203.94L1.25 203.94L0 202L0 36.25L1.5 34Z" />
      <path d="M115.25 33.88L154.25 34L156.75 34L158.12 35.5L158.06 37L158.06 202.5L156.75 204L154.75 204.12L126.75 203.94L124.5 203.94L123.12 202.25L123.19 77.5L123.19 76.75L124.25 76L126.25 77L133.75 86.25L138 91.25L139.88 95.25L139.88 198L141.75 200.25L145.25 200.88L151.5 200.88L154 198.5L154 40.25L152.5 38L151.25 37.88L115 37.88L112.25 37L112.25 35.25L113.25 33.88Z" />
      <path d="M69.25 45.75L71 46.5L71.12 48L71.06 200.75L71.06 202.25L69.75 204L67.5 204.12L48 203.94L46 203.94L44.75 202.75L44.62 201.25L44.62 71.25L46 67.5L53.5 60.25L61.25 52.75L61.75 52.75L61.75 52.12L62.5 52.12L67.25 47Z" />
      </g>
    </svg>
  );
});
