import { data, Form, Link, useLoaderData, useSearchParams } from "react-router";
import type { HeadersArgs, LoaderFunctionArgs } from "react-router";
import { Eyebrow, Reveal, RevealGroup, RevealItem, Section } from "~/components/primitives";
import { SplitHeading } from "~/components/SplitHeading";
import { PropertyCard } from "~/components/property";
import { AmeliaError, fetchProjects, isAmeliaConfigured } from "~/lib/amelia.server";
import { meta as buildMeta } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export function meta() {
  return buildMeta({
    title: "Properties",
    description:
      "The register of off-plan developments Serene presents in Dubai and Abu Dhabi: pricing, handover, payment plans and permit details, published from the record.",
    path: "/properties",
  });
}

/**
 * Two cache lifetimes, chosen by the loader.
 *
 * A good response is worth holding at the edge for five minutes (this stack's
 * equivalent of the guide's Next `revalidate: 300`). A failure is not: caching
 * it would pin one upstream timeout in front of every visitor for the full five
 * minutes, long after the catalogue recovered. Failures get seconds instead, so
 * the next request re-tries almost immediately.
 */
const FRESH = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
const BRIEF = "public, max-age=0, s-maxage=15";

export function headers({ loaderHeaders }: HeadersArgs) {
  return { "Cache-Control": loaderHeaders.get("Cache-Control") ?? FRESH };
}

export async function loader({ request }: LoaderFunctionArgs) {
  // No key configured (a fresh clone, or a preview without env) must render an
  // explained page, never a 500.
  if (!isAmeliaConfigured()) {
    return data(
      { state: "unconfigured" as const, projects: [], nextCursor: null, error: null },
      { headers: { "Cache-Control": BRIEF } },
    );
  }
  const p = new URL(request.url).searchParams;
  try {
    const projects = await fetchProjects(
      {
        limit: 48,
        cursor: p.get("cursor"),
        area: p.get("area"),
        propertyType: p.get("type"),
        status: p.get("status"),
        minPrice: p.get("minPrice") ? Number(p.get("minPrice")) : null,
        maxPrice: p.get("maxPrice") ? Number(p.get("maxPrice")) : null,
      },
      request.signal,
    );
    const nextCursor = projects.nextCursor;
    return data(
      { state: "ok" as const, projects: projects.data, nextCursor, error: null },
      { headers: { "Cache-Control": FRESH } },
    );
  } catch (err) {
    // A listing outage is not a broken site: keep the page, explain the gap.
    const error =
      err instanceof AmeliaError ? err.message : "The listing service is unavailable.";
    return data(
      { state: "error" as const, projects: [], nextCursor: null, error },
      { headers: { "Cache-Control": BRIEF } },
    );
  }
}

export default function Properties() {
  const { state, projects, nextCursor, error } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();

  const next = new URLSearchParams(params);
  if (nextCursor) next.set("cursor", nextCursor);
  const filtered = ["area", "type", "status", "minPrice", "maxPrice"].some((k) => params.get(k));

  return (
    <>
      <Section className="pt-40">
        <Reveal exit>
          <Eyebrow className="text-fog">The Register</Eyebrow>
        </Reveal>
        <SplitHeading as="h1" className="type-display mt-6 max-w-[20ch]">
          Every address, on the record.
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="type-body-lg mt-6 max-w-[54ch] text-ink/70">
            Pricing, handover, payment terms and permit details as the developers file them.
            Nothing is presented without a valid Trakheesi permit, so what you read here is what
            is lawful to sell.
          </p>
        </Reveal>
      </Section>

      {state === "ok" && (
        <Section className="pt-0">
          {/* A GET form: filters live in the URL, so any result set can be
              linked, bookmarked and re-rendered on the server. */}
          <Form method="get" className="flex flex-wrap items-end gap-4 border-y border-ink/12 py-5">
            <div className="flex flex-col">
              <label htmlFor="f-area" className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Area</label>
              <input id="f-area" type="search" name="area" defaultValue={params.get("area") ?? ""}
                placeholder="Dubai Marina…"
                className="w-[190px] border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="f-type" className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Type</label>
              <input id="f-type" type="search" name="type" defaultValue={params.get("type") ?? ""}
                placeholder="Apartment…"
                className="w-[160px] border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="f-min" className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Price from (AED)</label>
              <input id="f-min" type="number" inputMode="numeric" min="0" step="100000" name="minPrice"
                defaultValue={params.get("minPrice") ?? ""} placeholder="1000000"
                className="w-[150px] border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="f-max" className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Price to (AED)</label>
              <input id="f-max" type="number" inputMode="numeric" min="0" step="100000" name="maxPrice"
                defaultValue={params.get("maxPrice") ?? ""} placeholder="5000000"
                className="w-[150px] border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold" />
            </div>
            <button className="cursor-pointer bg-ink px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ivory">
              Filter
            </button>
            {filtered && (
              <Link to="/properties" className="type-cap self-center text-brass underline underline-offset-2">Clear</Link>
            )}
          </Form>
        </Section>
      )}
      <Section className="pt-0">
        {state === "unconfigured" && (
          <div className="border border-ink/18 p-8">
            <p className="type-title">The register is being connected.</p>
            <p className="mt-3 max-w-[52ch] text-[15.5px] text-ink/75">
              Listings are served from Amelia's catalogue. Once the credentials are in place this
              page fills itself, with no content copied across by hand.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="border border-ink/18 p-8" role="status">
            <p className="type-title">The register is briefly unavailable.</p>
            <p className="mt-3 max-w-[52ch] text-[15.5px] text-ink/75">{error}</p>
            <p className="type-cap mt-4 text-fog">
              Nothing is lost. Try again shortly, or{" "}
              <Link to="/contact" className="text-brass underline underline-offset-2">
                ask an advisor
              </Link>
              .
            </p>
          </div>
        )}

        {/* Two different nothings, and they were saying the same sentence.
            "Nothing matches that yet" is only true if the visitor asked for
            something; on a bare visit it blames them for a catalogue that has
            nothing published in it. */}
        {state === "ok" && projects.length === 0 && (
          <div className="border border-ink/18 p-8">
            {filtered ? (
              <>
                <p className="type-title">Nothing matches that yet.</p>
                <p className="mt-3 text-[15.5px] text-ink/75">
                  <Link to="/properties" className="text-brass underline underline-offset-2">
                    Clear the filters
                  </Link>{" "}
                  to see the whole register.
                </p>
              </>
            ) : (
              <>
                <p className="type-title">No addresses are published yet.</p>
                <p className="mt-3 max-w-[54ch] text-[15.5px] text-ink/75">
                  The register is served live from Amelia's catalogue, so this page fills itself the
                  moment a permitted project is published. Nothing is listed here without a valid
                  Trakheesi permit.
                </p>
                <p className="mt-5 text-[15.5px] text-ink/75">
                  An advisor can tell you what is coming before it appears.{" "}
                  <Link to="/contact" className="text-brass underline underline-offset-2">
                    Ask one
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <>
            <RevealGroup className="grid gap-10 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3">
              {projects.map((p) => (
                <RevealItem key={p.id}>
                  <PropertyCard project={p} />
                </RevealItem>
              ))}
            </RevealGroup>
            {nextCursor && (
              <div className="mt-14 flex justify-center">
                <Link
                  to={`/properties?${next}`}
                  className="border border-ink/35 px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
                >
                  More addresses
                </Link>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}
