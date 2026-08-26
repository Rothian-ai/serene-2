/**
 * The off-plan explainer — content for /off-plan, written for someone who has
 * never bought in the UAE before.
 *
 * SOURCING NOTE, READ THIS BEFORE EDITING.
 *
 * `strategy.ts` holds the Serene model and is sourced entirely from the buyer
 * value-chain document (`docs/serene-bay-value-chain-strategy.md`). This module
 * is different: the strategy document is **Dubai-only** — it contains no
 * mention of Abu Dhabi, Sharjah, Ras Al Khaimah, freehold rules or payment-plan
 * structures. So the mechanics below were researched separately, and every
 * factual claim carries a `source` with a link.
 *
 * Two consequences:
 *   1. Nothing here is a Serene claim. It is how the market works, attributed.
 *   2. Regulation and fees change. The Emirate table in particular is a
 *      starting point for a buyer, not a substitute for the regulator — the
 *      page says so, and it must keep saying so.
 *
 * BEFORE LAUNCH: have a UAE-qualified adviser verify every figure and every
 * Emirate row, and re-check the fee lines against the current DLD / ADREC /
 * SRERD / RAK schedules.
 */

export interface Source {
  label: string;
  href: string;
}

/* ————————————————————————————————————————————————
   The journey — what actually happens, in order, with the paperwork named and
   the usual timings. Deliberately mechanical: this is the process, true
   whoever you buy through. What Serene does at each of these points, and the
   specialists it introduces, is the nine-stage value chain on /lifecycle, and
   the two must not start sounding alike — an earlier draft of these steps
   carried advice as well as mechanics, which made two different nine-item
   lists read as one repeated list.
   This is the market's process. What *we* do at each point is /lifecycle.
———————————————————————————————————————————————— */

export interface JourneyStep {
  n: string;
  title: string;
  when: string;
  copy: string;
  /** the document or payment that defines this step */
  artefact?: string;
}

export const JOURNEY: JourneyStep[] = [
  {
    n: "01",
    title: "Identify and shortlist",
    when: "Before anything is signed",
    copy: "Nothing is signed. What gets decided is the objective, the all-in budget including registration fees and the service charges that follow ownership, and which developers survive a look at their delivery record.",
  },
  {
    n: "02",
    title: "Reservation",
    when: "Day one",
    copy: "A reservation form and a booking deposit, commonly 5–10% of the price and part of the down payment rather than an addition to it. The deposit belongs in the project's escrow account, not the developer's own.",
    artefact: "Reservation form · booking deposit 5–10%",
  },
  {
    n: "03",
    title: "The Sales and Purchase Agreement",
    when: "Typically 2–4 weeks later",
    copy: "The contract that governs everything after it. Four clauses decide the rest: whether the payment schedule is milestone-linked or calendar-linked, the delay and compensation terms, the cancellation terms, and the assignment restrictions that fix whether you can sell before completion.",
    artefact: "SPA",
  },
  {
    n: "04",
    title: "Registration",
    when: "At or shortly after signing",
    copy: "In Dubai the 4% Dubai Land Department fee falls due and the developer records the purchase in the Oqood system, which registers your interest in a unit that does not exist yet. In Abu Dhabi it is registered with ADREC, which issues an initial registration certificate.",
    artefact: "Oqood certificate (Dubai) · initial registration certificate (Abu Dhabi)",
  },
  {
    n: "05",
    title: "The construction years",
    when: "Two to four years, usually",
    copy: "Instalments fall due against the schedule in the SPA. On a milestone-linked plan money leaves escrow only when certified construction progress is reached. Delivery slips are common enough to budget time for.",
  },
  {
    n: "06",
    title: "Snagging, before you sign off",
    when: "Weeks before handover",
    copy: "An inspection of the finished unit against the specification that was sold, producing a documented defect list. The sequence matters: defects recorded before the final payment or mortgage drawdown is released are still the developer's to fix.",
    artefact: "Snagging report · defect rectification",
  },
  {
    n: "07",
    title: "Handover",
    when: "Completion",
    copy: "Final payment, keys, and the title deed issued in your name. Service charges start here, billed annually per square foot at a rate the regulator sets.",
    artefact: "Title deed",
  },
  {
    n: "08",
    title: "And then the part nobody describes",
    when: "The years after",
    copy: "Fit-out or furnishing, a tenant to find and place, someone to manage the lease, and a mortgage to arrange or refinance on terms that differ for non-residents.",
  },
  {
    n: "09",
    title: "The exit",
    when: "When you choose",
    copy: "Before completion, selling is an assignment: developer approval, a Form F memorandum of understanding, a no-objection certificate that expires after 30 days, and an Oqood transfer at a trustee office. After completion it is an ordinary resale. Either way the SPA clauses from step three set the limits.",
    artefact: "Form F · developer NOC · Oqood transfer",
  },
];

