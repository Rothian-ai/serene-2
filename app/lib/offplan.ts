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
   The journey — what actually happens, in order, with the paperwork named.
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
    copy: "Objective first: capital growth, rental yield, Golden Visa eligibility, a home to use, or an exit at a set horizon. Then the honest budget — headline price plus registration fees, and service charges once you own it. Only then do developer, district and project make sense as questions. Compare delivery record, not brochures.",
  },
  {
    n: "02",
    title: "Reservation",
    when: "Day one",
    copy: "A reservation form or expression of interest, plus a booking deposit — commonly 5–10% of the price, and part of your total down payment rather than an extra. Verify before you pay that the project is registered and that the money is going to the project's escrow account, not to the developer's own account.",
    artefact: "Reservation form · booking deposit 5–10%",
  },
  {
    n: "03",
    title: "The Sales and Purchase Agreement",
    when: "Typically 2–4 weeks later",
    copy: "The contract that governs everything. Read four things in particular: the payment schedule and whether it is milestone-linked or calendar-linked; the delay and compensation clauses; the cancellation terms; and the resale or assignment restrictions, which decide whether you can exit before completion. This is the moment for independent legal review — before signature, not after.",
    artefact: "SPA",
  },
  {
    n: "04",
    title: "Registration",
    when: "At or shortly after signing",
    copy: "In Dubai the 4% Dubai Land Department fee is paid at registration, and the developer registers your purchase in the Oqood system — this records your interest in the unit while it is still being built. In Abu Dhabi the transaction is registered with ADREC, which issues an initial registration certificate. Keep the certificate; it is the proof that your interest exists.",
    artefact: "Oqood certificate (Dubai) · initial registration certificate (Abu Dhabi)",
  },
  {
    n: "05",
    title: "The construction years",
    when: "Two to four years, usually",
    copy: "Instalments fall due against the schedule in your SPA. On a milestone-linked plan, money leaves escrow only when certified progress is reached. This is the long, quiet stretch — and the one where an overseas buyer most often has nobody checking progress on their behalf. Delivery slips are normal enough to plan for, so track the project rather than waiting to be told.",
  },
  {
    n: "06",
    title: "Snagging, before you sign off",
    when: "Weeks before handover",
    copy: "An independent inspection of the finished unit against the specification you bought, producing a documented defect list. Sequence is everything: defects recorded before the final payment or mortgage drawdown is released are defects you still have leverage over. The developer's own handover team is not an independent inspector of its own work.",
    artefact: "Snagging report · defect rectification",
  },
  {
    n: "07",
    title: "Handover",
    when: "Completion",
    copy: "Final payment, keys, and the title deed issued in your name. Service charges begin from here, billed annually per square foot and set by the regulator — they are a real running cost and belong in the yield calculation from the start, not as a surprise in year one.",
    artefact: "Title deed",
  },
  {
    n: "08",
    title: "And then the part nobody describes",
    when: "The years after",
    copy: "Furnishing or fit-out if the unit is going to be lived in or let. Finding and placing a tenant, and someone to manage the lease. Arranging or refinancing a mortgage — materially different terms for non-residents. For most overseas owners this is where the investment is actually won or lost, and where the market goes quiet.",
  },
  {
    n: "09",
    title: "The exit",
    when: "When you choose",
    copy: "Before completion, selling means an assignment: developer approval, a Form F memorandum of understanding, a developer no-objection certificate that expires after 30 days, and an Oqood transfer at a land department trustee office. After completion it is a standard resale. Either way the restrictions written into your SPA at step three decide what is possible.",
    artefact: "Form F · developer NOC · Oqood transfer",
  },
];

/* ————————————————————————————————————————————————
   Payment plans — the mechanic newcomers most often misread.
———————————————————————————————————————————————— */

