/**
 * The Serene Bay strategic model, held in one place.
 *
 * Every claim below is traceable to the buyer value-chain strategy document
 * (`serene-bay-value-chain-strategy.md`): the four structural commitments (§3),
 * the nine-stage lifecycle (§4), the market comparison (§5), the "going direct"
 * rebuttal (§6) and the market research (§2). Pages compose from this module so
 * the positioning never drifts between surfaces.
 *
 * NOTE ON FIGURES: the only numbers on this site are published *market* figures
 * with their source attached. Serene Bay is a new house; it makes no claims
 * about its own transaction volume, returns or track record.
 */

/* ————————————————————————————————————————————————
   §2 — What is broken in the market today
———————————————————————————————————————————————— */

export interface Problem {
  k: string;
  title: string;
  copy: string;
}

export const PROBLEMS: Problem[] = [
  {
    k: "01",
    title: "Paid to close, not to advise",
    copy: "Every agent in this market is paid on commission, on splits of 40–70%. The incentive rewards speed over counsel, and it is openly discussed inside the industry that closing often comes down to whoever will hand back the largest slice of their own fee.",
  },
  {
    k: "02",
    title: "The handoff at reservation",
    copy: "Most agents add real value up to the introduction, then pass the buyer to the developer at precisely the moment independent support matters most. Developers say so themselves in their own marketing.",
  },
  {
    k: "03",
    title: "Nobody watching the build",
    copy: "Roughly 40–50% of Dubai off-plan projects run late, averaging about 8.5 months. An overseas buyer with no one monitoring progress usually learns a project has slipped when the developer decides to say so.",
  },
  {
    k: "04",
    title: "Alone after handover",
    copy: "Snagging, tenanting, mortgage, refinance, resale. This is where a buyer 4,000 kilometres away needs the most help and, under the commission model, receives the least.",
  },
];

/* ————————————————————————————————————————————————
   §3 — The four commitments the rest of the market cannot make
———————————————————————————————————————————————— */

export interface Commitment {
  k: string;
  title: string;
  claim: string;
  copy: string;
}

export const COMMITMENTS: Commitment[] = [
  {
    k: "01",
    title: "Salaried advisors",
    claim: "No commission-only advisors.",
    copy: "Our advisors are not paid per deal, so they have no financial reason to prefer one developer, one project or one unit over another. Their only incentive is to be right for you, in the same way a good independent adviser is not paid by any single fund manager.",
  },
  {
    k: "02",
    title: "Call on request only",
    claim: "We do not cold-call.",
    copy: "We answer when you want to talk, on your schedule. That is both the right way to treat a serious investor and a plain rejection of the pressure-selling culture that defines this market.",
  },
  {
    k: "03",
    title: "The relationship continues",
    claim: "We do not disappear at reservation.",
    copy: "What begins as narrowing down options carries on through construction monitoring, independent snagging, handover, tenanting, mortgage and refinance support, and — years later — the resale. Handover is the midpoint, not the end.",
  },
  {
    k: "04",
    title: "No kickbacks",
    claim: "Every introduction is yours to refuse.",
    copy: "Every specialist we introduce — surveyor, mortgage advisor, interior designer, letting agent — is an independent option you are free to use or ignore. Never a mandatory referral, never one we are paid to make.",
  },
];

/* ————————————————————————————————————————————————
   §4 — The end-to-end buyer lifecycle, nine stages
———————————————————————————————————————————————— */

export interface Stage {
  n: string;
  title: string;
  short: string;
  copy: string;
  /** the independent specialists introduced at this stage, if any */
  specialists?: string;
}

