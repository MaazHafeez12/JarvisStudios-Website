# Jarvis Studios Website

![status](https://img.shields.io/badge/status-live%20in%20production-brightgreen)
![stack](https://img.shields.io/badge/stack-Next.js%20%2B%20Supabase-00ADEF)
![license](https://img.shields.io/badge/license-proprietary-black)

Marketing website rebuild for **Jarvis Studios**, a software agency offering web development, app development, SaaS builds, CRM implementation, and marketing/design services. The site's job is to communicate the studio's service lines, showcase real client work, and convert prospective clients into inbound inquiries.

> **Project status: live in production at [jarvisstudios.net](https://jarvisstudios.net)** as of 2026-08-20. The staged rollout in `docs/PRD.md` §9 is complete — the domain was moved from the previous site's Vercel project to this one (both were already on Vercel behind Cloudflare DNS, so no registrar or nameserver change was involved). The apex is canonical; `www` redirects to it. **The old Vercel project is retained, without the domain, as the rollback path** — do not delete it until this site has been stable through a full monitoring window. See [`TODO.md`](./TODO.md) (untracked, local) for what's still open.

## Documentation

Full context lives in [`/docs`](./docs) — read these before making product or architecture decisions:

| Doc | Purpose |
|---|---|
| [`docs/PRD.md`](./docs/PRD.md) | Product requirements — problem statement, target users, goals, MVP scope, success metrics, rollout plan |
| [`docs/TRD.md`](./docs/TRD.md) | Technical requirements — data models, API contracts, third-party integrations, performance/NFRs |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System diagrams, folder structure, key architectural decisions with rationale |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Brand system, typography, color, motion/animation system, page-by-page layout |
| [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md) | Design-level security review — auth, validation, CORS, rate limiting, secrets handling, OWASP Top 10 |

## Overview

- **No login/auth** — fully public marketing site.
- **One dynamic feature**: a contact form (`/api/leads`) that captures prospective-client inquiries, stores them in Supabase, and notifies the team by email (Resend) and Slack. Verified end-to-end against the live deployment.
- **Everything else is static** — all marketing pages are statically generated at build time from in-repo content (`content/`), not a CMS (deferred to a later phase per the PRD).
- **Work (case studies) and About (team bios) are honest placeholders** — the PRD calls for 2 real case studies and real team bios; that content doesn't exist yet, so those sections say so rather than showing fabricated content.

See [`docs/PRD.md`](./docs/PRD.md) §6 for the full MVP page list.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript, React 19 |
| Styling | Tailwind CSS |
| Animation | Motion (`motion/react`) for component-level interactions, CSS keyframes for the credibility marquee |
| Database | Supabase (Postgres) — single `leads` table for MVP |
| Backend logic | Next.js Route Handlers (no separate Express/Node server) |
| Hosting | Vercel |
| Email | Resend |
| Team notifications | Slack Incoming Webhook |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Analytics | Vercel Web Analytics + Speed Insights |
| Icons | [Lucide](https://lucide.dev) |
| Fonts | Inter (body/UI) + self-hosted Clash Display (headings) |

Full rationale for each choice is in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §4.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## Environment Variables

Per [`docs/TRD.md`](./docs/TRD.md) §9, all secrets are server-only — none are exposed to the client (`NEXT_PUBLIC_*`), since the app has no client-side Supabase usage in MVP.

| Variable | Used for |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase access (bypasses RLS — never expose to client) |
| `RESEND_API_KEY` | Sending lead-notification emails |
| `NOTIFICATION_EMAIL_TO` | Destination address for lead notifications |
| `RESEND_FROM_EMAIL` | Sender address for lead notifications — must be on a Resend-verified domain (see below) |
| `SLACK_WEBHOOK_URL` | Posting lead notifications to Slack |
| `UPSTASH_REDIS_REST_URL` | Rate limiting store for `/api/leads` |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting store for `/api/leads` |

`.env.example` documents this list with placeholder values. Never commit `.env.local` or any file containing real values (it's gitignored).

> **Environment scoping (updated 2026-08-20).** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `SLACK_WEBHOOK_URL` are scoped to **Production only**. Until this change, Preview shared them — meaning any form submission on any preview URL wrote to the production `leads` table and fired real email and Slack. That was documented here as "not a live risk" on the grounds that only `master` was pushed; the grounds expired when PRs entered the workflow (2026-08-06), and the stakes rose again when the domain went live (2026-08-20) and the table began holding real customer inquiries.
>
> **Consequence to expect:** `/api/leads` returns 500 on preview deployments — `getSupabaseServerClient()` throws and the route handler catches it. This is the intended failure mode, not a bug. Full isolation per `docs/SECURITY_AUDIT.md` finding #2 (a second Supabase project and separate Resend/Slack credentials scoped to Preview) is still unbuilt; see `TODO.md`.
>
> Note this project exposes **Preview and Production only** — there is no Development environment in the dashboard. Local development reads `.env.local` and is unaffected by Vercel scoping.

### Email deliverability (SPF / DKIM / DMARC)

Lead notifications are the only output of the only dynamic feature on this site, so where they come *from* matters. Until `RESEND_FROM_EMAIL` is set, the code falls back to `onboarding@resend.dev` — Resend's shared test address — and logs a warning on every send. That address needs no domain verification, which is exactly why it's wrong to ship: mail from it has no SPF or DKIM alignment for `jarvisstudios.net`, so receiving servers have nothing tying the message to this business, and notifications can be filtered as spam.

**DNS is already done** (verified by lookup 2026-09-21 — re-check before trusting this):

| Record | Value |
|---|---|
| `resend._domainkey` TXT | DKIM public key, published |
| `send` TXT | `v=spf1 include:amazonses.com ~all` |
| `send` MX | `feedback-smtp.ap-northeast-1.amazonses.com` (pri 10) |

The apex `v=spf1 include:_spf.mx.cloudflare.net ~all` is Cloudflare Email Routing for *receiving* and does not conflict — Resend's SPF lives on the `send` subdomain, and SPF alignment is relaxed by default, so it still aligns to the organizational domain.

What is still open:

1. **Confirm the domain reads "Verified" in the Resend dashboard.** The records existing is necessary, not sufficient.
2. **Add a DMARC record.** There is none, which means no policy and no visibility into who is sending as this domain:
   `_dmarc` TXT → `v=DMARC1; p=none; rua=mailto:dmarc@jarvisstudios.net`
   The `rua` address must be **on this domain**. RFC 7489 §7.1 requires an external destination to authorise reports via its own DNS record, and Gmail does not publish one — so `rua=mailto:...@gmail.com` gets silently dropped by strict reporters. Route `dmarc@jarvisstudios.net` to the real inbox with a Cloudflare Email Routing rule instead.
3. **Set `RESEND_FROM_EMAIL` in Vercel (Production scope)** to an address on the domain — e.g. `Jarvis Studios <leads@jarvisstudios.net>` — then **redeploy**, since env var changes do not apply to existing deployments.

Only step 3 is read by the code. Once DMARC has collected clean reports for a few weeks, tighten `p=none` → `p=quarantine` → `p=reject`; both DKIM and SPF align here, so the path to enforcement is unobstructed.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (statically generates marketing pages) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Lint the codebase |
| `npm test` | Run the unit tests once (CI mode) |
| `npm run test:watch` | Run the unit tests in watch mode |
| `npm run indexnow` | Submit the live sitemap's URLs to IndexNow (Bing); `-- --dry-run` prints them instead |

## Folder Structure

Full structure with per-file rationale is in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §3. Current layout:

```
app/                 # Next.js App Router — pages, app/api/leads route, opengraph-image, sitemap.ts, robots.ts
components/          # Nav, Footer, ContactForm, ProcessSteps, EngagementFacts
components/services/ # ServiceTour (homepage scroll tour), ServiceExplorer, ServiceVignette
components/ui/       # Logo, ThemeToggle, Reveal (scroll-reveal), Marquee
content/             # Typed, in-repo content (services, process steps, differentiators) — not a database
lib/                 # Types, validation, Supabase server client, notifications, rate limiting, sanitize
public/               # Static assets, self-hosted Clash Display font files
supabase/migrations/  # SQL migrations, checked into version control
.github/              # CI dependency-audit workflow, Dependabot config
```

## Security

See [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md) for the full design-level review. Key points preserved in implementation: Supabase RLS is enabled on `leads` with **zero public policies** (server-only writes via service role key), no CORS headers are added to `/api/leads` (same-origin only), all user input is sanitized before being interpolated into email/Slack notification content, and centralized security response headers (CSP, HSTS, X-Frame-Options, etc.) are set in `next.config.ts`.

## CI

Three workflows, kept separate so a red X says which kind of thing broke without anyone opening the logs:

| Workflow | Runs | What it answers |
|---|---|---|
| [`ci.yml`](./.github/workflows/ci.yml) | push to `master`, every PR | Does this change lint, pass tests, type-check, and build? |
| [`dependency-audit.yml`](./.github/workflows/dependency-audit.yml) | push to `master`, every PR, weekly | Are our dependencies safe? (`npm audit --audit-level=high`) |
| [`indexnow.yml`](./.github/workflows/indexnow.yml) | production deploy succeeded, or manually | Has Bing been told the URLs changed? (Google ignores IndexNow and uses the sitemap.) |

`.github/dependabot.yml` opens weekly update PRs for npm and GitHub Actions dependencies.

`next build` runs the TypeScript check as part of the build, so `ci.yml` covers compilation and types in one step. It needs no secrets — every marketing page is statically generated from in-repo content, and `/api/leads` is dynamic, so nothing that reads an env var executes at build time.

> **Note:** pushes to `master` still deploy to Vercel automatically. CI reports on the push but does not gate it — to make it a real gate, enable branch protection on `master` requiring the **Build and lint** check, and work through PRs.
