# Amelia Partner Listing API — complete integration reference

Server-to-server API for rendering full property listing pages on your own
website (e.g. serenebay.ae) from Amelia's catalog, plus the funnel endpoints
that turn your visitors into verified buyer accounts and leads.

**Document version: 31 Aug 2026.** A "Recent changes" section at the end lists
what changed lately and what, if anything, it needs from your side.

---

## 1. Basics

- **Base URL** — your white-label domain: `https://amelia.serenebay.ae`
  (the platform domain works identically; media and page links in responses
  are already absolute on the right host).
- **Auth** — `Authorization: Bearer <API key>` on every `/api/v1` request.
  Keys are issued per organization from the platform admin panel and shown
  **once** at creation. Rotate by creating a new key, deploying it, then
  revoking the old one. A missing/typo'd/revoked key gets `401` — the API
  deliberately doesn't distinguish which.
- **Keep the key server-side.** Never call these endpoints from the browser —
  there are no CORS headers, by design. Fetch in server components / route
  handlers and pass data down.
- **Rate limit** — 120 requests/min per key. Over it: `429` with a
  `Retry-After` header (seconds).
- **Conditional requests** — every JSON response carries a weak `ETag` and
  `Cache-Control: private, no-cache`. Send the ETag back as `If-None-Match`
  and an unchanged page answers `304 Not Modified` with no body. Poll as often
  as you like; unchanged catalogs cost almost nothing.
- **Percentages are percentage numbers**, ready for a `%` suffix:
  `investment.expectedGrossYieldPct: 7` means 7%, `fees[].pctOfPrice: 4`
  means 4% of the purchase price.
- **Nulls mean "not provided"** — hide the row/section. Every array can be
  empty. Unknown-to-you enum values may appear over time — render them
  humanized rather than crashing.
- **Dates** are ISO-8601 strings in JSON.

### Compliance guarantees (what being in the feed means)

- **Only published, permit-valid properties are served.** A property without a
  complete, seller-confirmed, unexpired Trakheesi permit is a draft: it never
  appears in the list and its slug 404s. The nightly compliance run re-checks
  permits with DLD and auto-drafts a property the day after its permit's End
  Date passes — it simply drops out of your next fetch.
- **If a unit is served, it is advertisable.** Units that are drafted, or
  whose own unit-level permit DLD has confirmed withdrawn or has expired, are
  excluded from `units[]` AND from every availability count. Internally-Held
  units are never served either (`includeUnits=all` covers
  Available/Reserved/Sold only).
- Rendering what this API returns — including the permit number and QR —
  keeps your pages permit-compliant.

---

## 2. `GET /api/v1/projects` — listing cards

Cursor-paginated cards for grids/maps.

**Query params**

| param | meaning |
|---|---|
| `limit` | 1–100, default 50 |
| `cursor` | `nextCursor` from the previous page |
| `propertyType` | exact enum match (`Apartment`, `Villa`, `Townhouse`, `Penthouse`, `Plot`, `Commercial`, `MixedUse`) |
| `status` | exact enum match (`Announced`, `PreLaunch`, `UnderConstruction`, `Handover`, `Completed`) |
| `area` | case-insensitive substring match |
| `minPrice`, `maxPrice` | AED band overlap with the project's price band |
| `updatedSince` | ISO date — only projects updated since. Inventory edits (units, buildings, communities, prices, floor bands) bump the timestamp; media/content edits may not, so keep a periodic full sweep as a backstop |

An unknown `propertyType`/`status` value returns an **empty 200 page**, not an
error — check spelling against values the feed itself returns. Malformed
params return `400 { error, issues }`.

**Response**

```jsonc
{
  "data": [ /* ProjectCard, see type below */ ],
  "nextCursor": "clx…"   // null on the last page
}
```

```ts
interface ProjectCard {
  id: string;
  slug: string;                    // stable, use in URLs
  name: string;
  emirate: string;                 // "Dubai", "AbuDhabi", …
  area: string | null;
  propertyType: string;
  status: string;
  minPrice: number | null;         // AED
  maxPrice: number | null;
  currency: string;                // "AED"
  minPricePerSqft: number | null;  // min over AVAILABLE units
  handoverQuarter: string | null;  // "Q3 2028"
  completionPct: number | null;
  totalUnits: number | null;       // marketing figure from the developer
  availableUnitCount: number;      // live, advertisable units only
  availableBedrooms: number[];     // ascending; 0 = studio
  developer: {
    id: string; name: string;
    logoUrl: string | null;        // permanent URL, see §4
    logoOnDark: boolean;           // artwork is light — show on a dark chip
  } | null;
  location: { latitude: number | null; longitude: number | null } | null;
  featuredImageUrl: string | null; // = images[0]
  images: string[];                // ≤6 permanent URLs
  permit: {
    number: string | null;
    liveness: string | null;       // see §5
    checkedAt: string | null;      // last DLD re-check
    verificationUrl: string | null;// official DLD/DARI link
  };
  updatedAt: string;
}
```

