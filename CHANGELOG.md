# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/) once versioned releases begin.

## [Unreleased]

### Added
- Project scaffold: Next.js 16 (App Router) + TypeScript + Tailwind CSS, initialized per `docs/ARCHITECTURE.md`. Includes root layout with dark/light theme initialization (no-flash, `prefers-color-scheme`-aware), brand color/typography tokens from `docs/DESIGN.md` wired into Tailwind config and CSS custom properties, and centralized security response headers (CSP, HSTS, X-Frame-Options, etc.) in `next.config.ts` per `docs/SECURITY_AUDIT.md` finding #4.
- `.env.example` documenting all planned environment variables (Supabase, Resend, Slack, Upstash) per `docs/TRD.md` §9.
- `.claude/launch.json` dev server config for local preview.
- Global layout shell: `Nav` (desktop + mobile menu, theme toggle, "Start a project" CTA) and `Footer` (service/company links, contact email), wired into `app/layout.tsx` around every page per `docs/DESIGN.md` §7.
- `Logo` component: contains the current `logo.svg` brand asset in a fixed-size rounded box (interim fix per `docs/DESIGN.md` §2.1, since the source file isn't safely editable — see that section for why) and `ThemeToggle`, both under `components/ui/`.
- Stub pages for `/services`, `/work`, `/about`, `/investors`, `/contact` so navigation is fully clickable ahead of each page's real content.
- Contact form (`components/ContactForm.tsx`) and `POST /api/leads` Route Handler implementing the full contract from `docs/TRD.md` §5: client/investor type selector, server-side validation as the source of truth, honeypot bot-trap (silently returns a fake success rather than revealing detection), Upstash Redis-backed rate limiting (5/IP/hour), Supabase insert via the service-role-only server client, and best-effort concurrent Resend + Slack notifications that never block or fail the response once the lead is saved. Shared `lib/types/lead.ts` and `lib/validation/lead.ts` keep client and server validation in sync per `docs/ARCHITECTURE.md` §4.5. `lib/sanitize.ts` escapes all lead fields before they're interpolated into the email/Slack templates per `docs/SECURITY_AUDIT.md` finding #3.
- `supabase/migrations/0001_create_leads_table.sql` — the `leads` table DDL with RLS enabled and zero public policies, per `docs/TRD.md` §4.3.
- Verified in-browser against the real (unconfigured) backend: client-side validation errors, the honeypot's stealth 200 response, and the graceful 500 + generic retry message shown when Supabase/Upstash aren't configured — confirming the "lead insert is the only thing that can fail the request" reliability contract holds even under real failure conditions.
- Real homepage content per `docs/DESIGN.md` §6.1: staggered hero entrance, service summary grid (`content/services.ts`, `ServiceCard`), credibility marquee, featured case study teaser, deliberately lower-emphasis investor callout, and a final CTA band. `Reveal` (Motion `whileInView`) and `Marquee` (CSS keyframes, respects `prefers-reduced-motion`) added as reusable scroll-reveal primitives per `docs/DESIGN.md` §3.
- Services page (`docs/DESIGN.md` §6.2): interactive numbered process sequence (`ProcessSteps`, `content/process.ts`) and 5 alternating service blocks (`ServiceBlock`) with concrete per-service capabilities (`content/services.ts` expanded), each anchor-linked from the homepage/footer.
- About page (`docs/DESIGN.md` §6.4): mission statement and 3 "why Jarvis Studios" differentiator blocks (`content/differentiators.ts`). Team bios are intentionally left as an honest placeholder rather than fabricated — that's factual content about real people, not marketing copy, so it needs real input before it can ship.
- Investors page (`docs/DESIGN.md` §6.5): deliberately lower-key visual treatment and a distinct "Request investor info" CTA (outline style, not the primary brand-blue button) linking to `/contact?type=investor`.
- Work page: honest "coming soon" placeholder rather than fabricated case studies — the PRD specifies 2 real case studies with actual client details, which don't exist yet (tracked as an open question in `docs/TRD.md`).
- `ContactForm` now reads `?type=` from the URL to pre-select client vs. investor (wrapped in `<Suspense>` per Next.js's static-generation requirement for `useSearchParams`) — verified end-to-end that `/contact?type=investor` correctly pre-selects the investor tab.
- Verified via full production build (`next build`) that all marketing pages remain statically prerendered (`○`) and only `/api/leads` is dynamic (`ƒ`), confirming the Suspense addition didn't regress the SSG architecture from `docs/ARCHITECTURE.md` §4.2.
- 404 page (`app/not-found.tsx`), and generated `sitemap.xml`/`robots.txt` (`app/sitemap.ts`, `app/robots.ts`) per `docs/TRD.md` §8.5 and `docs/PRD.md` §6 item 7 — completes the "global elements" MVP checklist. Verified a real unmatched route returns HTTP 404 with the designed page, and both generated files serve correct content.
- Product Requirements Document (`docs/PRD.md`) — problem statement, target users, goals/non-goals, user stories, MVP scope, success metrics, phased rollout plan.
- Technical Requirements Document (`docs/TRD.md`) — tech stack, data models, API contracts, third-party integrations, performance/scalability and non-functional requirements.
- Architecture Document (`docs/ARCHITECTURE.md`) — system/data-flow diagrams, request lifecycle, folder/module structure, key architectural decisions with rationale.
- Design Document (`docs/DESIGN.md`) — brand color system, typography pairing, motion/animation system, light/dark theming, page-by-page layout spec.
- Security Audit (`docs/SECURITY_AUDIT.md`) — design-level review covering auth, input validation/sanitization, CORS, rate limiting, secrets handling, and OWASP Top 10 exposure, with findings by severity.
- `README.md` — project overview, planned tech stack, planned setup/env vars/scripts, folder structure, documentation index.
- `CHANGELOG.md` — this file.

### Changed
- TRD and ARCHITECTURE updated to resolve Security Audit High/Medium findings: rate limiting locked to Upstash Redis (ruling out an in-memory limiter, which doesn't work reliably on stateless serverless functions), production/preview environment isolation required for Supabase and Resend/Slack credentials, explicit sanitization rules for content interpolated into email/Slack notifications, explicit same-origin/no-CORS policy for `/api/leads`, and centralized security response headers.
- DESIGN.md logo section updated after reviewing the actual brand asset (`logo.svg`): documented that the file is an auto-traced conversion of the source JPEG rather than clean vector art, and specified a safe interim usage pattern instead of attempting a risky hand-edit.
- DESIGN.md icon set decided as Lucide (over Phosphor), for consistency with the Next.js/Tailwind stack.

---

## Maintaining this file

- Add an entry under `[Unreleased]` for every meaningful commit or PR — grouped under **Added** / **Changed** / **Fixed** / **Removed** (omit empty groups per entry, don't list "N/A" placeholders once real entries exist).
- When a version is tagged/released, rename `[Unreleased]` to the version + date (e.g., `## [0.1.0] - 2026-08-15`) and start a fresh empty `[Unreleased]` section above it.
- Write entries for the reader of the changelog, not the commit log — describe the effect of the change, not the mechanics of how it was made.
