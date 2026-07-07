import { Link } from "react-router";
import { SITE } from "~/lib/site";

const COLS = [
  {
    title: "Explore",
    links: [
      { to: "/developments", label: "Developments" },
      { to: "/developers", label: "Developers" },
      { to: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Engage",
    links: [
      { to: "/amelia", label: "Amelia" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

/** The trust ledger — RERA licensing appears on every route, stated as fact. */
export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-20 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <img src="/logo/serene-mark-white.png" alt="Serene" className="h-14 w-auto" />
            <p className="type-cap mt-4 text-silver">{SITE.tagline}</p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-silver">
                {col.title}
              </div>
              {col.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block py-1 text-[14px] text-ivory/72 transition-colors hover:text-ivory"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="mt-11 flex flex-wrap gap-x-6 gap-y-2 border-t border-ivory/16 pt-4 text-[12px] font-semibold tracking-[0.04em] text-silver">
          <span>{SITE.legalName}</span>
          <span>{SITE.rera}</span>
          <span>Dubai, UAE</span>
          <span className="md:ml-auto">
            <Link to="/privacy" className="hover:text-ivory">Privacy</Link>
            {" · "}
            <Link to="/cookies" className="hover:text-ivory">Cookies</Link>
            {" · "}
            <Link to="/terms" className="hover:text-ivory">Terms</Link>
          </span>
          <span>© 2026 Serene</span>
        </div>
      </div>
    </footer>
  );
}
