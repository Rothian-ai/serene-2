/**
 * The Serene Bay strategic model, held in one place.
 *
 * Every string below is taken from the approved "Serene Bay Pages" document,
 * word for word. That document is the copy of record: where it and an earlier
 * draft disagreed, it wins, and where it is shorter, the site gets shorter.
 * Pages compose from this module so the positioning never drifts between
 * surfaces.
 *
 * Two deliberate departures from the source, both house style:
 *   · em dashes are rewritten as commas, colons or full stops (the words are
 *     unchanged); en dashes stay in numeric ranges, as they always have
 *   · the stages keep the document's own tab label, because the rail and the
 *     pinned stage strip need something short to print
 *
 * NOTE ON FIGURES: the only numbers on this site are published *market* figures
 * with their source attached. Serene Bay is a new house; it makes no claims
 * about its own transaction volume, returns or track record.
 */

/* ————————————————————————————————————————————————
   The market we are answering
———————————————————————————————————————————————— */

/** The narrative that explains the model, rather than asserting it. */
export const MARKET_CASE = {
  eyebrow: "Why the market works this way",
  headline: "Every agent in Dubai is paid on commission. That is the whole problem.",
  body: [
    "Nearly 40,000 licensed brokers now compete for the same buyers, on splits of 40–70% and nothing else. Average tenure has fallen to six months or less. The newest agents, the ones most likely to be calling you, churn out inside ninety days.",
    "A brokerage CEO writing in Gulf News describes the result plainly: deals go to whoever is willing to hand back the biggest slice of their own commission. That is not advice. It is an auction on the advisor's survival.",
  ],
  pull: "Serene's advisors cannot take a haircut on a commission they were never paid.",
  close:
    "Removing the incentive is the only reliable way to remove the behaviour. Ethics campaigns have been tried; the structure won.",
} as const;

export interface MarketFact {
  /** printed verbatim — several of these are ranges, which cannot be counted to */
  display: string;
  label: string;
  source: string;
  href: string;
  accent?: boolean;
}

export const MARKET_FACTS: MarketFact[] = [
  {
    display: "69–72%",
    label: "of Dubai residential sales are off-plan",
    source: "Economy Middle East",
    href: "https://economymiddleeast.com/news/dubai-real-estate-off-plan-sales-continue-to-lead-market-accounting-for-71-64-percent-of-transactions/",
  },
  {
    display: "39,776",
    label: "licensed brokers, up from 5,933 a decade ago",
    source: "Khaleej Times",
    href: "https://www.khaleejtimes.com/business/dubai-property-brokers-rake-in-dh1373-billion-in-2025",
    accent: true,
  },
  {
    display: "6 mo",
    label: "average agent tenure, down from twelve",
    source: "The National",
    href: "https://www.thenationalnews.com/business/property/2025/10/13/dubai-real-estate-agents-pay/",
  },
  {
    display: "60–65%",
    label: "of transactions are non-resident investment buys",
    source: "Veersant",
    href: "https://veersant.com/blog/dubai-property-buyers-by-nationality-2025/",
  },
];

export const MARKET_SOURCES =
  "Sources: Dubai Land Department; Khaleej Times (broker commission and licensing data, 2025–26); Economy Middle East (off-plan share of transactions); Veersant (buyer nationality mix).";

/* ————————————————————————————————————————————————
   Four commitments
———————————————————————————————————————————————— */

export interface Commitment {
  k: string;
  claim: string;
  copy: string;
}

export const COMMITMENTS_INTRO = {
  eyebrow: "Four commitments",
  headline: "Not a faster broker. A differently built one.",
  body: "Each of these is a structural fact about how Serene is set up, not a promise about how hard we try.",
} as const;

