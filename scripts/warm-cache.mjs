/**
 * Warm the CDN in front of the property catalogue.
 *
 * Amelia answers a project detail in about ten seconds. Our edge cache hides
 * that — a warm entry serves in ~50ms, and `stale-while-revalidate` keeps
 * serving instantly for a day while it refreshes behind the visitor. The ten
 * seconds is only ever paid on an entry that does not exist yet.
 *
 * Which is exactly what a visitor hits when they click a property nobody has
 * clicked recently, and there are nineteen of them. So: fetch every entry once,
 * on a schedule and after every deploy, and no visitor is the one who pays.
 *
 * Two URLs per property, because they are two cache entries. A hard load or a
 * crawler fetches the document; a click inside the site fetches
 * `/properties/<slug>.data`, which is what React Router asks for and what makes
 * a click feel slow. Warming only the document would leave the common case cold.
 *
 * Read-only: every request is a GET, and nothing here can create a lead or
 * change a record.
 *
 *   node scripts/warm-cache.mjs [baseUrl]
 */

const BASE = (process.argv[2] || process.env.WARM_BASE || "https://www.serenebay.ae").replace(/\/+$/, "");
const CONCURRENCY = Number(process.env.WARM_CONCURRENCY) || 4;
const UA = {
  // identify ourselves rather than pretending to be a browser
  "user-agent": "serene-cache-warmer (+https://www.serenebay.ae)",
};

async function get(path) {
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, { headers: UA, redirect: "follow" });
    await res.arrayBuffer(); // drain, so the timing covers the whole body
    return {
      path,
      status: res.status,
      ms: Date.now() - started,
      cache: res.headers.get("x-vercel-cache") ?? "-",
      amelia: Number(/amelia;dur=(\d+)/.exec(res.headers.get("server-timing") ?? "")?.[1] ?? 0),
    };
  } catch (err) {
    return { path, status: 0, ms: Date.now() - started, cache: "-", amelia: 0, error: String(err?.message ?? err) };
  }
}

/** Run `jobs` with at most `limit` in flight, preserving order in the result. */
async function pool(jobs, limit) {
  const out = new Array(jobs.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, jobs.length) }, async () => {
      while (next < jobs.length) {
        const i = next++;
        out[i] = await jobs[i]();
      }
    }),
  );
  return out;
}

const list = await get("/properties");
if (list.status !== 200) {
  console.error(`  /properties returned ${list.status}${list.error ? ` (${list.error})` : ""} — nothing to warm.`);
  process.exit(1);
}

const html = await fetch(`${BASE}/properties`, { headers: UA }).then((r) => r.text());
const slugs = [...new Set([...html.matchAll(/\/properties\/([a-z0-9-]+)"/g)].map((m) => m[1]))];
console.log(`  ${BASE}  ${slugs.length} properties  (list: ${list.ms}ms, ${list.cache})\n`);

if (!slugs.length) {
  console.error("  No property slugs on the page. The catalogue may be empty; nothing warmed.");
  process.exit(1);
}

const paths = slugs.flatMap((s) => [`/properties/${s}`, `/properties/${s}.data`]);
const results = await pool(paths.map((p) => () => get(p)), CONCURRENCY);

console.log("  path                                             status     time   edge     amelia");
for (const r of results) {
  console.log(
    `  ${r.path.slice(0, 48).padEnd(50)}${String(r.status).padStart(4)}` +
      `${String(r.ms + "ms").padStart(9)}  ${r.cache.padEnd(8)}` +
      `${(r.amelia ? r.amelia + "ms" : "-").padStart(8)}${r.error ? "  " + r.error : ""}`,
  );
}

const failed = results.filter((r) => r.status !== 200);
const cold = results.filter((r) => r.status === 200 && r.cache !== "HIT" && r.cache !== "STALE");
const slowest = Math.max(...results.map((r) => r.ms));
console.log(
  `\n  ${results.length} entries, ${cold.length} were cold and are now warm, ` +
    `${failed.length} failed, slowest ${slowest}ms.`,
);

// Slow is the point of the exercise, not a failure. A non-200 is a failure.
if (failed.length) {
  console.error(`  ${failed.length} request(s) did not return 200.`);
  process.exit(1);
}
