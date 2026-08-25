import { useNavigation } from "react-router";

/**
 * A hairline bar across the top while a navigation is in flight.
 *
 * The listing pages read from an upstream catalogue that can take several
 * seconds on a cold cache, and React Router holds the current page until the
 * loader resolves. Without this the site looks frozen and people click again;
 * with it the wait is legible. Purely presentational — no layout shift, and it
 * unmounts the moment navigation settles.
 */
export function RouteProgress() {
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[66] h-[2px] transition-opacity duration-200 ${
        busy ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full w-full origin-left"
        style={{
          background: "var(--metal-platinum)",
          animation: busy ? "route-progress 1.6s ease-out infinite" : "none",
        }}
      />
    </div>
  );
}