export const COMMITMENTS: Commitment[] = [
  {
    k: "01",
    claim: "Our advisors are not paid on commission.",
    copy: "No financial reason to prefer one developer, one project or one unit over another, the same way a good independent financial adviser is not paid by any single fund manager.",
  },
  {
    k: "02",
    claim: "We do not cold-call.",
    copy: "We respond when you want to talk, on your schedule. That is how a serious investor should be treated, and it is a direct rejection of the pressure-selling culture that defines the market.",
  },
  {
    k: "03",
    claim: "We do not disappear at reservation.",
    copy: "The relationship continues through construction monitoring, independent snagging, handover, tenanting, mortgage and refinance, and years later, resale.",
  },
  {
    k: "04",
    claim: "We tell you the truth about going direct.",
    copy: "It does not save you money on an off-plan purchase. The developer pays commission out of its own budget either way. Going direct only removes the one party representing you.",
  },
];

/* ————————————————————————————————————————————————
   The buyer value chain, nine stages
———————————————————————————————————————————————— */

export interface Stage {
  n: string;
  /** the tab label */
  label: string;
  title: string;
  copy: string;
  /** what the rest of the market does at this stage instead */
  contrast: string;
  /** the independent specialists introduced here, never on a referral fee */
  partners: string[];
  /** the photograph the pinned stage column crossfades to (StickyStages) */
  image: string;
  alt: string;
}

export const CHAIN_INTRO = {
  eyebrow: "The buyer value chain",
  headline: "Nine stages. The last one is years after the signature.",
  body: "A commission-only agent is paid at stage three and gone by stage four. Select any stage to see what we do, and which independent specialists we introduce you to, never on a referral fee.",
  note: "Every introduction is optional and fee-free to us. No referral commission, at any stage.",
} as const;