---

## 3. `GET /api/v1/projects/{slug}` — complete property record

**Query params**

- `includeUnits` — `available` (default) | `all` (adds Reserved/Sold so you
  can render sold-out states; never Held) | `none` (`units` comes back `[]`
  for a lightweight metadata refresh).

`404 { error: "Not found" }` for unknown slugs, another org's slugs, and
drafts alike.

```ts
interface ProjectDetail {
  id: string; slug: string; name: string;
  description: string | null;
  emirate: string; area: string | null;
  propertyType: string; status: string;
  launchDate: string | null;
  expectedCompletion: string | null;
  handoverDate: string | null;
  handoverQuarter: string | null;
  completionPct: number | null;
  totalUnits: number | null;

  pricing: {
    minPrice: number | null; maxPrice: number | null;
    currency: string;
    serviceChargePerSqft: number | null;  // AED/sqft/year
  };
  investment: {
    expectedGrossYieldPct: number | null; // PERCENT, e.g. 7 = 7%
    expectedAnnualRentAed: number | null;
    propertyManagement: string | null;
    rentalPolicy: string | null;
    investorEligibility: string | null;
    residencyVisaEligibility: string | null;
  };
  positioning: {
    luxuryTier: string | null;            // Standard|Premium|Luxury|UltraLuxury
    ownershipType: string | null;         // Freehold|Leasehold
    isBrandedResidence: boolean;
    brandedResidenceBrand: string | null;
    viewClassifications: string[];
    signaturePositioning: string | null;
  };

  amenities: string[];                    // display names, catalog order
  amenityDetails: { category: string; name: string; description: string | null }[];

  developer: {
    id: string; name: string; description: string | null;
    website: string | null;
    logoUrl: string | null; iconUrl: string | null;
    logoOnDark: boolean; iconOnDark: boolean;
    reraDeveloperNumber: string | null;
    establishedYear: number | null; headquarters: string | null;
    projectsDelivered: number | null; onTimeDeliveryPct: number | null;
    awards: string[];
  } | null;

  location: {
    latitude: number | null; longitude: number | null;
    addressLine: string | null; neighborhood: string | null;
    mapUrl: string | null;
  } | null;
  nearbyPlaces: {
    name: string; category: string;       // Metro|Mall|School|Hospital|Beach|…
    distanceKm: number | null; travelTimeMin: number | null;
    transportMode: string | null;
  }[];

  // Optional structure layer — join units to these by id for grouping.
  communities: {
    id: string; name: string; kind: string;   // Community|Cluster|Phase|Block
    description: string | null; luxuryTier: string | null;
    amenities: string[]; totalUnits: number | null; sortOrder: number;
  }[];
  towers: {
    id: string; communityId: string | null;
    name: string; floors: number | null; totalUnits: number | null;
    floorPricing: { floorFrom: number; floorTo: number; pricePerSqft: number; label: string | null }[];
  }[];

  unitsMode: "available" | "all" | "none";  // echoes the request
  unitCounts: {
    available: number | null;  // null ONLY in none mode (nothing fetched);
    reserved: number | null;   // populated only in all mode — null ≠ 0
    sold: number | null;       // populated only in all mode
  };
  units: Unit[];

  media: {
    id: string; type: string;   // Image|Render|FloorPlan|Masterplan|SitePlan|Video|Tour360|VirtualTour|Model3D|Drone|Brochure|Other
    title: string | null; caption: string | null;
    url: string;                // permanent proxy URL, or external (see §4)
    thumbnailUrl: string | null;
    provider: string | null; sortOrder: number;
  }[];
  documents: { id: string; title: string; type: string; url: string }[];

  paymentPlans: {
    id: string; name: string; planType: string; description: string | null;
    milestones: { label: string; percentage: number; triggerType: string; triggerValue: number | null }[];
    // triggerType: OnBooking | ConstructionPct | MonthsAfterBooking | OnHandover | MonthsAfterHandover
  }[];
  fees: {
    category: string;           // Registration|Maintenance|Mollak|Community|…
    label: string;
    amount: number | null;      // fixed AED — exactly one of amount/pctOfPrice is set
    pctOfPrice: number | null;  // PERCENT of purchase price, e.g. 4 = 4%
    frequency: string;          // OneTime|Monthly|Annual|PerSqft
    isOptional: boolean;
  }[];

  constructionMilestones: {
    title: string; status: string;        // Planned|InProgress|Completed|Delayed
    targetDate: string | null; completedDate: string | null;
    progressPct: number | null; note: string | null;
  }[];
  partners: { type: string; name: string; role: string | null; logoUrl: string | null; url: string | null }[];

  trust: {
    rera: {
      status: string;                     // Unverified|Pending|Verified|Failed|Expired
      reraNumber: string | null; registeredName: string | null;
      registrationDate: string | null; expiryDate: string | null;
      verifiedAt: string | null;
    } | null;
    escrow: {
      status: string; bankName: string | null;
      trusteeName: string | null; verifiedAt: string | null;
    } | null;
    permit: {
      number: string | null;
      liveness: string | null;            // see §5
      checkedAt: string | null;           // last DLD re-check
      attestedAt: string | null;          // seller's active-permit confirmation
      expiresAt: string | null;           // DLD End Date — show "Valid until …"
      qrImageUrl: string | null;          // generated QR, permanent URL
      verificationUrl: string | null;     // the DLD link the QR encodes
    };
  };
  createdAt: string; updatedAt: string;
}

interface Unit {
  id: string;
  towerId: string | null;       // join to towers[] for the building name
  communityId: string | null;   // join to communities[]
  unitNumber: string; floor: number | null;
  unitType: string;             // Studio|OneBed|TwoBed|ThreeBed|FourBedPlus|Penthouse|Townhouse|Villa
  bedrooms: number | null; bathrooms: number | null;
  sizeSqft: number | null;
  price: number | null; pricePerSqft: number | null; currency: string;
  status: string;               // Available|Reserved|Sold (never Held)
  view: string | null; orientation: string | null;
  furnishing: string | null;    // Unfurnished|SemiFurnished|FullyFurnished
  isPremium: boolean;
  isDistressSale: boolean;      // buyer-facing deal flags — render as badges
  isReadyVacant: boolean;
  smartHomeFeatures: string[]; sustainabilityFeatures: string[];
  materialsSpec: unknown | null;

  // The unit's OWN Trakheesi listing permit. null = no unit-level permit on
  // file; the project permit in trust.permit covers it. When advertising a
  // specific unit, show THIS permit if present, else the project's.
  permit: {
    number: string | null; liveness: string | null;
    checkedAt: string | null;
    verificationUrl: string | null; qrImageUrl: string | null;
  } | null;

  commercial: {                 // only for commercial stock, else null
    commercialType: string | null; fitOut: string | null;
    chillerFree: boolean; parkingSpaces: number | null; gfaSqft: number | null;
  } | null;
  plot: {                       // only for land stock, else null
    plotAreaSqft: number | null; permittedUse: string[];
    far: number | null; maxGfaSqft: number | null; permittedFloors: number | null;
  } | null;
  media: ProjectDetail["media"];  // unit-scoped floor plans/photos
}
```