/* ————————————————————————————————————————————————
   Payment plans — the mechanic newcomers most often misread.
———————————————————————————————————————————————— */

export const PLAN_BASIS = [
  {
    k: "Construction-linked",
    copy: "Instalments fall due when certified building milestones are reached, foundation, structure, MEP, finishing. If the build slows, your payments slow with it. This is the structure that keeps your money and the developer's progress tied together.",
    verdict: "Preferable, and worth asking for by name.",
  },
  {
    k: "Time-linked",
    copy: "Instalments fall due on fixed calendar dates whether or not the building has advanced. You can find yourself substantially paid up on a project that has barely moved.",
    verdict: "Read the schedule carefully before signing.",
  },
];

export interface Plan {
  split: string;
  name: string;
  copy: string;
}

export const PLANS: Plan[] = [
  {
    split: "60 / 40",
    name: "The current default",
    copy: "60% across construction, 40% at handover. The most common structure in the Dubai market today.",
  },
  {
    split: "80 / 20",
    name: "Front-loaded",
    copy: "80% during construction against staged checkpoints, 20% on completion. More of your capital is committed earlier, so the developer's delivery record matters more.",
  },
  {
    split: "50 / 50",
    name: "Even",
    copy: "Half across the build, half at handover. Less early exposure than a front-loaded plan.",
  },
  {
    split: "20 / 60 / 20",
    name: "Booking, build, handover",
    copy: "20% at booking, 60% through construction stages, 20% on handover, the same idea as 80/20, stated with the deposit broken out.",
  },
  {
    split: "Post-handover",
    name: "Paying after the keys",
    copy: "Typically 30–50% of the price is deferred past completion, spread over two to five years. It eases cash flow and can let rental income contribute, but it is still debt to the developer, and the terms deserve the same scrutiny as a mortgage.",
  },
  {
    split: "1% monthly",
    name: "The long drip",
    copy: "A marketing structure that spreads instalments into small monthly amounts. Check what the headline conceals: the deposit, the handover lump, and the total term.",
  },
];

/** What to check on any plan, whatever the headline split. */
export const PLAN_CHECKS = [
  "Is it milestone-linked or calendar-linked? Ask in writing.",
  "What is the booking deposit, and is it inside the plan or on top?",
  "What is actually due on handover day, and can you fund it without borrowing?",
  "What happens to the schedule if the project is late?",
  "Are registration fees and service charges in your budget, or only the price?",
];

/* ————————————————————————————————————————————————
   Emirate by Emirate. Regulation and fees change; this is a starting point.
———————————————————————————————————————————————— */

export interface EmirateRow {
  emirate: string;
  regulator: string;
  foreignOwnership: string;
  offPlanProtection: string;
  registration: string;
  note: string;
  sources: Source[];
}

