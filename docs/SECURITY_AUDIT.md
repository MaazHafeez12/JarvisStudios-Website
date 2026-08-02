# Jarvis Studios Website Rebuild — Security Audit

**Status:** Draft — design-level review
**Scope:** [[PRD]] · [[TRD]] · [[ARCHITECTURE]]
**Related:** [[DESIGN]]
**Last updated:** 2026-08-02

---

## 1. Scope & Methodology

**No application code exists in this repository yet** — only `docs/PRD.md`, `docs/TRD.md`, and `docs/ARCHITECTURE.md`. There is no `package.json`, so `npm audit` cannot be run and there are no real dependencies to scan.

This is therefore a **design-level security review**: the planned architecture (Next.js + Supabase, single public `POST /api/leads` endpoint, Resend + Slack notifications, no auth, no CMS) is checked against OWASP Top 10 (2021) categories and the specific areas requested — auth, input validation/sanitization, CORS, rate limiting, secrets/env handling, and dependency management. Findings here are about what the design specifies, under-specifies, or gets right, not about implementation bugs (there is no implementation yet).

**This audit must be re-run against real code** once the project is scaffolded (see §7) — a design review cannot catch implementation-level issues (e.g., a validation rule that's specified correctly here but coded wrong).

## 2. Summary of Findings

| # | Finding | Category | Severity |
|---|---|---|---|
| 1 | Rate-limiting mechanism is undecided, and the TRD's own suggested fallback (in-memory limiter) is unsound in a serverless deployment | Rate Limiting | **High** |
| 2 | No isolation policy specified between Vercel preview deployments and production Supabase/Resend/Slack — preview URLs may write real leads and trigger real notifications | Secrets/Env Handling, Config | **High** |
| 3 | No sanitization strategy specified for user input that is reflected into outbound email (Resend) and Slack messages | Input Validation/Sanitization, Injection | **Medium** |
| 4 | No security response headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) specified anywhere in the design | Security Misconfiguration | **Medium** |
| 5 | CORS policy for `/api/leads` is not explicitly documented — relies on Next.js' implicit same-origin default | CORS | **Medium** |
| 6 | Bot/abuse defense relies solely on a honeypot field + IP rate limiting, with no fallback challenge (e.g., CAPTCHA) if that proves insufficient | Rate Limiting, Insecure Design | **Medium** |
| 7 | No security logging/alerting plan beyond ad hoc Vercel function logs — repeated validation failures or notification failures generate no alert | Logging & Monitoring | **Low** |
| 8 | No documented access-control policy (e.g., MFA) for the Vercel, Supabase, Resend, and Slack admin consoles themselves | Auth (org-level) | **Low** |
| 9 | No `.env.example` or secret-hygiene process (pre-commit scanning, confirmed `.gitignore` entry) documented | Secrets/Env Handling | **Low** |
| 10 | `npm audit` cannot be run — no dependency manifest exists yet; no CI dependency-scanning process documented for when it does | Dependency Vulnerabilities | **Informational** |
| 11 | CSRF exposure is low (no cookie-based session) but explicit `Content-Type: application/json` enforcement on the Route Handler isn't confirmed, which fully closes simple cross-site form-POST vectors | Input Validation | **Informational** |

## 3. Detailed Findings

### 3.1 Auth Implementation

**Design as specified:** No end-user authentication anywhere on the site (PRD §4, TRD §2) — this is a public marketing site by design, and that's an appropriate choice given the current scope.

**Positive:** The architecture's RLS policy for `leads` (TRD §4.3) enables RLS with **zero** public policies, and all writes go through the service role key server-side (ARCHITECTURE §4.3). This is a correct deny-by-default pattern — there is no anonymous read or write path into Supabase at all, which eliminates an entire class of "someone forgot to scope the RLS policy" bugs by construction.

