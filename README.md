# Jarvis Studios Website

![status](https://img.shields.io/badge/status-pre--implementation-lightgrey)
![stack](https://img.shields.io/badge/stack-Next.js%20%2B%20Supabase-00ADEF)
![license](https://img.shields.io/badge/license-proprietary-black)

Marketing website rebuild for **Jarvis Studios**, a software agency offering web development, app development, SaaS builds, CRM implementation, and marketing/design services. The site's job is to communicate the studio's service lines, showcase real client work, and convert prospective clients and investors/partners into inbound inquiries.

> **Project status: pre-implementation.** This repository currently contains planning documentation only — no application code has been scaffolded yet. Sections below describe the *planned* setup and structure per [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md); they will become accurate, runnable instructions once the project is scaffolded.

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
- **One dynamic feature**: a contact form (`/api/leads`) that captures prospective-client and investor/partner inquiries, stores them in Supabase, and notifies the team by email (Resend) and Slack.
- **Everything else is static** — service pages, case studies, and about/investor content are statically generated at build time from in-repo content, not a CMS (deferred to a later phase per the PRD).

See [`docs/PRD.md`](./docs/PRD.md) §6 for the full MVP page list.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) — single `leads` table for MVP |
| Backend logic | Next.js Route Handlers (no separate Express/Node server) |
| Hosting | Vercel |
| Email | Resend |
| Team notifications | Slack Incoming Webhook |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Icons | [Lucide](https://lucide.dev) |
| Fonts | Inter (body/UI) + Clash Display (headings) |

Full rationale for each choice is in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §4.

## Setup (planned)

Not yet runnable — no `package.json` exists in this repository. Once the project is scaffolded, setup is expected to be:

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## Environment Variables (planned)

Per [`docs/TRD.md`](./docs/TRD.md) §9, all secrets are server-only — none are exposed to the client (`NEXT_PUBLIC_*`), since the app has no client-side Supabase usage in MVP. Production and Preview/Development environments **must use separate values**, pointing at separate Supabase projects and separate Resend/Slack credentials, per the [security audit](./docs/SECURITY_AUDIT.md) finding #2.

| Variable | Used for |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase access (bypasses RLS — never expose to client) |
| `RESEND_API_KEY` | Sending lead-notification emails |
| `NOTIFICATION_EMAIL_TO` | Destination address for lead notifications |
| `SLACK_WEBHOOK_URL` | Posting lead notifications to Slack |
| `UPSTASH_REDIS_REST_URL` | Rate limiting store for `/api/leads` |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting store for `/api/leads` |

A committed `.env.example` (placeholder values only) will document this list once scaffolded. Never commit `.env.local` or any file containing real values.

## Scripts (planned)

Standard Next.js scripts are expected once scaffolded:

| Script | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (statically generates marketing pages) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Lint the codebase |

## Folder Structure (planned)

Full structure with per-file rationale is in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) §3. Summary:

```
app/                # Next.js App Router — pages + the one API route (app/api/leads)
components/         # Reusable UI components (ContactForm, Nav, Footer, cards, ui/ primitives)
content/            # Typed, in-repo content (services, case studies, team) — not a database
lib/                # Types, validation, Supabase server client, notifications, rate limiting
public/             # Static assets
supabase/migrations/ # SQL migrations, checked into version control
```

## Security

See [`docs/SECURITY_AUDIT.md`](./docs/SECURITY_AUDIT.md) for the full design-level review. Key points to preserve during implementation: Supabase RLS is enabled on `leads` with **zero public policies** (server-only writes via service role key), no CORS headers are added to `/api/leads` (same-origin only), and all user input is sanitized before being interpolated into email/Slack notification content.