export const EMIRATES: EmirateRow[] = [
  {
    emirate: "Dubai",
    regulator: "Dubai Land Department (DLD), with RERA as its regulatory arm",
    foreignOwnership: "Freehold for all nationalities in designated areas, registered in your own name.",
    offPlanProtection:
      "Project escrow accounts under UAE escrow law, released against certified construction progress. Project and developer registration required before selling.",
    registration:
      "4% DLD fee at registration, plus Oqood registration of the off-plan interest by the developer after the SPA.",
    note: "The deepest and most heavily documented off-plan market in the country, and the one this site's research covers in most detail.",
    sources: [
      {
        label: "DLD fees and Oqood · Projectory",
        href: "https://projectory.ae/insights/understanding-dld-fees-for-off-plan-property-in-dubai/",
      },
      {
        label: "UAE escrow law · Knightsbridge",
        href: "https://knightsbridge.ae/how-the-uae-escrow-law-protects-off-plan-property-buyers/",
      },
    ],
  },
  {
    emirate: "Abu Dhabi",
    regulator: "Abu Dhabi Real Estate Centre (ADREC)",
    foreignOwnership:
      "Non-GCC nationals can own in designated investment zones. Confirm the exact right being registered for the specific plot.",
    offPlanProtection:
      "Off-plan framework under Law No. 3 of 2015, with project-specific ADREC-regulated escrow accounts and milestone-verified releases.",
    registration:
      "Registered with ADREC after the SPA, which issues an initial registration certificate. Confirm the current fee directly with ADREC.",
    note: "A smaller, more institutionally concentrated market than Dubai, with its own regulator and its own paperwork, not a Dubai process with a different postcode.",
    sources: [
      {
        label: "Buying off-plan in Abu Dhabi · MPI",
        href: "https://www.mpinv.ae/guide/off-plan-property-abu-dhabi",
      },
      {
        label: "ADREC rules and fees guide",
        href: "https://oplusrealty.com/adrec-abu-dhabi-real-estate-centre-guide-2026/",
      },
    ],
  },
  {
    emirate: "Sharjah",
    regulator: "Sharjah Real Estate Registration Department (SRERD)",
    foreignOwnership:
      "Generally not freehold for non-GCC nationals. Long leasehold and usufruct rights of up to 100 years are the usual routes, and a brochure saying “freehold” is not the same as what the registry will record.",
    offPlanProtection:
      "Registration with SRERD is required. Off-plan escrow arrangements are less uniformly documented publicly than in Dubai, ask for the project's escrow details in writing.",
    registration: "Through SRERD. Confirm the registrable right and the fee before committing.",
    note: "The single most important question here is what right you will actually hold, and for how long. Get it confirmed by the registry, not by a sales office.",
    sources: [
      {
        label: "Foreign ownership in Sharjah · Property Finder",
        href: "https://www.propertyfinder.ae/blog/property-ownership-foreigners-sharjah/",
      },
      {
        label: "100-year usufruct rights · Lexology",
        href: "https://www.lexology.com/library/detail.aspx?g=3e67e86d-e3f1-4518-89df-634214315fa9",
      },
    ],
  },
  {
    emirate: "Ras Al Khaimah",
    regulator: "RAK land department, with RERA-RAK regulating the sector",
    foreignOwnership:
      "Freehold available to all nationalities in designated investment zones, Al Marjan Island, Al Hamra Village and Mina Al Arab among them.",
    offPlanProtection:
      "Developers must satisfy project registration, approvals and escrow requirements before selling off-plan.",
    registration: "Through the RAK land department. Confirm current fees locally.",
    note: "Overwhelmingly an off-plan market, and currently a fast-moving one. Speed is not the same as depth: delivery records here are shorter than in Dubai, which makes developer diligence more important rather than less.",
    sources: [
      {
        label: "RAK real estate guide",
        href: "https://wow-rak.com/ras-al-khaimah-real-estate-guide/",
      },
      {
        label: "RAK laws and secure transactions · TrustIn",
        href: "https://www.trustin.ae/blogs/ras-al-khaimah-real-estate-market-trends-laws-secure-transactions",
      },
    ],
  },
];

/** The Emirates the page does not tabulate, and why. */
export const OTHER_EMIRATES =
  "Ajman, Umm Al Quwain and Fujairah have smaller off-plan markets with their own registration authorities and their own rules on what a foreign buyer may hold. We have not tabulated them because we would rather say nothing than say something approximate about the right you would be buying. Ask us and we will get the current position confirmed for the specific project.";

/* ————————————————————————————————————————————————
   The costs beyond the price, and the risks worth naming.
———————————————————————————————————————————————— */