**Finding #8 (Low) — Org-level access control undocumented:** "No auth" for end users doesn't mean there's no auth surface. The Vercel, Supabase, Resend, and Slack accounts that hold this project's secrets and lead data are themselves an attack surface — compromise of any one of those (weak password, no MFA, phished team member) is equivalent to a full data breach or a takeover of the notification pipeline (e.g., an attacker redirecting lead notifications to their own email/Slack). None of the three documents mention an access-control policy for these consoles.
**Fix:** Require MFA on all four accounts/orgs (Vercel, Supabase, Resend, Slack) before launch; document who has access and via what role (owner vs. member) in a location the team actually maintains (even a short README section is enough — this doesn't need its own doc).

**Future risk (tracked, not a current finding):** TRD §10 / ARCHITECTURE §5 both flag that an admin lead-review view is a likely future addition. That will require real authentication (the first legitimate reason to introduce a client-side Supabase key, per ARCHITECTURE §4.3) and its own RLS policy design. Flagging here so it isn't designed later without a follow-up security review — do not reuse the service role key pattern for an authenticated admin view; use Supabase Auth with a scoped, RLS-protected policy instead.

### 3.2 Input Validation / Sanitization

**Design as specified:** TRD §5 defines clear validation rules for every field on `/api/leads` (type enum, length bounds, email format), explicitly enforced server-side regardless of client-side checks (TRD §8.1, ARCHITECTURE §4.5). This is a solid baseline — the validation rules themselves are reasonable and the "server-side is the source of truth" principle is correctly stated.

**Finding #3 (Medium) — No sanitization for content reflected into email/Slack:** The TRD's own system diagram (§3) says the Route Handler should "Validate **and sanitize** input," but no document specifies what sanitization actually means here. This matters because `name`, `company`, and especially `message` (up to 5000 characters, effectively free text) flow into two places that render content in rich ways:
- **Resend email** — if the notification email is HTML (likely, for readability), an unescaped `message` or `name` field is a straightforward HTML injection vector into an email your team opens and trusts. A submitter could inject `<a href="...">` phishing links styled to look legitimate, or in a worse case, content designed to exploit an email client's HTML rendering.
- **Slack webhook** — Slack messages support `mrkdwn` formatting; unescaped user input can inject formatting, fake links (`<https://evil.example|Click here>` styling), or `@here`/`@channel`-style mentions to make a spam submission look like an urgent internal message.

Neither of these is stored XSS against a browser (there's no page that renders lead data back to any browser in MVP), but both are real injection risks against the two channels the team actually reads.
**Fix:** Explicitly sanitize/escape all lead fields before interpolating them into the Resend email template (HTML-escape) and the Slack payload (escape Slack's special characters: `&`, `<`, `>` per Slack's own escaping rules, and consider stripping/rejecting raw URLs from the honeypot-adjacent fields if they aren't expected). Treat this as plain text interpolated into a template, never as trusted markup.

**Finding #11 (Informational) — Content-Type enforcement:** Not a current problem, but worth stating as an explicit requirement rather than an assumption: the Route Handler should reject requests that aren't `Content-Type: application/json` (returning 415 or 400) before touching the body. This isn't primarily a CSRF concern (there's no cookie/session to ride along, so classic CSRF impact is low), but it closes the simplest "submit via a plain HTML `<form>` from another origin" abuse path and keeps the endpoint's contract tight.

### 3.3 CORS Configuration

**Finding #5 (Medium) — No explicit CORS policy documented:** Next.js Route Handlers are same-origin by default when no CORS headers are added, and the design as described (form on the same domain, calling `/api/leads` via `fetch`) doesn't need cross-origin access at all. However, none of the three documents state this as a deliberate, explicit policy — it's just the accidental default. That's a fragile way to stay secure: it's a one-line change (someone adding `Access-Control-Allow-Origin: *` later, e.g., to support an embeddable widget or a separate landing-page domain) away from turning the one public write endpoint into one that any origin can call.
**Fix:** Add an explicit statement to the TRD/ARCHITECTURE: `/api/leads` does not set any CORS headers and is same-origin only. If a future requirement needs cross-origin access (e.g., embedding the form on a campaign microsite), that should require a deliberate, reviewed CORS allowlist — never a wildcard — and should trigger a follow-up security review, not a silent addition.

### 3.4 Rate Limiting

**Finding #1 (High) — Mechanism undecided, and the fallback option is unsound:** TRD §7 requires rate limiting (suggested: 5 submissions/IP/hour) and TRD §10 / ARCHITECTURE §5 both explicitly leave the *implementation* as an open question, offering "Vercel's built-in rate limiting or a lightweight in-memory ... limiter" as options.

The in-memory option is a real problem, not just an unfinished detail: Vercel Route Handlers run as **stateless serverless functions**. Each invocation can land on a different function instance, and instances are recycled/scaled independently — an in-memory counter (e.g., a `Map` in module scope) will not reliably persist across requests, so the "5 per hour" limit would be inconsistently enforced at best and completely ineffective under any real load or distributed abuse at worst. This is the kind of gap that looks fine locally (single dev server, state persists) and silently fails in production.
**Fix:** The TRD should not leave this as a fully open option — the in-memory approach should be explicitly ruled out. Use either Vercel's built-in rate limiting (if available on the project's plan) or a shared external store (Upstash Redis is already suggested and is the right call — it's designed for exactly this serverless pattern). This should be decided before Phase 0 implementation starts, not deferred further, since it's a prerequisite for the endpoint being safe to make public.

**Finding #6 (Medium) — No fallback beyond honeypot + rate limit:** Honeypot fields stop unsophisticated bots; IP-based rate limiting stops naive high-volume abuse from a single IP. Neither stops a moderately capable spammer (headless browser that skips hidden fields, or IP rotation via residential proxies/botnets). Given the endpoint sends real emails (cost + deliverability reputation risk via Resend) and posts to Slack (noise/DoS-on-attention risk for the team), it's worth having a documented fallback rather than discovering the gap after the first spam wave.
**Fix:** Not necessarily needed at MVP launch, but should be a documented "next lever to pull" — e.g., Cloudflare Turnstile or hCaptcha triggered only after N failed/suspicious submissions, so it doesn't add friction for legitimate visitors by default. Add this as an explicit contingency in the TRD rather than leaving it undiscussed.

### 3.5 Secrets / Environment Variable Handling

**Design as specified:** TRD §9 lists all required secrets and correctly marks every one as server-only, with no `NEXT_PUBLIC_*` Supabase key required for MVP (ARCHITECTURE §4.3). This is the right default — the service role key, Resend key, and Slack webhook URL never need to reach the browser, and the design doesn't introduce any path for them to leak there.

**Finding #2 (High) — Preview/production environment isolation not specified:** This is the most concrete real-world risk in the current design. Vercel deployments from every branch/PR get a **public preview URL** by default. None of the three documents say whether preview deployments:
- use a **separate** Supabase project (or at least a separate table/schema) from production, or point at the same one;
- use the same Resend API key and Slack webhook as production, or dummy/sandboxed ones.

If preview and production share the same Supabase service role key and the same `leads` table, then every preview deployment (which can be reached by anyone with the URL — these are not always private, and can be indexed or leaked) becomes an additional live write path into the real leads database, and every test submission against a preview build fires a **real** email and a **real** Slack message to the team. This also means testing the contact form (explicitly called for in TRD Phase 1 validation steps) risks polluting production data unless this is addressed.
**Fix:** Use separate Supabase projects (or at minimum a separate `leads_staging` table with its own RLS) for preview/development vs. production, and separate Resend/Slack credentials (or a "TEST — " prefix convention on the Slack message / a redirected test inbox) for non-production environments. Configure this via Vercel's per-environment variable scoping (Production / Preview / Development each get their own values). This should be resolved in Phase 0, before any preview deployment goes live.

**Finding #9 (Low) — Secret hygiene process:** ARCHITECTURE §3 lists `.env.local` in the folder tree as "local-only, gitignored," which is correct, but no document confirms an actual `.gitignore` entry exists or that a `.env.example` (with placeholder values, safe to commit) is provided so contributors don't invent their own local convention. No pre-commit secret-scanning step (e.g., `gitleaks` or GitHub's push protection) is mentioned either.
**Fix:** Add `.env.example` alongside `.env.local` in the repo structure, confirm `.env.local` (and `.env*.local`) is in `.gitignore` from the first commit, and enable GitHub's secret scanning / push protection on the repository (low effort, catches accidental commits before they're a live incident).

### 3.6 Dependency Vulnerabilities

**Finding #10 (Informational):** `npm audit` cannot be run — there is no `package.json` in the repository yet (confirmed via directory listing before this audit). This is expected at this stage, not a defect, but it means dependency risk is currently completely unassessed.
**Fix (for Phase 0):** Once scaffolded, run `npm audit` as part of the initial setup and again in CI on every PR (`npm audit --audit-level=high` failing the build is a reasonable starting bar, tuned as needed). Enable Dependabot (or Snyk) for automated update PRs. Pin the Next.js/Supabase client/Resend SDK versions deliberately rather than accepting whatever `create-next-app` scaffolds by default, so the first `npm audit` baseline is a deliberate choice, not an accident.

## 4. OWASP Top 10 (2021) Mapping

| Category | Exposure in this design | Assessment |
|---|---|---|
| **A01: Broken Access Control** | `leads` table has RLS enabled with zero public policies (§3.1); no client-side DB access at all in MVP | Low risk as designed — correct deny-by-default pattern. Revisit when an admin view is added. |
| **A02: Cryptographic Failures** | PII (name, email, company, message) stored in Supabase Postgres; TLS enforced via Vercel/Supabase defaults | Low risk — confirm Supabase project uses encryption at rest (default) and is provisioned in an appropriate data region; no additional app-level encryption needed for this data sensitivity level. |
| **A03: Injection** | SQL injection risk is low (Supabase client library parameterizes queries) but **not yet verified at implementation time**; HTML/Slack-markup injection into notifications is a real gap (Finding #3) | **Medium** — primary concern is #3, not SQL injection. |
| **A04: Insecure Design** | Rate limiting mechanism undecided (Finding #1); no bot-defense fallback (Finding #6) | **Medium-High** — the biggest design-level gap in this review. |
| **A05: Security Misconfiguration** | No security headers specified (Finding #4); no explicit CORS policy (Finding #5); preview/prod isolation unspecified (Finding #2) | **Medium-High** — several findings cluster here. |
| **A06: Vulnerable/Outdated Components** | No dependencies exist yet to be vulnerable (Finding #10) | Informational — process gap only, not a current vulnerability. |
| **A07: Identification & Auth Failures** | No end-user auth in MVP (by design, appropriate); org-level console access undocumented (Finding #8) | Low risk for the app itself; Low-Medium for the humans/orgs holding the keys. |
| **A08: Software & Data Integrity Failures** | No CI/build integrity process documented yet; no incoming webhooks to verify (Slack webhook usage here is outbound-only) | Informational — revisit if Supabase Database Webhooks or other inbound webhooks are added later. |
| **A09: Security Logging & Monitoring Failures** | Only ad hoc Vercel function logs for notification failures (TRD §8.4); no alerting (Finding #7) | Low-Medium — acceptable for current lead volume, but worth a lightweight alert before it's needed under pressure. |
| **A10: Server-Side Request Forgery (SSRF)** | Outbound requests (Resend, Slack) go to fixed, hardcoded endpoints; no user input constructs any outbound URL | Low risk as designed — no SSRF vector present. |

## 5. What's Already Right (Don't Regress These)

- **Deny-by-default database access:** RLS enabled with no public policies, all writes server-side via service role key. This is the single strongest security decision in the current design — preserve it exactly as specified when implementation starts.
- **Server-side validation as source of truth:** correctly stated as non-negotiable even though client-side validation also exists, avoiding the common mistake of trusting the client.
- **No unnecessary client-side secrets:** no `NEXT_PUBLIC_*` Supabase key exists in the design because nothing on the client needs one. Don't add one preemptively "just in case" — only introduce it when the admin view (or similar) actually needs it, with its own scoped RLS policy at that time.
- **Notification failures don't block the response, and don't fail silently either** (logged server-side) — this is good reliability *and* security hygiene (an attacker spamming the Resend/Slack integration to failure still can't stop leads from being captured).
- **Generic error responses:** `500 SERVER_ERROR` with no detail leakage in the TRD's API contract (§5) — confirm at implementation time that Next.js production mode is relied on to suppress stack traces (it does by default), rather than any custom error handler accidentally re-exposing them.

## 6. Prioritized Recommendations

1. **Before Phase 0 implementation begins:** Resolve Finding #1 (rate limiting mechanism — rule out in-memory, commit to Vercel rate limiting or Upstash) and Finding #2 (preview/production isolation for Supabase + Resend + Slack). Both are prerequisites for the public endpoint being safe to deploy at all, even in preview.
2. **During Phase 0 implementation:** Address Finding #3 (sanitize fields before interpolating into email/Slack), Finding #4 (add security headers via `next.config.ts` or middleware), Finding #5 (document the same-origin CORS policy explicitly in code, e.g., no CORS headers added), Finding #9 (`.env.example` + confirmed `.gitignore` + secret scanning).
3. **Before public launch (Phase 1):** Findings #7 and #8 — at minimum, MFA on all admin consoles and a basic "something is failing repeatedly" alert (even a simple threshold-based Slack alert on Vercel function error rate is enough at this scale).
4. **Ongoing/Phase 2+:** Finding #6 (CAPTCHA fallback) only if spam volume actually warrants it; Finding #10 (`npm audit` in CI) as soon as `package.json` exists.

## 7. Re-Audit Trigger

This review is only as good as the design it's checking. **A follow-up, code-level security audit is required** once the project is scaffolded and the endpoints described here actually exist — that pass should include:
- `npm audit` (and ideally `npm audit --production` separately) against real installed dependencies.
- Verification that the RLS policy, validation rules, sanitization, rate limiting, and CORS behavior described here match what was actually implemented (design intent vs. shipped code frequently drift).
- A basic manual pentest pass on `/api/leads` (malformed payloads, oversized payloads, injection payloads in `message`/`name`, rate-limit bypass attempts) before the domain cutover in PRD §9.
