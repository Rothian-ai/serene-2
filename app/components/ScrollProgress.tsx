import { useRef } from "react";
import { gsap, ScrollTrigger, useGsapContext } from "~/lib/gsap";

/**
 * A hairline platinum reading-progress bar pinned to the top of the viewport,
 * scrubbed by whole-document scroll. Client-only enhancement; absent under
 * reduced motion (the bar simply never mounts its animation, staying at 0).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGsapContext(barRef, () => {
    const bar = barRef.current!;
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
    });
    return () => st.kill();
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[2px]"
    >
      <div ref={barRef} className="h-full w-full" style={{ background: "var(--metal-platinum)" }} />
    </div>
  );
}
