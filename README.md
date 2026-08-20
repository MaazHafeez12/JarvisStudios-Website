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
| `SLACK_WEBHOOK_URL` | Posting lead notifications to Slack |
| `UPSTASH_REDIS_REST_URL` | Rate limiting store for `/api/leads` |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting store for `/api/leads` |

`.env.example` documents this list with placeholder values. Never commit `.env.local` or any file containing real values (it's gitignored).

> **Environment scoping (updated 2026-08-20).** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `SLACK_WEBHOOK_URL` are scoped to **Production only**. Until this change, Preview shared them — meaning any form submission on any preview URL wrote to the production `leads` table and fired real email and Slack. That was documented here as "not a live risk" on the grounds that only `master` was pushed; the grounds expired when PRs entered the workflow (2026-08-06), and the stakes rose again when the domain went live (2026-08-20) and the table began holding real customer inquiries.
>
> **Consequence to expect:** `/api/leads` returns 500 on preview deployments — `getSupabaseServerClient()` throws and the route handler catches it. This is the intended failure mode, not a bug. Full isolation per `docs/SECURITY_AUDIT.md` finding #2 (a second Supabase project and separate Resend/Slack credentials scoped to Preview) is still unbuilt; see `TODO.md`.
>
> Note this project exposes **Preview and Production only** — there is no Development environment in the dashboard. Local development reads `.env.local` and is unaffected by Vercel scoping.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (statically generates marketing pages) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Lint the codebase |

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

`.github/workflows/dependency-audit.yml` runs `npm audit --audit-level=high` on push/PR and weekly; `.github/dependabot.yml` opens weekly update PRs for npm and GitHub Actions dependencies. There is no build/lint/test CI gate yet — pushes go straight to `master`, which Vercel auto-deploys.