export const STAGES: Stage[] = [
  {
    n: "01",
    label: "Discovery",
    title: "Discovery and option narrowing",
    copy: "Before any project is named we establish your actual objective: capital growth, yield, Golden Visa eligibility, lifestyle use, exit horizon. Your true all-in budget including DLD fees, Oqood registration and service charges, and your tolerance for developer tier and delivery risk. Because our advisors are salaried, the shortlist can include projects that pay us less than a competing one.",
    contrast:
      "A commission-only agent has a direct financial reason not to shortlist the project that pays them least. That reason does not exist here.",
    partners: [
      "Independent mortgage advisor, if serviceability shapes the budget",
      "Tax counsel in your home jurisdiction, where residency matters",
    ],
    image: "/images/about-ask.jpg",
    alt: "A quiet lounge in warm evening light",
  },
  {
    n: "02",
    label: "Due diligence",
    title: "Project and developer due diligence",
    copy: "Every project we put in front of you has already been through escrow verification, DLD registration checks, construction-status tracking and a review of the developer's delivery track record. You are shown the due diligence itself, not just the shortlist it produced, so you can see why a project made the cut.",
    contrast:
      "Most buyers are shown a brochure and a payment plan. The delay history of the developer who built it is rarely part of the conversation.",
    partners: [
      "Escrow account verification via DLD public records",
      "Third-party construction progress data",
    ],
    image: "/images/about-understand.jpg",
    alt: "An architectural section drawing, read in full",
  },
  {
    n: "03",
    label: "SPA support",
    title: "Reservation and SPA support",
    copy: "We walk you through the payment plan, the SPA's delay and cancellation clauses, and any resale or assignment restrictions, in plain language, before signature. Where you want it, we connect you with independent UAE-qualified counsel to review the SPA, rather than relying on the developer's own legal team to explain a contract the developer wrote.",
    contrast:
      "This is where a commission-only agent gets paid. It is also, for most of the market, where the relationship quietly ends.",
    partners: ["Independent UAE-qualified property counsel for SPA review"],
    image: "/images/mamsha-gardens-04.jpg",
    alt: "A colonnade wall, read in close detail",
  },
  {
    n: "04",
    label: "Construction",
    title: "Construction-phase monitoring",
    copy: "We track actual progress against the DLD project tracker and our own developer relationships, and flag emerging delay risk to you proactively. Roughly 40–50% of Dubai off-plan projects slip, averaging around 8.5 months; tier-3 developer delays regularly run 10–18 months.",
    contrast:
      "An overseas buyer with nobody monitoring construction typically learns a project has slipped when the developer decides to tell them.",
    partners: ["Independent construction progress surveyors, where a site visit is warranted"],
    image: "/images/bugatti-residences-04.jpg",
    alt: "A concrete structure part-way through construction",
  },
  {
    n: "05",
    label: "Snagging",
    title: "Handover and independent snagging",
    copy: "We coordinate an independent, third-party snagging inspection ahead of final sign-off, using specialist inspection firms, not the developer's own handover team, and support you through defect rectification before final payment or mortgage drawdown is released.",
    contrast:
      "The developer that built the unit is not a credible party to inspect its own work. Independent snagging is a whole industry in Dubai for exactly that reason.",
    partners: [
      "Licensed independent snagging and inspection firms",
      "MEP specialists where systems testing is needed",
    ],
    image: "/images/armani-beach-residences-05.jpg",
    alt: "A finished bathroom, the kind of surface an inspection covers",
  },
  {
    n: "06",
    label: "Fit-out",
    title: "Fit-out and furnishing",
    copy: "Whether the unit is for your own use or going straight to rental, we introduce vetted interior design and turnkey furnishing specialists who can deliver a move-in or rental-ready unit without you managing contractors from another country.",
    contrast:
      "Not offered at all by transaction-focused brokers, and outside the developer's remit entirely.",
    partners: [
      "Turnkey furnishing and fit-out contractors",
      "Interior designers with Dubai rental-market experience",
    ],
    image: "/images/mamsha-gardens-02.jpg",
    alt: "A warm living room in natural light",
  },
  {
    n: "07",
    label: "Letting",
    title: "Letting and tenant placement",
    copy: "For buy-to-let owners we find and place a qualified tenant, and where you want it, hand over to a trusted property management partner for rent collection, maintenance coordination and lease renewal. The point a competing broker would call the finish line is, for us, the midpoint.",
    contrast:
      "Requires finding a new agent from scratch, usually a cold approach from abroad, with no way to judge who is any good.",
    partners: [
      "Letting agents with district-level tenant demand data",
      "RERA-registered property management firms",
    ],
    image: "/images/verde-terraces-02.jpg",
    alt: "A bright, plant-filled living interior",
  },
  {
    n: "08",
    label: "Mortgage",
    title: "Mortgage, refinance and portfolio support",
    copy: "We connect you with independent mortgage advisors experienced in non-resident lending, typically 35–40% down payment and around 50% LTV for off-plan, for both initial financing and later refinancing. For repeat investors we help sequence further acquisitions against the existing portfolio.",
    contrast:
      "Usually a one-off broker introduction after the sale, with no interest in whether the rate still makes sense three years later.",
    partners: [
      "Non-resident mortgage advisors and lenders",
      "Refinance review at fixed-term expiry",
    ],
    image: "/images/vela-crest-02.jpg",
    alt: "Floor-to-ceiling glass above the city",
  },
  {
    n: "09",
    label: "Resale",
    title: "Resale and exit",
    copy: "When you are ready to sell, an off-plan assignment before handover, or a secondary sale after, we manage the Form F, developer NOC and Oqood transfer process, and find your next buyer. The whole lifecycle stays inside one relationship instead of being scattered across strangers at every stage.",
    contrast:
      "The developer has no interest in your exit; it would rather keep selling new inventory. Your original agent left the industry two years ago.",
    partners: [
      "DLD trustee offices for Oqood transfer",
      "Conveyancing support for Form F and NOC timing",
    ],
    image: "/images/armani-beach-residences-04.jpg",
    alt: "A balcony over calm water at dusk",
  },
];

/* ————————————————————————————————————————————————
   Going direct
———————————————————————————————————————————————— */