export const STAGES: Stage[] = [
  {
    n: "01",
    title: "Discovery and option narrowing",
    short: "Objective before inventory",
    copy: "Before any project is named: what the purchase is actually for — capital growth, rental yield, Golden Visa eligibility, lifestyle use, exit horizon — the true all-in budget including DLD fees, Oqood registration and service charges, and your real tolerance for developer tier and delivery timeline.",
  },
  {
    n: "02",
    title: "Project and developer due diligence",
    short: "You see the working, not just the shortlist",
    copy: "Escrow verification, DLD registration, construction status and developer delivery record. We show you the due diligence itself, so you understand why a project made the shortlist and why others did not.",
  },
  {
    n: "03",
    title: "Reservation and SPA support",
    short: "The contract, in plain language",
    copy: "The payment plan, the delay and cancellation clauses, the resale and assignment restrictions — explained before signature, not after. Where you want it, we introduce independent UAE-qualified counsel rather than relying on the developer's own legal team to explain a contract the developer wrote.",
    specialists: "Independent UAE-qualified legal counsel",
  },
  {
    n: "04",
    title: "Construction-phase monitoring",
    short: "Delay risk flagged, not disclosed late",
    copy: "We track actual progress against the DLD's public project tracker and our own developer relationships, and raise emerging delay risk with you rather than waiting for the developer to volunteer it. This is the stage a commission-only agent has already been paid to leave.",
  },
  {
    n: "05",
    title: "Handover and independent snagging",
    short: "Inspected by someone who didn't build it",
    copy: "An independent third-party snagging inspection ahead of final sign-off — specialist inspectors, not the developer's own handover team — and support through defect rectification before final payment or mortgage drawdown is released.",
    specialists: "Independent snagging and inspection firms",
  },
  {
    n: "06",
    title: "Fit-out and furnishing",
    short: "Rental-ready without managing contractors from abroad",
    copy: "For a unit being furnished for personal use or for letting, we introduce vetted interior design and turnkey furnishing specialists, so you are not coordinating trades across time zones.",
    specialists: "Interior design and turnkey furnishing specialists",
  },
  {
    n: "07",
    title: "Letting and tenant placement",
    short: "A tenant found, not a number handed over",
    copy: "We find and place a qualified tenant and, where you want it, hand over to a trusted property management partner for rent collection, maintenance coordination and lease renewal.",
    specialists: "Property management partners",
  },
  {
    n: "08",
    title: "Mortgage, refinance and portfolio",
    short: "Non-resident lending, navigated",
    copy: "Non-resident lending is materially different: typically 35–40% down payment and around 50% LTV for off-plan, with full income documentation. We introduce independent mortgage advisors experienced in exactly that, for the first purchase and for later refinancing, and help sequence further acquisitions against what you already hold.",
    specialists: "Independent non-resident mortgage advisors",
  },
  {
    n: "09",
    title: "Resale and exit",
    short: "The same relationship handles the exit",
    copy: "Whether an off-plan assignment before handover or a secondary sale after, we manage the process — Form F, the developer NOC, the Oqood transfer at a DLD trustee office — and find your next buyer. First enquiry to eventual exit, inside one relationship rather than scattered across strangers.",
  },
];

/* ————————————————————————————————————————————————
   §5 — Serene Bay against the two alternatives
———————————————————————————————————————————————— */

export interface ComparisonRow {
  dimension: string;
  broker: string;
  direct: string;
  serene: string;
}

