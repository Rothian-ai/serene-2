import type { SVGProps } from "react";

/**
 * Amelia's mark, in one colour.
 *
 * The published lockup (amelia.serenebay.ae/amelia-logo.svg) is a 1065x270
 * horizontal wordmark that draws the mark by clipping a rainbow bitmap into a
 * silhouette. The silhouette itself is vector, and it is the whole mark: the
 * lowercase "a" disc with the face carried as negative space inside it. Taking
 * that path and filling it flat gives a true single-colour Amelia mark at any
 * size, with no bitmap and no gradient.
 *
 * Which is what lets it sit on this site at all. Amelia's own colourway is a
 * full-spectrum gradient, and pinned to the corner of every page it would have
 * been the most saturated thing on a palette that keeps gold to a single seal.
 * One colour, inherited through `currentColor`, puts the mark inside Serene's
 * scheme rather than beside it.
 *
 * Worth confirming with Amelia that a monochrome treatment is sanctioned. Most
 * brands ship exactly this variant for the case, but it is their mark and their
 * call, and the gradient is one fill away if they would rather have it.
 *
 * The path is square (189.18 x 189.18, measured), so the viewBox crops tight to
 * it and it centres on its own in whatever box it is given.
 */
export function AmeliaMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 70.82 189.18 189.18"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M148.64,70.82V87.5q-23.43-16.68-54-16.68-39.28,0-66.94,27.65T0,165.41q0,39.27,27.65,66.93T94.59,260q39.27,0,66.93-27.66t27.66-66.93V70.82Zm-54,155.54C72.68,226.36,48,199.07,48,167.48c-3.88,4.87-5.32,12.46-4.06,21.05C43.59,188,40.4,181,40.4,170c0-8.93,6.79-16.69,14.75-21.42,7.8-4.63,19.78-8.93,29.52-24.5-1,14.69-26.23,32.2-26.23,32.2,14,0,40.77-17.59,40.85-35.1,2.29-.22,4.57-.34,6.82-.34,27.44,0,34.9,16.59,34.9,49.25,0,21.35-19.2,31.85-30.94,35.79a.92.92,0,0,1-.74-.09,3.31,3.31,0,0,0-2.46-.3L101.39,207a3.43,3.43,0,0,0-2.57,3.44,3.37,3.37,0,0,0,4.23,3.07l5.58-1.52a3.33,3.33,0,0,0,2.1-1.73.93.93,0,0,1,.53-.48c7.53-2.56,17.4-7.26,24.65-15.61C131.79,203.94,115,226.36,94.59,226.36Zm20.21-41.31a.45.45,0,0,0-.77-.4c-1.9,1.88-7,5.24-19.56,5.24s-17.57-2.44-19.36-3.79a.45.45,0,0,0-.72.45C75.1,189.82,78.5,198,94.6,198,110.53,198,114,188.86,114.8,185.05Z" />
    </svg>
  );
}