---

## 4. Media & document URLs

Every image/PDF URL in a response is **permanent and cacheable**
(`Cache-Control: public, max-age=86400`) — safe to hotlink from statically
generated pages, or through `next/image` (add the API host to
`images.remotePatterns`). Notes:

- URLs are HMAC-protected paths under `/api/v1/media/…` on the base host —
  never construct or modify them; always use them verbatim.
- Some assets arrive as **external** URLs instead: video and 3D tours
  (Matterport/YouTube — embed directly, never `<img>`) and SVG floor plans
  (served from their original source). Treat any absolute URL uniformly.
- A media row you know exists but don't receive was withheld deliberately
  (unservable format with no usable source) — not data loss.

---

## 5. Permit `liveness` values

| value | meaning | render as |
|---|---|---|
| `alive` | DLD confirmed the permit active on the last nightly check | "Verified with DLD" |
| `unverified` | Checked, but DLD's page gave no machine-readable verdict (their normal behavior) — the seller's `attestedAt` confirmation applies | neutral / show attestation date |
| `unreachable` | DLD couldn't be reached at last check | neutral |
| `withdrawn` | DLD explicitly reported it dead | you will never see this — such listings are excluded |
| `null` | not yet checked (or, on units, no unit permit) | neutral |

Unit-level permits have **no `expiresAt`** by design — expiry is tracked at
the property level and an expired property leaves the feed entirely.

---

## 6. Next.js usage (App Router)

`.env` on YOUR site:

```bash
AMELIA_API_BASE=https://amelia.serenebay.ae
AMELIA_API_KEY=amk_…        # server-only — no NEXT_PUBLIC_ prefix, ever
AMELIA_ORG_KEY=…            # public org id, used by the register-interest form
```

Listing grid (ISR, revalidates every 5 minutes):