export const DIRECT_REBUTTAL = {
  question: "Why not just buy direct from the developer?",
  eyebrow: "Going direct",
  headline: "Buying direct does not make it cheaper. It makes it lonelier.",
  body: "On an off-plan purchase in Dubai, the developer pays the broker's commission out of its own project budget, not you. Skip the broker and the headline price does not move. The developer simply keeps the money.",
  note: "Commission on off-plan sales is paid by the developer, typically 2–8% depending on developer and project; the buyer pays the standard agent fee only in the secondary or resale market. Developer-published \"skip the broker and save\" comparisons present that commission as a buyer cost. For off-plan, it is not.",
} as const;

/** The two routes, side by side. Same price, one of them unrepresented. */
export const ROUTES = {
  headline: "Two routes. One price. One of them has nobody on your side.",
  direct: {
    label: "Route A, direct to developer",
    rows: [
      { k: "Headline price", v: "Unchanged" },
      { k: "Commission you pay", v: "AED 0" },
      { k: "Commission the developer keeps", v: "2–8% of price" },
      { k: "Someone representing you", v: "Nobody" },
    ],
    note: "The developer's sales team is professional, repeat-play and paid to sell its own inventory. It will never mention a competing project.",
  },
  serene: {
    label: "Route B, through Serene",
    rows: [
      { k: "Headline price", v: "Unchanged" },
      { k: "Commission you pay", v: "AED 0" },
      { k: "Commission the developer pays us", v: "2–8% of price" },
      { k: "Someone representing you", v: "A salaried advisor" },
    ],
    note: "Same headline price. Same payment plan. You gain cross-developer comparison, independent inspection and someone who is still there at resale.",
  },
} as const;

/** The all-in cost calculator. Rates are the published off-plan schedule. */
export const CALCULATOR = {
  eyebrow: "All-in cost calculator",
  headline: "The number the price list does not show you.",
  body: "Government and registration costs on an off-plan purchase are fixed and knowable. We put them in front of you at stage one, before a project is named.",
  note: "Indicative only. DLD transfer 4% + AED 580 admin, Oqood registration AED 4,000, trustee and NOC fees per the ranges published for off-plan transfers. Brokerage: AED 0, the developer pays us.",
  mortgageLabel: "Non-resident mortgage (50% LTV, 40% down)",
} as const;

/* ————————————————————————————————————————————————
   Side by side
———————————————————————————————————————————————— */

export interface ComparisonRow {
  dimension: string;
  broker: string;
  direct: string;
  serene: string;
}

export const COMPARISON_INTRO = {
  eyebrow: "Side by side",
  headline: "Compare us against whichever option you are actually weighing.",
  body: "Turn columns on and off. We are content to be read next to either alternative.",
  sources:
    "Commission split ranges: The National (Dubai agent pay, Oct 2025). Cold-calling and DNCR enforcement: Khaleej Times. Off-plan commission payer: Bayut. Handover delay averages: Real Estate Club Dubai.",
} as const;

export const COMPARISON: ComparisonRow[] = [
  {
    dimension: "How the advisor is paid",
    broker: "Commission only, 40–70% split with the agency: a direct incentive to close fast",
    direct: "Developer's own salaried sales team, selling its own inventory",
    serene: "Salaried advisors. No deal-by-deal commission incentive",
  },
  {
    dimension: "Projects you are shown",
    broker: "Often limited to the agency's best-commission relationships",
    direct: "That developer's projects only",
    serene: "Cross-developer, selected on suitability, with the due diligence disclosed",
  },
  {
    dimension: "Outbound contact",
    broker: "Unsolicited calls common industry-wide; a leading source of DNCR complaints",
    direct: "Developer sales teams also market proactively",
    serene: "Call on request only",
  },
  {
    dimension: "Cost to you (off-plan)",
    broker: "None directly, the developer pays the commission",
    direct: "Same headline price. You save nothing; the developer keeps the commission budget",
    serene: "Same headline price. We are paid by the developer, like any broker",
  },
  {
    dimension: "Independent snagging",
    broker: "Rare; not typically arranged",
    direct: "Not independent, the developer inspects its own work",
    serene: "Arranged as standard, before final sign-off",
  },
  {
    dimension: "Support after handover",
    broker: "Minimal to none, the agent has moved to the next lead",
    direct: "Developer customer service, focused on its own liability",
    serene: "Letting, management referral, mortgage and refinance, resale",
  },
  {
    dimension: "Resale and exit",
    broker: "Find a new agent from scratch",
    direct: "No interest in your exit, it competes with new inventory",
    serene: "The same relationship handles the exit",
  },
  {
    dimension: "Conflict of interest",
    broker: "Structural, paid to close, not to advise",
    direct: "Structural, represents the seller only",
    serene: "Designed out, no commission bias, no dual agency",
  },
];

