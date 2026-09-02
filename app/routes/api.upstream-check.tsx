import type { LoaderFunctionArgs } from "react-router";

/**
 * TEMPORARY diagnostic — times the catalogue upstream from inside this
 * runtime, where renders report ~10s per call while the same endpoints
 * answer in well under a second from everywhere else. Measures DNS-included
 * connection setup vs response time by calling each base twice on one
 * process (first call pays connection setup; second reuses the socket).
 * No secrets: hits only the public, unauthenticated /api/version.
 * Remove once the stall is attributed.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "ht-perf") {
    throw new Response("Not Found", { status: 404 });
  }
  const bases = [
    "https://amelia.serenebay.ae",
    "https://amelia.rothian.com",
  ];
  const results: Record<string, unknown> = {
    configuredBase: (process.env.AMELIA_API_BASE?.trim() || "(default)").replace(/\/+$/, ""),
    region: process.env.VERCEL_REGION ?? null,
  };
  for (const base of bases) {
    const runs: number[] = [];
    let error: string | null = null;
    for (let i = 0; i < 2; i++) {
      const t0 = Date.now();
      try {
        const res = await fetch(`${base}/api/version`, { signal: AbortSignal.timeout(20_000) });
        await res.text();
        runs.push(Date.now() - t0);
      } catch (err) {
        error = err instanceof Error ? err.message : String(err);
        runs.push(Date.now() - t0);
      }
    }
    results[base] = { firstMs: runs[0], secondMs: runs[1], error };
  }
  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