export const COSTS = [
  {
    k: "Registration fee",
    v: "4% of the price in Dubai, paid at registration. Other Emirates differ, confirm with the regulator.",
  },
  {
    k: "Off-plan registration",
    v: "Oqood registration of your interest in Dubai; an initial registration certificate in Abu Dhabi.",
  },
  {
    k: "Service charges",
    v: "Annual, per square foot, from handover onward. A real running cost that belongs in any yield figure.",
  },
  {
    k: "Mortgage, if you need one",
    v: "Non-resident lending is materially different: typically 35–40% down payment and loan-to-value capped around 50% for off-plan, with full income documentation.",
  },
  {
    k: "Broker commission",
    v: "On off-plan, paid by the developer out of its own project budget, not added to your price.",
  },
  {
    k: "Exit costs",
    v: "An assignment before completion carries transfer, registration, trustee and no-objection-certificate fees. Model them before you plan on an early exit.",
  },
];

/* ————————————————————————————————————————————————
   FAQ — only the market questions the page above does not already answer.
   It held twelve; eight of them restated a section on the same page (what
   off-plan is, the plan structures, the Emirates, going direct) or an entry on
   /faqs, so they are gone. Questions about how Serene works live in
   content/faqs.json and on /faqs.
———————————————————————————————————————————————— */

export const OFFPLAN_FAQS = [
{
    question: "Can I buy off-plan if I do not live in the UAE?",
    answer:
      "Yes, and most buyers do not live there. Foreign, non-resident purchasing accounts for the majority of transactions. It changes what you should plan for rather than whether you can buy: you will not be able to inspect the site or the finished unit yourself, and mortgage terms for non-residents are materially different from resident terms.",
  },
{
    question: "Can I sell before the building is finished?",
    answer:
      "Often, but not automatically. It is called an assignment, and it usually requires developer approval, frequently conditional on a minimum percentage of the price having been paid, plus a Form F memorandum of understanding, a developer no-objection certificate that expires after 30 days, and an Oqood transfer at a trustee office. The restrictions in your SPA decide what is possible.",
  },
{
    question: "Does buying property get me residency?",
    answer:
      "Property investment at and above AED 2 million is one of the routes to long-term Golden Visa eligibility. Treat it as a consequence of a sound purchase rather than a reason to make an unsound one, and get the current criteria confirmed, visa rules change more often than property law.",
  },
{
    question: "What should I ask a developer that I probably would not think to ask?",
    answer:
      "Four things. Show me the escrow account registration for this project. What is your delivery record on the last three completions, actual handover dates against the dates advertised? Is this plan milestone-linked or calendar-linked? And what does the SPA permit if I want to assign before completion?",
  },
];

/** Everything cited on the page, gathered for the closing note. */
export const OFFPLAN_SOURCES: Source[] = [
  {
    label: "Dubai off-plan process and DLD fees · Projectory",
    href: "https://projectory.ae/insights/understanding-dld-fees-for-off-plan-property-in-dubai/",
  },
  {
    label: "Oqood registration · EGSH",
    href: "https://egsh.ae/insights/off-plan-property-purchase-in-dubai",
  },
  {
    label: "How UAE escrow law protects off-plan buyers · Knightsbridge",
    href: "https://knightsbridge.ae/how-the-uae-escrow-law-protects-off-plan-property-buyers/",
  },
  {
    label: "Off-plan payment plans explained · Dealr",
    href: "https://dealr.ae/guides/how-off-plan-payment-plans-work-dubai",
  },
  {
    label: "Handover delays and developer track records · Real Estate Club Dubai",
    href: "https://realestateclubdubai.com/blog/buying-guide/off-plan-handover-delays-in-dubai-developer-track-records-what-buyers-can-do",
  },
  {
    label: "Off-plan resale, NOC and Oqood transfer · Place Overseas",
    href: "https://placeoverseas.com/blog/dubai-off-plan-resale-oqood-transfer-and-noc-guide",
  },
  {
    label: "Non-resident mortgages in Dubai · Kotook",
    href: "https://kotook.ae/blog/dubai-mortgage-for-non-residents",
  },
  {
    label: "Who pays real estate commission in Dubai · Bayut",
    href: "https://www.bayut.com/agentportal/demystifying-real-estate-commissions-in-dubai-who-pays-and-how-much/",
  },
];
