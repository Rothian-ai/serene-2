# Backend — the contact form, email, and the submissions dashboard

The site is server-rendered on Vercel (`ssr: true` + the Vercel preset); the
marketing pages are still prerendered to static HTML for speed and SEO, while
the form endpoint and dashboard run as server functions.

## How an enquiry flows

```
/contact  ──►  ContactForm  ──fetch──►  POST /api/submit ─┐
                    │                                     ├──►  processEnquiry()
                    └──native post──►  POST /contact  ────┘         │
                       (before hydration / JS off)                  ├──►  SMTP  (critical)
                                                                    └──►  Postgres (optional)
```

Both entry points call the same [`processEnquiry`](app/lib/enquiry.server.ts), so
they cannot drift apart.

**Email is the critical path; the database is best-effort.** An enquiry that
reached a human inbox has succeeded even if Postgres was unreachable. An enquiry
that only reached the database has *not* succeeded when SMTP was configured and
rejected it, because the visitor was promised a reply and nobody knows to make
one. The request succeeds when at least one durable sink accepted it, and returns
`502` when neither did — so a visitor is never thanked for a message that went
nowhere.

The native `POST /contact` path exists because `/contact` is prerendered: between
first paint and hydration the submit button is an ordinary one, so a fast
submitter (or anyone with JavaScript blocked) posts the form the old way.

## Required: SMTP

This is all the form needs. Set these in `.env` locally and in
**Vercel → Project → Settings → Environment Variables** for deploys.

| Variable | Notes |
|---|---|
| `SMTP_HOST` | e.g. `smtp.postmarkapp.com`, `smtp.sendgrid.net`, `smtp.office365.com` |
| `SMTP_PORT` | `587` for STARTTLS, `465` for implicit TLS |
| `SMTP_SECURE` | `"true"` **only** with port 465, `"false"` with 587 |
| `SMTP_USER` | mailbox or API user |
| `SMTP_PASS` | password or app-specific key |
| `MAIL_FROM` | e.g. `Serene <noreply@serene.com>` — **must be a sender the provider has authorised**, or sends are rejected even though auth succeeded |
| `MAIL_TO` | where enquiries land; comma-separate for several recipients |
| `MAIL_ACK` | `"true"` to also send the enquirer one courtesy acknowledgement. Off by default — the site promises no follow-up sequences, so this is a deliberate choice |

Verify before deploying:

```bash
npm run smtp:check
```

That connects and authenticates without sending anything. To send one real test
message:

```bash
npm run smtp:check -- you@example.com
```

It prints the host, port and user so a wrong port/secure pairing is obvious, and
never prints the password.

## Optional: submissions database

Leave `DATABASE_URL` empty and the form still works on SMTP alone — `/dashboard`
simply shows an explained empty state. To store enquiries as well:

1. Create a Neon project and copy both connection strings (Project → Connection
   Details): the **pooled** one (`…-pooler…`) and the **direct** one.
2. Set `DATABASE_URL` (pooled, app runtime) and `DIRECT_URL` (direct, migrations).
3. Create the table: `npx prisma db push`
4. Set `ADMIN_PASSWORD` and `SESSION_SECRET` to reach `/dashboard`.

The Prisma client is constructed lazily, so a deploy with no database never even
loads it.

> The Decap **content** CMS is at `/admin`; the **submissions** admin is at
> `/dashboard`, to avoid the collision.

## Abuse protection

- **Honeypot** — a `company` field positioned off-screen (not `display:none`,
  which some bots skip), hidden from assistive tech and out of tab order.
  Anything that fills it gets a `200` so the bot does not retry with variations.
- **Rate limit** — 5 submissions per IP per minute, held in memory. A warm
  serverless instance keeps the map; a cold one starts empty, so this is a speed
  bump rather than a real limiter. For more, put Vercel's WAF or a KV-backed
  counter in front of the route.
- **Validation and caps** on name, email and message length.
- **SMTP timeouts** (10s connect, 20s socket) so a stalled handshake fails fast
  instead of hanging the function until Vercel kills it.

## Deploying to Vercel

1. Import the repo. Vercel detects React Router; build command is `npm run build`.
2. Add the SMTP variables above (and the database ones if using it) under
   Settings → Environment Variables. Apply them to Production **and** Preview if
   you want the form working on preview deploys.
3. Redeploy after adding variables — they are read at runtime, but a build
   already in flight will not see them.
4. Submit the live form once and confirm the email arrives.

### Careful with empty values

An environment variable that *exists but is blank* is a real deployment case,
and it bites. `VITE_CONTACT_ENDPOINT` must be **absent or a real URL** — a blank
value used to make the form post to `""`, which resolves to the current page
instead of the endpoint. The code now trims and falls back with `||` rather than
`??`, but the same trap applies to any `VITE_*` variable you add: check for
emptiness, not just for `undefined`.

## Follow-ups

- `register-interest` and `careers` enquiry types are supported end to end by the
  endpoint, database and dashboard. Careers is currently a `mailto:` link, so it
  needs a small form posting to `/api/submit` with `type=careers` to feed the
  pipeline.
- Auth on `/dashboard` is a single shared password. For per-user logins, swap
  `auth.server.ts` for magic links (reuses the same SMTP) or an auth provider.
