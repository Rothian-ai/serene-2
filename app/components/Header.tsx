import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { SereneMark } from "~/components/SereneMark";

/**
 * Alpha (coming-soon) header: the mark and a single inert "Coming Soon" chip.
 * No navigation — there are no other pages yet. Transparent over the dark hero,
 * resolving to a solid ivory bar once scrolled; hides on scroll-down.
 */
export function Header({ tone }: { tone: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const delta = y - lastY.current;
      if (Math.abs(delta) < 10) return;
      setHidden(y > 200 && delta > 0);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overDark = tone === "dark" && !scrolled;
  const bar = overDark
    ? "bg-transparent"
    : "bg-ivory/95 backdrop-blur-[2px] border-b border-ink/12";
  const text = overDark ? "text-ivory" : "text-ink";
  const chip = overDark ? "border-silver/70 text-silver" : "border-fog/60 text-fog";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color] duration-500 ${bar} ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className={`container-site flex items-center gap-8 py-4 ${text}`}>
        <Link to="/" className="flex items-center gap-3" aria-label="Serene — home">
          <SereneMark tone={overDark ? "platinum" : "graphite"} className="h-9 w-auto" />
          <span className="text-[15px] font-medium uppercase tracking-[0.2em]">Serene</span>
        </Link>
        <span
          className={`ml-auto border px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] ${chip}`}
        >
          Coming Soon
        </span>
      </div>
    </header>
  );
}
