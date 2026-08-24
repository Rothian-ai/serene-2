import type { ActionFunctionArgs } from "react-router";
import { processEnquiry } from "~/lib/enquiry.server";

/**
 * POST /api/submit — the JSON enquiry endpoint the contact form's fetch() calls.
 *
 * A thin wrapper: all the logic lives in `~/lib/enquiry.server` so this and the
 * /contact route action (the no-JavaScript fallback) cannot drift apart. Runs as
 * a Vercel server function, so it is available even though the marketing pages
 * are prerendered.
 */
export async function action({ request }: ActionFunctionArgs) {
  const result = await processEnquiry(request);
  const { status, ...body } = result;
  return Response.json(body, { status });
}

/** A GET here is almost always someone poking the URL — say so plainly. */
export async function loader() {
  return Response.json({ ok: false, error: "POST an enquiry to this endpoint." }, { status: 405 });
}
