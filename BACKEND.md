# Backend (Vercel + Neon + SMTP + admin dashboard)

This branch (`vercel-backend`) adds server-side features on top of the site. It
switches the app from static (`ssr: false`) to **Vercel server rendering**
(`ssr: true` + the Vercel preset); marketing pages are still prerendered.

## What's here

- **Submissions database** — Prisma + Postgres (Neon). Model in
  [`prisma/schema.prisma`](prisma/schema.prisma): a single `Submission` table
  with `type` (contact / register-interest / careers) and `status`
  (new / in_progress / contacted / closed / archived).
- **Enquiry endpoint** — [`app/routes/api.submit.tsx`](app/routes/api.submit.tsx):
  `POST /api/submit` validates, persists, and emails. The contact form posts here.
- **Email on submit** — [`app/lib/email.server.ts`](app/lib/email.server.ts):
  nodemailer over SMTP. Skipped (logged) if SMTP env is absent.
- **Admin dashboard** — [`/dashboard`](app/routes/dashboard.tsx): table of
  submissions with search, status + type filters, sortable columns, and inline
  status editing. Gated by a password + cookie session
  ([`/dashboard/login`](app/routes/dashboard.login.tsx)).
  > Note: the Decap **content** CMS lives at `/admin`; this **submissions**
  > admin is at `/dashboard` to avoid the collision.

## Setup

1. **Create a Neon project** (neon.tech) and copy both connection strings
   (Project → Connection Details): the **pooled** one (`…-pooler…`) and the
   **direct** one.
2. **Env** — copy `.env.example` → `.env` and fill in:
   - `DATABASE_URL` (pooled), `DIRECT_URL` (direct)
   - `ADMIN_PASSWORD`, `SESSION_SECRET`
   - `SMTP_*`, `MAIL_FROM`, `MAIL_TO`
3. **Create the table:**
   ```bash
   npx prisma db push       # or: npx prisma migrate dev --name init
   ```
4. **Run:** `npm run dev` → visit `/contact` (submit) and `/dashboard` (manage).

## Deploy to Vercel

- Import the repo; Vercel auto-detects React Router. Build: `npm run build`.
- Add the same env vars in **Project → Settings → Environment Variables**.
- Run `prisma db push` / `migrate deploy` against the production DB (or add it to
  the build step). Neon works out of the box with Vercel.

## Notes / follow-ups

- **Forms wired:** the **contact** form posts to `/api/submit` (`type=contact`).
  The endpoint, DB, and dashboard already support `register-interest` and
  `careers`; those entry points are currently CTA links / `mailto`, so they need
  a small form to feed the pipeline — drop a `<form>` (or reuse `ContactForm`
  with hidden `type`/`context`) posting to `/api/submit`. Easy to add on request.
- Auth is a single shared password. For per-user logins later, swap
  `auth.server.ts` for magic-link (reuses SMTP) or an auth provider.
