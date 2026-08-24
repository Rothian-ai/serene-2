import { Form, Link, useLoaderData, useSearchParams, useSubmit } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import type { Prisma } from "@prisma/client";
import { destroyAdminSession, requireAdmin } from "~/lib/auth.server";
import { dbConfigured, getPrisma } from "~/lib/db.server";
import { SITE } from "~/lib/site";

export const handle = { headerTone: "light" as const };

const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED", "ARCHIVED"] as const;
const TYPES = ["CONTACT", "REGISTER_INTEREST", "CAREERS"] as const;
const SORTABLE = ["createdAt", "name", "email", "type", "status"] as const;

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const url = new URL(request.url);
  const p = url.searchParams;
  const q = (p.get("q") ?? "").trim();
  const status = p.get("status") ?? "";
  const type = p.get("type") ?? "";
  const sort = (SORTABLE as readonly string[]).includes(p.get("sort") ?? "")
    ? (p.get("sort") as (typeof SORTABLE)[number])
    : "createdAt";
  const dir = p.get("dir") === "asc" ? "asc" : "desc";

  const where: Prisma.SubmissionWhereInput = {};
  if (status && (STATUSES as readonly string[]).includes(status))
    where.status = status as (typeof STATUSES)[number];
  if (type && (TYPES as readonly string[]).includes(type))
    where.type = type as (typeof TYPES)[number];
  if (q)
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
      { context: { contains: q, mode: "insensitive" } },
    ];

  // The database is optional — the contact form works on SMTP alone. Render an
  // explained empty state rather than a 500 when it is absent OR unreachable.
  // Both matter: DATABASE_URL can be set on the host while Prisma still fails
  // to load or connect, and a broken dashboard must not be a broken site.
  const empty = {
    submissions: [] as Prisma.SubmissionGetPayload<{}>[],
    counts: {} as Record<string, number>,
    q, status, type, sort, dir, noDatabase: true,
  };
  if (!dbConfigured()) return empty;

  try {
    const prisma = await getPrisma();
    const [submissions, grouped] = await Promise.all([
      prisma.submission.findMany({ where, orderBy: { [sort]: dir }, take: 500 }),
      prisma.submission.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count._all]));
    return { submissions, counts, q, status, type, sort, dir, noDatabase: false };
  } catch (err) {
    console.error("[dashboard] database unavailable, showing empty state:", err);
    return empty;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const form = await request.formData();
  const intent = form.get("intent");
  if (intent === "logout") return destroyAdminSession(request);
  if (intent === "status") {
    const id = String(form.get("id"));
    const status = String(form.get("status"));
    if (dbConfigured() && (STATUSES as readonly string[]).includes(status)) {
      try {
        const prisma = await getPrisma();
        await prisma.submission.update({
          where: { id },
          data: { status: status as (typeof STATUSES)[number] },
        });
      } catch (err) {
        console.error("[dashboard] status update failed:", err);
      }
    }
  }
  return null;
}

const titleCase = (s: string) => s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Dashboard() {
  const { submissions, counts, q, status, type, sort, dir, noDatabase } =
    useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const submit = useSubmit();

  const sortLink = (field: string) => {
    const next = new URLSearchParams(params);
    const nextDir = sort === field && dir === "asc" ? "desc" : "asc";
    next.set("sort", field);
    next.set("dir", nextDir);
    return `?${next.toString()}`;
  };
  const arrow = (field: string) => (sort === field ? (dir === "asc" ? " ↑" : " ↓") : "");

  const total = Object.values(counts).reduce((a, b) => a + (b as number), 0);

  return (
    <div className="min-h-screen bg-ivory pt-24 text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/12 pb-5">
          <div>
            <p className="type-eyebrow text-fog">{SITE.name}</p>
            <h1 className="type-headline mt-2">Submissions</h1>
            <p className="type-cap mt-1 text-fog">
              {total} total · New {counts.NEW ?? 0} · In progress {counts.IN_PROGRESS ?? 0} · Closed{" "}
              {counts.CLOSED ?? 0}
            </p>
          </div>
          <Form method="post">
            <button
              name="intent"
              value="logout"
              className="cursor-pointer border border-ink/30 px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-fog hover:border-ink hover:text-ink"
            >
              Sign out
            </button>
          </Form>
        </div>

        {/* filters — GET form; selects auto-submit, text on enter */}
        <Form method="get" className="mt-6 flex flex-wrap items-end gap-3" onChange={(e) => submit(e.currentTarget)}>
          <div className="flex flex-col">
            <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Search</label>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="name, email, message…"
              className="w-[220px] border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Status</label>
            <select name="status" defaultValue={status} className="border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold">
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{titleCase(s)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-fog">Type</label>
            <select name="type" defaultValue={type} className="border border-ink/20 bg-white px-3 py-2 text-[14px] outline-none focus:border-gold">
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{titleCase(t)}</option>
              ))}
            </select>
          </div>
          {/* keep current sort when filtering */}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="dir" value={dir} />
          <button className="cursor-pointer bg-ink px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ivory">
            Apply
          </button>
          {(q || status || type) && (
            <Link to="/dashboard" className="type-cap self-center text-brass underline underline-offset-2">
              Clear
            </Link>
          )}
        </Form>

        {/* table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-ink/20 text-left text-[10.5px] uppercase tracking-[0.1em] text-fog">
                <th className="py-3 pr-4"><Link to={sortLink("createdAt")}>Date{arrow("createdAt")}</Link></th>
                <th className="py-3 pr-4"><Link to={sortLink("type")}>Type{arrow("type")}</Link></th>
                <th className="py-3 pr-4"><Link to={sortLink("name")}>Name{arrow("name")}</Link></th>
                <th className="py-3 pr-4"><Link to={sortLink("email")}>Email{arrow("email")}</Link></th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Message</th>
                <th className="py-3 pr-4">Source</th>
                <th className="py-3 pr-4"><Link to={sortLink("status")}>Status{arrow("status")}</Link></th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-fog">
                    {noDatabase ? (
                      <span className="mx-auto block max-w-[60ch] text-left">
                        <strong className="text-ink">No submissions database is configured.</strong>{" "}
                        The contact form still works — enquiries are emailed to{" "}
                        <code>MAIL_TO</code> over SMTP. To store them here as well, set{" "}
                        <code>DATABASE_URL</code> and <code>DIRECT_URL</code>, then run{" "}
                        <code>npx prisma db push</code>.
                      </span>
                    ) : (
                      "No submissions match."
                    )}
                  </td>
                </tr>
              )}
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-ink/10 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap text-fog">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{titleCase(s.type)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap font-medium">{s.name}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <a href={`mailto:${s.email}`} className="text-brass hover:underline">{s.email}</a>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-fog">{s.phone ?? "—"}</td>
                  <td className="max-w-[320px] py-3 pr-4 text-ink/75">{s.message ?? "—"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-fog">{s.context ?? s.source ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <Form method="post" onChange={(e) => submit(e.currentTarget)}>
                      <input type="hidden" name="intent" value="status" />
                      <input type="hidden" name="id" value={s.id} />
                      <select
                        name="status"
                        defaultValue={s.status}
                        className="border border-ink/20 bg-white px-2 py-1.5 text-[13px] outline-none focus:border-gold"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>{titleCase(st)}</option>
                        ))}
                      </select>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 type-cap text-fog">Showing up to 500 rows.</p>
      </div>
    </div>
  );
}