/* ————————————————————————————————————————————————
   The register
———————————————————————————————————————————————— */

/**
 * The developers page is not one of the document's six, but none of its
 * language is new: `headline` and `full` are the comparison table's own line
 * for how a Serene shortlist is built, and `body` is stage two's account of
 * what a project has already been through before anyone is shown it.
 *
 * Held to the voice rules deliberately. An earlier draft opened on what a
 * developer's sales team and a commission-only agent do instead, which argues
 * sideways rather than stating plainly what we are: composed and elevated both
 * rule that out, whatever its merits as an argument.
 */
export const REGISTER_INTRO = {
  eyebrow: "The register",
  headline: "Cross-developer, selected on suitability.",
  body: "Every project we put in front of you has already been through escrow verification, DLD registration checks, construction-status tracking and a review of the developer's delivery track record.",
  full: "Cross-developer, selected on suitability, with the due diligence disclosed.",
} as const;

/* ————————————————————————————————————————————————
   For overseas buyers
———————————————————————————————————————————————— */

export const OVERSEAS_INTRO = {
  eyebrow: "For overseas buyers",
  headline: "You are buying a building you cannot walk into.",
  body: "Non-resident, investment-driven purchases are roughly 60–65% of all Dubai transactions. Almost every one of those buyers is managing a six- or seven-figure asset from thousands of kilometres away, in a construction and legal environment they do not live inside. That is the customer the market serves worst.",
  originsNote:
    "Share of foreign buyers. Pakistan, Canada, France, Egypt and the US are also active.",
} as const;

/** Published shares of *foreign buyers* by nationality, not of all transactions. */
export const BUYER_ORIGINS = [
  { country: "India", share: "22%" },
  { country: "United Kingdom", share: "17%" },
  { country: "China", share: "14%" },
  { country: "Saudi Arabia", share: "11%" },
  { country: "Russia", share: "9%" },
] as const;

export interface Problem {
  k: string;
  /** the figure set as the figure */
  stat: string;
  title: string;
  copy: string;
  /** the stage of the value chain that answers it */
  link: string;
  stage: number;
}

export const PROBLEMS_INTRO = {
  eyebrow: "Four things nobody is doing for you",
  headline: "Each of these has a stage in our value chain.",
} as const;

export const PROBLEMS: Problem[] = [
  {
    k: "01",
    stat: "8.5 mo",
    title: "Handover delays you hear about last",
    copy: "Around 40–50% of off-plan projects slip, averaging 8.5 months. Nobody is watching the site on your behalf.",
    link: "Stage 4, construction monitoring",
    stage: 4,
  },
  {
    k: "02",
    stat: "Day 1",
    title: "A unit you cannot inspect",
    copy: "Independent snagging exists because the developer cannot credibly inspect its own work, and you are 4,000km away at sign-off.",
    link: "Stage 5, independent snagging",
    stage: 5,
  },
  {
    k: "03",
    stat: "35–40%",
    title: "Non-resident lending is a different sport",
    copy: "Higher down payments, LTV capped near 50% for off-plan, full income documentation. Not something to navigate via a cold introduction.",
    link: "Stage 8, mortgage and refinance",
    stage: 8,
  },
  {
    k: "04",
    stat: "30 days",
    title: "An exit with an expiry date",
    copy: "Assignment means developer approval, Form F, an NOC that expires in 30 days and an Oqood transfer at a trustee office. Easy to get wrong from abroad.",
    link: "Stage 9, resale and exit",
    stage: 9,
  },
];