export const PLAN_BASIS = [
  {
    k: "Construction-linked",
    copy: "Instalments fall due when certified building milestones are reached — foundation, structure, MEP, finishing. If the build slows, your payments slow with it. This is the structure that keeps your money and the developer's progress tied together.",
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
    copy: "20% at booking, 60% through construction stages, 20% on handover — the same idea as 80/20, stated with the deposit broken out.",
  },
  {
    split: "Post-handover",
    name: "Paying after the keys",
    copy: "Typically 30–50% of the price is deferred past completion, spread over two to five years. It eases cash flow and can let rental income contribute — but it is still debt to the developer, and the terms deserve the same scrutiny as a mortgage.",
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
        label: "DLD fees and Oqood — Projectory",
        href: "https://projectory.ae/insights/understanding-dld-fees-for-off-plan-property-in-dubai/",
      },
      {
        label: "UAE escrow law — Knightsbridge",
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
    note: "A smaller, more institutionally concentrated market than Dubai, with its own regulator and its own paperwork — not a Dubai process with a different postcode.",
    sources: [
      {
        label: "Buying off-plan in Abu Dhabi — MPI",
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
      "Registration with SRERD is required. Off-plan escrow arrangements are less uniformly documented publicly than in Dubai — ask for the project's escrow details in writing.",
    registration: "Through SRERD. Confirm the registrable right and the fee before committing.",
    note: "The single most important question here is what right you will actually hold, and for how long. Get it confirmed by the registry, not by a sales office.",
    sources: [
      {
        label: "Foreign ownership in Sharjah — Property Finder",
        href: "https://www.propertyfinder.ae/blog/property-ownership-foreigners-sharjah/",
      },
      {
        label: "100-year usufruct rights — Lexology",
        href: "https://www.lexology.com/library/detail.aspx?g=3e67e86d-e3f1-4518-89df-634214315fa9",
      },
    ],
  },
  {
    emirate: "Ras Al Khaimah",
    regulator: "RAK land department, with RERA-RAK regulating the sector",
    foreignOwnership:
      "Freehold available to all nationalities in designated investment zones — Al Marjan Island, Al Hamra Village and Mina Al Arab among them.",
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
        label: "RAK laws and secure transactions — TrustIn",
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
    v: "4% of the price in Dubai, paid at registration. Other Emirates differ — confirm with the regulator.",
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
    v: "On off-plan, paid by the developer out of its own project budget — not added to your price.",
  },
  {
    k: "Exit costs",
    v: "An assignment before completion carries transfer, registration, trustee and no-objection-certificate fees. Model them before you plan on an early exit.",
  },
];

export const RISKS = [
  {
    k: "Delivery slips are normal",
    copy: "Roughly 40–50% of Dubai off-plan projects experience some delay, averaging around 8.5 months across the market, with smaller-tier developers regularly exceeding 10 to 18 months. Plan for the possibility rather than assuming the brochure date.",
    source: {
      label: "Real Estate Club Dubai",
      href: "https://realestateclubdubai.com/blog/buying-guide/off-plan-handover-delays-in-dubai-developer-track-records-what-buyers-can-do",
    },
  },
  {
    k: "The builder is not the inspector",
    copy: "An independent snagging industry exists precisely because a developer cannot credibly inspect its own work, and an overseas buyer cannot assess build quality remotely. Arrange the inspection before you release the final payment.",
  },
  {
    k: "Your exit was decided at signature",
    copy: "Assignment restrictions written into the SPA — often a minimum percentage paid before resale is permitted — govern whether you can sell before completion at all. Read that clause before you sign, not when you want to leave.",
  },
  {
    k: "Nobody is obliged to keep you informed",
    copy: "Once the commission on your purchase is paid, no one in the standard market structure is paid to keep watching your project. Progress is a matter of record and can be tracked — but only if somebody is tracking it.",
  },
];

/* ————————————————————————————————————————————————
   FAQ — market questions, not questions about us. The ones about how Serene
   works live in content/faqs.json and on /faqs.
———————————————————————————————————————————————— */

export const OFFPLAN_FAQS = [
  {
    question: "What does “off-plan” actually mean?",
    answer:
      "Buying a property before it is finished — sometimes before construction has started. You are not buying a building; you are buying a contractual right to a specific unit, registered with the land department, which becomes a title deed at completion. Off-plan is not a niche in the UAE: it is the majority of the residential market.",
  },
  {
    question: "Is it safe to buy something that does not exist yet?",
    answer:
      "The regulatory framework is built for it. Your payments go into a project escrow account rather than to the developer directly, and are released against certified construction progress. Projects and developers must be registered before units can be sold. What the framework does not do is watch the build for you, inspect the finished unit, or read the contract on your behalf — those gaps are yours to close, with help.",
  },
  {
    question: "How much do I need to start?",
    answer:
      "A booking deposit of commonly 5–10% of the price, which forms part of your down payment rather than sitting on top of it. Then instalments under the plan in your SPA. Budget separately for the registration fee, and for service charges once you take handover.",
  },
  {
    question: "What is the difference between a construction-linked and a time-linked payment plan?",
    answer:
      "A construction-linked plan releases your instalments when certified building milestones are reached, so payment and progress stay tied together. A time-linked plan falls due on fixed calendar dates regardless of what has been built — which can leave you substantially paid up on a project that has barely moved. Ask which one you are signing, in writing.",
  },
  {
    question: "What is a post-handover payment plan, and is it a good idea?",
    answer:
      "It defers part of the price — commonly 30–50% — past completion, over roughly two to five years, so rental income can contribute to the instalments. It genuinely helps cash flow. It is also, in substance, finance provided by the developer, so compare the total cost and the terms against a mortgage rather than treating it as free.",
  },
  {
    question: "Can I buy off-plan if I do not live in the UAE?",
    answer:
      "Yes, and most buyers do not live there. Foreign, non-resident purchasing accounts for the majority of transactions. It changes what you should plan for rather than whether you can buy: you will not be able to inspect the site or the finished unit yourself, and mortgage terms for non-residents are materially different from resident terms.",
  },
  {
    question: "Are the rules the same in every Emirate?",
    answer:
      "No, and this is where newcomers most often get caught out. Each Emirate has its own regulator, its own registration process and its own rules on what a foreign buyer may hold. Dubai offers freehold to all nationalities in designated areas; Abu Dhabi has designated investment zones under ADREC; Sharjah generally offers long leasehold or usufruct rights rather than freehold to non-GCC nationals. Confirm the exact right for the exact property before you commit.",
  },
  {
    question: "What happens if the project is delayed?",
    answer:
      "Your SPA's delay and compensation clauses govern it, which is why they are worth reading before signature. Delays are common enough to plan for: roughly 40–50% of Dubai off-plan projects see some slippage, averaging around 8.5 months. If a project is cancelled outright, the escrow account is frozen and the regulator's committee process addresses the return of escrowed funds.",
  },
  {
    question: "Can I sell before the building is finished?",
    answer:
      "Often, but not automatically. It is called an assignment, and it usually requires developer approval — frequently conditional on a minimum percentage of the price having been paid — plus a Form F memorandum of understanding, a developer no-objection certificate that expires after 30 days, and an Oqood transfer at a trustee office. The restrictions in your SPA decide what is possible.",
  },
  {
    question: "Do I pay the broker?",
    answer:
      "Not on an off-plan purchase. The developer pays the broker's commission out of its own project budget, so the headline price is the same whether or not you use one. It is only in the secondary resale market that a buyer typically pays an agent's fee directly.",
  },
  {
    question: "Does buying property get me residency?",
    answer:
      "Property investment at and above AED 2 million is one of the routes to long-term Golden Visa eligibility. Treat it as a consequence of a sound purchase rather than a reason to make an unsound one, and get the current criteria confirmed — visa rules change more often than property law.",
  },
  {
    question: "What should I ask a developer that I probably would not think to ask?",
    answer:
      "Four things. Show me the escrow account registration for this project. What is your delivery record on the last three completions — actual handover dates against the dates advertised? Is this plan milestone-linked or calendar-linked? And what does the SPA permit if I want to assign before completion?",
  },
];

/** Everything cited on the page, gathered for the closing note. */
export const OFFPLAN_SOURCES: Source[] = [
  {
    label: "Dubai off-plan process and DLD fees — Projectory",
    href: "https://projectory.ae/insights/understanding-dld-fees-for-off-plan-property-in-dubai/",
  },
  {
    label: "Oqood registration — EGSH",
    href: "https://egsh.ae/insights/off-plan-property-purchase-in-dubai",
  },
  {
    label: "How UAE escrow law protects off-plan buyers — Knightsbridge",
    href: "https://knightsbridge.ae/how-the-uae-escrow-law-protects-off-plan-property-buyers/",
  },
  {
    label: "Off-plan payment plans explained — Dealr",
    href: "https://dealr.ae/guides/how-off-plan-payment-plans-work-dubai",
  },
  {
    label: "Handover delays and developer track records — Real Estate Club Dubai",
    href: "https://realestateclubdubai.com/blog/buying-guide/off-plan-handover-delays-in-dubai-developer-track-records-what-buyers-can-do",
  },
  {
    label: "Off-plan resale, NOC and Oqood transfer — Place Overseas",
    href: "https://placeoverseas.com/blog/dubai-off-plan-resale-oqood-transfer-and-noc-guide",
  },
  {
    label: "Non-resident mortgages in Dubai — Kotook",
    href: "https://kotook.ae/blog/dubai-mortgage-for-non-residents",
  },
  {
    label: "Who pays real estate commission in Dubai — Bayut",
    href: "https://www.bayut.com/agentportal/demystifying-real-estate-commissions-in-dubai-who-pays-and-how-much/",
  },
];
