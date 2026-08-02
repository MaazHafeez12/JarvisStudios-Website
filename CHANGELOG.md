# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/) once versioned releases begin.

## [Unreleased]

### Added
- Project scaffold: Next.js 16 (App Router) + TypeScript + Tailwind CSS, initialized per `docs/ARCHITECTURE.md`. Includes root layout with dark/light theme initialization (no-flash, `prefers-color-scheme`-aware), brand color/typography tokens from `docs/DESIGN.md` wired into Tailwind config and CSS custom properties, and centralized security response headers (CSP, HSTS, X-Frame-Options, etc.) in `next.config.ts` per `docs/SECURITY_AUDIT.md` finding #4.
- `.env.example` documenting all planned environment variables (Supabase, Resend, Slack, Upstash) per `docs/TRD.md` §9.
- `.claude/launch.json` dev server config for local preview.
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

### Fixed
- N/A — no application code has shipped yet.

### Removed
- N/A

---

## Maintaining this file

- Add an entry under `[Unreleased]` for every meaningful commit or PR — grouped under **Added** / **Changed** / **Fixed** / **Removed** (omit empty groups per entry, don't list "N/A" placeholders once real entries exist).
- When a version is tagged/released, rename `[Unreleased]` to the version + date (e.g., `## [0.1.0] - 2026-08-15`) and start a fresh empty `[Unreleased]` section above it.
- Write entries for the reader of the changelog, not the commit log — describe the effect of the change, not the mechanics of how it was made.
