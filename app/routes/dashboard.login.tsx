import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createAdminSession, isAdmin, verifyPassword } from "~/lib/auth.server";
import { SITE } from "~/lib/site";

export const handle = { headerTone: "light" as const };

export async function loader({ request }: LoaderFunctionArgs) {
  if (await isAdmin(request)) throw redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }
  return createAdminSession("/dashboard");
}

export default function DashboardLogin() {
  const data = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <div className="flex min-h-[80svh] items-center justify-center bg-ivory px-6 pt-24">
      <div className="w-full max-w-[380px]">
        <p className="type-eyebrow text-fog">{SITE.name}</p>
        <h1 className="type-headline mt-3">Submissions</h1>
        <p className="type-cap mt-2 text-fog">Sign in to manage enquiries.</p>
        <Form method="post" className="mt-8">
          <label htmlFor="pw" className="mb-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-fog">
            Password
          </label>
          <input
            id="pw"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="w-full border-b border-ink/25 bg-transparent py-2.5 text-[15.5px] outline-none transition-colors focus:border-b-2 focus:border-gold"
          />
          {data?.error && <p className="type-cap mt-2 text-brass">{data.error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="btn-platinum mt-6 w-full cursor-pointer px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </Form>
      </div>
    </div>
  );
}
