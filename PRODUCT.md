# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — prospective clients.** Owners and operators at growing businesses who need software built and shipped: a marketing site, a mobile app, a SaaS product, a CRM, automation, or design work. They arrive mid-evaluation and, per the user, in all three states at once: comparing Jarvis Studios against other studios, confirming a studio they've already been referred to covers their specific need, and browsing early with a vague problem and no fixed scope. A single services surface has to serve all three — fast wayfinding to one service, side-by-side comparison across services, and help locating a problem before it has a name.

**Secondary — investors.** Deliberately kept on a separate, lower-emphasis path with its own CTA so the two audiences never compete. Not an audience for the services surface.

## Product Purpose

The studio's own website. Its job is to turn a prospective client's interest into a qualified enquiry through the contact form, and to serve as proof of the studio's frontend and engineering capability in its own right — the site is a portfolio artifact, not just a brochure.

## Positioning

A studio that ships working software rather than selling strategy: the site's own copy frames it as "web, app, and SaaS work built to actually ship" and "real software, not just a pitch deck." The differentiator is delivery and breadth across six connected service lines under one process, not a single specialism.

## Operating Context

- Enquiries arrive through one contact form covering both client and investor paths; project type is selectable per service line.
- Leads persist to Supabase, with best-effort Resend email and Slack notification, and Slack alerting on critical failures.
- Prospects can deep-link to a specific service via `/services#<id>` from the homepage grid and the footer.

## Capabilities and Constraints

**Six service lines** (`content/services.ts`), each with a summary and three concrete capabilities: Web Development, App Development, SaaS, CRM, AI Automation, Marketing & Design.

**Four-step process** (`content/process.ts`): Discovery, Design, Build, Launch.

**Commercial terms** (`content/engagement.ts`, supplied by the user): free discovery; projects start from $1,000 (assumed USD, unconfirmed); typical timeline 4–8 weeks; both fixed-scope and retainer engagements; no stated hard exclusions.
- *Open:* the framing copy around these figures ("larger builds are quoted against the actual work", "we'll tell you which one we think fits") is inferred, not supplied, and awaits sign-off.

**Technical constraints:**
- Next.js 16 App Router, TypeScript, Tailwind. Marketing pages are statically prerendered; only `/api/leads` is dynamic.
- Strict CSP: `img-src 'self' data:`, `connect-src 'self'`, no external hosts. Any imagery must be local to `/public`, a data URI, or authored in markup.
- Recent Lighthouse/CWV and accessibility passes are treated as regression baselines, not optional.

## Brand Commitments

- **Name:** Jarvis Studios.
- **Type:** Clash Display (headings, self-hosted), Inter (body/UI), JetBrains Mono (accents).
- **Color:** charcoal family (`#141414`/`#1B1B1B`/`#222222`) with `#00ADEF` as the single accent. Deliberately excludes the indigo/violet range as an anti-templated-AI commitment.
- **Theme:** dark by default, with a working light mode; both must stay supported.
- **Icons:** Lucide.
- **Logo:** `public/logo.svg` is an auto-traced file with a baked-in black background, used as-is inside a fixed rounded container. A clean redraw is a known outstanding task.
- **Confirmed by the user for this work:** the brand is fixed. Surface redesigns happen inside this system, not by replacing it.

## Evidence on Hand

Deliberately thin, and future work must not fabricate around it:

- **No real case studies.** The Work page is an intentional placeholder; the PRD's two planned case studies don't exist yet and client consent/format is unresolved.
- **No client screenshots, product screenshots, or photography of any kind.** `public/` contains only fonts and the logo.
- **No team bios.** Left as an honest placeholder rather than invented.
- **No testimonials, client logos, metrics, awards, or press.**
- **Confirmed by the user:** there is no real visual material for the six service lines. Imagery for them is to be authored as illustrative interface compositions, clearly generic rather than presented as delivered client work.

## Product Principles

1. **Never fabricate evidence.** Absent case studies, bios, and screenshots ship as honest placeholders. This has been applied consistently and is the site's established standard.
2. **The site is the proof.** Craft and motion on the site itself substitute for the case studies that don't exist yet.
3. **Breadth is the offer, so navigation is the product.** Six service lines only help if a visitor can locate their own need in seconds.
4. **Accessibility and Core Web Vitals are baselines, not polish.** Prior fix passes are regression baselines.
5. **Qualify early and honestly.** Published pricing, timelines, and engagement models exist to filter mismatched enquiries before they cost a conversation.

## Accessibility & Inclusion

WCAG 2.1 AA is the stated target. Established requirements: `prefers-reduced-motion` support for all non-essential motion, verified contrast ratios in both themes, a working skip link, keyboard operability for every interactive control, and no motion-triggered layout shift.