export const COMPARISON: ComparisonRow[] = [
  {
    dimension: "How the advisor is paid",
    broker: "Commission only, typically a 40–70% split with the agency. A direct incentive to close fast.",
    direct: "The developer's own salaried sales team.",
    serene: "Salaried advisors. No deal-by-deal commission incentive.",
  },
  {
    dimension: "Projects you are shown",
    broker: "Often limited to the agency's best-commission relationships.",
    direct: "Only that developer's own projects.",
    serene: "Cross-developer, selected on suitability, with the due diligence disclosed.",
  },
  {
    dimension: "Outbound contact",
    broker: "Unsolicited calls are common industry-wide, and drive UAE do-not-call complaint volume.",
    direct: "Developer sales teams market proactively too.",
    serene: "Call on request only.",
  },
  {
    dimension: "Cost to you (off-plan)",
    broker: "No direct cost — the developer pays the commission.",
    direct: "Same headline price. You save nothing; the developer keeps the commission budget.",
    serene: "Same headline price. Serene Bay is paid by the developer, as any broker is.",
  },
  {
    dimension: "Independent snagging before handover",
    broker: "Rare, and not typically arranged by the agent.",
    direct: "Not independent — the developer inspects its own work.",
    serene: "Arranged as standard, before final sign-off.",
  },
  {
    dimension: "Support after handover",
    broker: "Minimal to none. The agent has moved to the next lead.",
    direct: "The developer's own customer service, focused on its own liability.",
    serene: "Letting, property management, mortgage and refinance, resale. Ongoing.",
  },
  {
    dimension: "Resale and exit",
    broker: "Usually means finding a new agent from scratch.",
    direct: "The developer has no interest in your exit; it would rather sell new inventory.",
    serene: "The same relationship handles the exit.",
  },
  {
    dimension: "Conflict of interest",
    broker: "Structural — paid to close, not to advise.",
    direct: "Structural — represents the seller only.",
    serene: "Designed out. No commission-driven bias, no dual-agency conflict.",
  },
];

/* ————————————————————————————————————————————————
   §2 — Market figures. Published, sourced, and never about us.
———————————————————————————————————————————————— */

export interface MarketFact {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  source: string;
  href: string;
  accent?: boolean;
}

export const MARKET_FACTS: MarketFact[] = [
  {
    to: 72,
    suffix: "%",
    label: "of Dubai residential sales were off-plan through 2025",
    source: "Economy Middle East",
    href: "https://economymiddleeast.com/news/dubai-real-estate-off-plan-sales-continue-to-lead-market-accounting-for-71-64-percent-of-transactions/",
  },
  {
    to: 39776,
    label: "licensed brokers competing for that business by January 2026",
    source: "Khaleej Times",
    href: "https://www.khaleejtimes.com/business/dubai-property-brokers-rake-in-dh1373-billion-in-2025",
    accent: true,
  },
  {
    to: 65,
    suffix: "%",
    label: "of transactions are non-resident, investment-driven purchases",
    source: "Veersant",
    href: "https://veersant.com/blog/dubai-property-buyers-by-nationality-2025/",
  },
  {
    to: 8.5,
    suffix: " mo",
    label: "average handover delay, on the 40–50% of projects that run late",
    source: "Real Estate Club Dubai",
    href: "https://realestateclubdubai.com/blog/buying-guide/off-plan-handover-delays-in-dubai-developer-track-records-what-buyers-can-do",
  },
];

/* ————————————————————————————————————————————————
   §2.5 — Where the overseas buyer comes from. Published shares of *foreign
   buyers* by nationality, not of all transactions.
———————————————————————————————————————————————— */

export const BUYER_ORIGINS = [
  { country: "India", share: "22%" },
  { country: "United Kingdom", share: "17%" },
  { country: "China", share: "14%" },
  { country: "Saudi Arabia", share: "11%" },
  { country: "Russia", share: "9%" },
] as const;

/* ————————————————————————————————————————————————
   §6 — The rebuttal, in short form for reuse on the homepage
———————————————————————————————————————————————— */

export const DIRECT_REBUTTAL = {
  question: "Why not just buy direct from the developer?",
  headline: "Going direct does not make the purchase cheaper. It makes it lonelier.",
  body: "On an off-plan purchase in Dubai, the developer pays the broker's commission out of its own project economics — not you. Skip the broker and the headline price does not move; the developer simply keeps money it would otherwise have paid an agent. What you give up is representation in a negotiation against a professional seller, a second opinion on projects a developer will never mention, and everything after the signature that the developer's after-sales team is not incentivised to do.",
  note: "For off-plan and primary sales in Dubai, commission is budgeted into the developer's own project economics. It is only in the secondary market that the buyer typically pays the agent's fee.",
} as const;