export const SCHEDULE_BAND = {
  eyebrow: "On your schedule",
  headline: "We answer when you ask. We never call because a quarter is closing.",
  body: "Tell us your city and your hours. Every conversation is booked, not sprung, which also happens to sit on the right side of the UAE's Do Not Call Registry rules, where a lot of the market currently does not.",
} as const;

/* ————————————————————————————————————————————————
   How we are paid
———————————————————————————————————————————————— */

export const PAID_INTRO = {
  eyebrow: "How we are paid",
  headline: "Salaried advisors. No kickbacks. No cold calls.",
  body: "You pay us nothing on an off-plan purchase, the developer does, exactly as it would any broker. What is different is what happens to that money once it reaches us: it funds a salaried advisory team, not a commission pool that rewards whoever closes fastest.",
} as const;

export const PAY_CARDS = [
  {
    eyebrow: "The money",
    title: "The developer pays, as always",
    copy: "Off-plan commission of 2–8% is budgeted into the developer's project economics and paid to whoever introduces the buyer. That does not change with us.",
  },
  {
    eyebrow: "The difference",
    title: "It funds salaries, not a race",
    copy: "Revenue goes to a salaried advisory team. No advisor's income moves because you chose project A over project B, or because you signed this month rather than next.",
  },
  {
    eyebrow: "The consequence",
    title: "Nothing to hand back",
    copy: "Kickbacks happen when agents compete by returning slices of their own commission. Our advisors have no commission to slice. The behaviour is not discouraged here, it is impossible.",
  },
] as const;

export const COMPLIANCE_INTRO = {
  eyebrow: "Documented, not asserted",
  headline: "The paperwork already exists. We just use it as intended.",
} as const;

export const COMPLIANCE = [
  {
    title: "RERA Form B, buyer's agent agreement",
    copy: "The legal machinery for a documented buyer-side relationship already exists. We use it as intended, with commission disclosure in writing.",
  },
  {
    title: "RERA Form I, inter-broker splits",
    copy: "Where another brokerage is involved, the split is documented rather than negotiated behind you.",
  },
  {
    title: "TDRA Do Not Call Registry",
    copy: "Telemarketing is restricted to 9am–6pm, repeat same-day calls after a rejection are banned, and corporate fines run to AED 150,000. Our call-on-request model sits comfortably inside that; much of the market does not.",
  },
  {
    title: "Escrow verification",
    copy: "Every project is checked against UAE escrow law protections before it reaches your shortlist.",
  },
] as const;

export const PRECEDENT = {
  eyebrow: "Precedent",
  headline: "This model has existed since the 1980s. Just not here.",
  body: [
    "The exclusive buyer's agent, representing buyers only, never taking seller listings, structurally barred from dual agency, has been a respected niche in the United States for forty years, created to solve precisely the conflict of interest we are targeting.",
    "No equivalent operates at scale in Dubai's off-plan market. That is not a crowded position we are squeezing into. It is empty.",
  ],
} as const;

/* ————————————————————————————————————————————————
   Request a conversation
———————————————————————————————————————————————— */

export const ENQUIRY = {
  eyebrow: "Request a conversation",
  headline: "We will not call you unless you ask us to.",
  body: "Tell us what you are trying to achieve. An advisor replies in your preferred channel, in your hours, with no obligation and no follow-up sequence.",
  assurances: [
    "No calling list, no drip sequence, no reminder calls.",
    "An advisor replies in the channel and hours you nominate.",
    "Every specialist we introduce is optional and pays us nothing.",
  ],
  footnote: "You will not be added to a calling list. Ever.",
} as const;

export const SITE_SOURCES =
  "Market figures cited from Dubai Land Department, Khaleej Times, The National, Gulf News, Bayut, Economy Middle East and Veersant reporting, 2025–26. Cost figures are indicative and not a quotation.";
