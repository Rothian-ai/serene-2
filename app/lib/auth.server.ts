import { createCookieSessionStorage, redirect } from "react-router";

/**
 * Minimal admin auth: a single shared password (ADMIN_PASSWORD) gates the
 * /dashboard area, backed by a signed HttpOnly cookie session. Set
 * ADMIN_PASSWORD and SESSION_SECRET in .env / Vercel.
 */
const SESSION_SECRET =
  process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";

const storage = createCookieSessionStorage({
  cookie: {
    name: "serene_admin",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secrets: [SESSION_SECRET],
  },
});

export async function isAdmin(request: Request): Promise<boolean> {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.get("admin") === true;
}

/** Throws a redirect to the login page when not authenticated. */
export async function requireAdmin(request: Request): Promise<void> {
  if (!(await isAdmin(request))) {
    throw redirect("/dashboard/login");
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function createAdminSession(redirectTo = "/dashboard") {
  const session = await storage.getSession();
  session.set("admin", true);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) },
  });
}

export async function destroyAdminSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/dashboard/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