```tsx
// app/properties/page.tsx
async function getProjects(): Promise<{ data: ProjectCard[]; nextCursor: string | null }> {
  const res = await fetch(`${process.env.AMELIA_API_BASE}/api/v1/projects?limit=50`, {
    headers: { Authorization: `Bearer ${process.env.AMELIA_API_KEY}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Listing API ${res.status}`);
  return res.json();
}
```

Detail page:

```tsx
// app/properties/[slug]/page.tsx
async function getProject(slug: string): Promise<ProjectDetail | null> {
  const res = await fetch(
    `${process.env.AMELIA_API_BASE}/api/v1/projects/${encodeURIComponent(slug)}?includeUnits=all`,
    {
      headers: { Authorization: `Bearer ${process.env.AMELIA_API_KEY}` },
      next: { revalidate: 300 },
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Listing API ${res.status}`);
  return res.json();
}
```

(The `ProjectCard`/`ProjectDetail`/`Unit` interfaces in §2–3 are yours to
copy into your codebase.)

---

## 7. The buyer funnel from your listing pages

1. **"Create an account / Enquire" CTA** → deep-link into the verified signup
   with the property attached:

   ```
   https://amelia.serenebay.ae/buyer/signup?project=<slug>&utm_source=serenebay.ae&utm_medium=website
   ```

   The visitor verifies their email (WhatsApp code verification joins the
   same screen once the Meta template is approved), sets a password, and
   lands on that property inside the buyer portal — lead attributed
   (`source: partner_site`, UTMs, interested property).

2. **Direct property deep link** — `https://amelia.serenebay.ae/buyer/p/<slug>`.
   Bridges to the buyer portal's detail page; unauthenticated visitors go
   through login/signup and still arrive at the property. Unknown slugs land
   on the portal's project list, never a dead end.

3. **Register-interest form** (no account) → POST
   `https://amelia.serenebay.ae/api/leads/capture` with JSON:

   ```jsonc
   {
     "orgKey": "<AMELIA_ORG_KEY>",       // required
     "name": "…", "email": "…",          // both optional; email dedupes leads
     "phone": "…", "company": "…",
     "message": "…",
     "source": "serenebay_website",
     "projectSlug": "<slug>",            // attaches the interested property
     "utmSource": "serenebay.ae", "utmMedium": "website", "utmCampaign": "…",
     "marketingOptIn": true              // ONLY if your form showed an
                                         // unticked consent checkbox and the
                                         // visitor ticked it; omit otherwise
   }
   ```

   Repeat submissions for the same email update the interested property
   instead of duplicating the lead. IP rate-limited.

4. **Public brochure page** (no login, permit-compliant, shareable):
   `https://amelia.serenebay.ae/p/<slug>` — hero image, key facts, amenities,
   the permit QR labelled "Verify with DLD", a chat CTA, and a "View full
   details" button into the buyer portal.

---

## 8. Errors & edge cases, summarized

| situation | behavior |
|---|---|
| bad/missing key | `401 { error }` |
| over rate limit | `429` + `Retry-After` |
| malformed query | `400 { error, issues }` |
| unknown enum in a filter | empty `200` page (not an error) |
| unknown slug / draft / other org | `404 { error }` |
| server/database failure | honest `5xx` — keep your last good ISR page; never publish an empty catalog off a non-200 |
| unchanged content + `If-None-Match` | `304`, empty body |

---

## 9. Operational notes

- WhatsApp phone verification is currently **off** while Meta approves the
  authentication template; signup verifies email only. No action on your side
  when it flips on.
- The feed serves live data; your ISR window (300 s in the samples) is the
  only delay your visitors see.

---

## 10. Recent changes (what you may want to adopt)

**31 Aug 2026**
- Percentages are now **percentage numbers** (`expectedGrossYieldPct: 7`,
  `pctOfPrice: 4`). If you previously multiplied by 100 yourself, remove that.
- `trust.permit.expiresAt` added — render "Valid until …".
- Every property now carries the statutory DLD 4% registration fee in
  `fees[]` — render fees under your costs/holds section.
- Amenity names are clean full phrases now (commas inside a name no longer
  split it); long lists are worth truncating with a "+N more" affordance.

**30 Aug 2026**
- Property photos and developer logos populate for every property
  (`featuredImageUrl`, `images[]`, `developer.logoUrl`) — bind `logoUrl`
  wherever you show developers; availability counts are accurate.

**26 Aug 2026**
- Per-unit `permit` blocks; withdrawn/expired-permit units auto-excluded;
  Held never served; `ETag`/`304` support; `updatedSince` reliable for
  inventory changes; `trust.permit.checkedAt`/`attestedAt` added.
