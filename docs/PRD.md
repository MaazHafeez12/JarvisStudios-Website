# Jarvis Studios Website Rebuild — Product Requirements Document

**Status:** Draft
**Author:** Product (drafted with Claude)
**Related:** [[TRD]] · [[ARCHITECTURE]] · [[DESIGN]] · [[SECURITY_AUDIT]]
**Last updated:** 2026-08-02

---

## 1. Problem Statement

Jarvis Studios is a software agency offering web development, app development, SaaS builds, CRM implementation, and marketing/design services **as client work** — the studio does not currently operate its own public-facing SaaS or CRM product. The current live website (on the studio's existing domain) is being replaced with a from-scratch rebuild rather than an incremental redesign.

Today, without a strong web presence, the studio cannot clearly communicate the breadth of its service lines, provide credible proof of work, or convert visitor interest into qualified leads. A generic or unclear site makes it harder to compete for client work against agencies with sharper positioning, and it undersells the studio to investors/partners evaluating it for funding or collaboration.

The rebuild needs to give two primary audiences (prospective clients, investors/partners) a fast, credible answer to "what does Jarvis Studios do, and why should I trust them," while driving each toward a distinct action, without a hard deadline forcing scope cuts.

## 2. Target Users

| Segment | Who they are | What they need from the site |
|---|---|---|
| **Prospective clients** | Founders, marketing leads, or ops leads at businesses evaluating agencies for web/app/SaaS/CRM/design work | Clear service offerings, past work/case studies, process clarity, an easy way to start a conversation |
| **Investors/partners** | People evaluating Jarvis Studios for funding, partnership, or collaboration | Credibility signals: team, traction, differentiation, a way to request more info or a meeting |
| **General visitors/referrals** | People landing on the site from search, referral, or social with no prior context | A fast, unambiguous understanding of who Jarvis Studios is and what they offer |

**Note:** "End users/customers" as a segment (people using a Jarvis-owned product) does not apply at this stage — SaaS and CRM are service lines the studio builds *for* clients, not products it operates itself. If that changes in the future (the studio ships its own product), that introduces a new segment and is out of scope for this PRD (see Non-Goals).

**Primary segment for MVP:** Prospective clients. This segment has the clearest, most immediate path to revenue (inbound leads) and should shape the majority of MVP scope. Investors/partners are addressed with a lighter-weight, secondary flow.

## 3. Goals

- Clearly communicate all five service lines (web dev, app dev, SaaS, CRM, marketing/design) so a visitor understands the studio's full capability within seconds of landing.
- Convert prospective-client visitors into qualified leads via a low-friction contact/inquiry path.
- Establish credibility through real case studies from the 2 clients whose full project details can be shown today.
- Give investors/partners a dedicated, low-effort way to signal interest without competing for space with the client-facing pitch.
- Ship a fast, accessible, mobile-responsive site that reflects the studio's own design/dev quality (the site is itself a portfolio piece).
- Establish a clean information architecture and content model that can support future phases (blog, expanded case study library, an eventual owned product) without another full rebuild.
- Cut over from the current live site to the new build without disrupting existing visitors, using a staged rollout on the existing domain.

## 4. Non-Goals

- **Not building a client portal, billing system, or project management dashboard** in MVP.
- **Not building e-commerce or paid checkout** flows.
- **Not localizing/translating** the site into multiple languages for MVP.
- **Not building a CMS-driven blog/content engine** in MVP (deferred to Phase 2).
- **Not building any user accounts, login, or authenticated areas** — confirmed not needed for this site; all pages are public.
- **Not building or marketing an owned SaaS/CRM product** — SaaS and CRM are service lines delivered to clients, not products Jarvis Studios operates. If the studio launches its own product in the future, that requires a separate PRD and is out of scope here.
- **Not preserving specific existing URL paths or content from the current site** — current site has minimal organic SEO traffic, so the rebuild is free to restructure IA and URLs without a redirect-mapping project (see Section 9).

## 5. User Stories

### Prospective clients
- As a prospective client, I want to see the studio's services listed clearly on the homepage so I can immediately tell if they do what I need.
- As a prospective client, I want to view real examples of past work with actual results so I can judge quality and fit before reaching out.
- As a prospective client, I want a simple contact/inquiry form that asks for my project type so I can start a conversation without a phone call.
- As a prospective client, I want to understand the studio's process (discovery → build → launch, etc.) so I know what working with them looks like.
- As a prospective client, I want to see team/company credibility signals (who's behind the studio, notable clients, years in business) so I can trust them with my project.

### Investors/partners
- As an investor or partner, I want a dedicated page or section that speaks to traction, team background, and vision so I can quickly assess fit.
- As an investor or partner, I want a clear, distinct way to request a meeting or send an inquiry that doesn't get lost in the general contact form.

### Cross-cutting
- As any visitor, I want the site to load fast and work well on mobile so I don't bounce before I get the information I need.
- As any visitor, I want to easily find a way to contact the studio from any page (persistent nav/footer CTA).
- As a returning visitor (from the old site), I want the new site to work correctly and not break or 404 on links I had previously found via search.

## 6. MVP Scope

**In scope for MVP:**

1. **Homepage** — value proposition, summary of all 5 service lines, credibility strip (logos/stats/testimonials if available), primary CTA to contact.
2. **Services pages** — either one page per service line or a single services page with clear sections for: Web Development, App Development, SaaS, CRM, Marketing/Design.
3. **Work/Portfolio page** — 2 full case studies with real client details, in a format that can be expanded as more clients agree to be featured.
4. **About page** — team, mission, differentiation; serves both prospective clients and investors/partners as a credibility layer.
5. **Contact/Inquiry page** — single form with a selector to distinguish "I'm a prospective client" vs "I'm an investor/partner" so submissions can be triaged differently. Form data written directly to Supabase, with a real-time notification (see Section 10) so submissions aren't missed.
6. **Investor/Partner section or page** — lightweight dedicated page (can be linked from About or footer) with a distinct CTA (e.g., "Request investor info").
7. **Global elements** — responsive nav, footer with contact info/social links, 404 page, basic SEO metadata (titles, descriptions, OG tags) on every page.

**Explicitly deferred (see Non-Goals and Phased Rollout):**
- Blog/content hub
- Any login/authenticated area
- Multi-language support
- Full case study CMS with filtering/tagging
- Anything related to an owned SaaS/CRM product (none exists)

## 7. Success Metrics

**Note:** No analytics tool is selected yet. MVP launches without one — an analytics tool will be added post-launch based on a future recommendation (see Open Questions). Metrics below that depend on analytics (bounce rate, mobile conversion, CTA timing, page performance, service-page engagement) are not measurable until that tool is added; lead and inquiry counts (from Supabase) are measurable from day one regardless.

| Metric | Target / Signal | Why it matters |
|---|---|---|
| Qualified lead submissions (contact form, client-tagged) | Baseline in month 1, then track month-over-month growth | Primary business goal — the site's job is to generate client work |
| Investor/partner inquiries | Tracked separately from client leads | Confirms the dedicated investor flow is working, not just absorbed into general contact |
| Time to first contact/CTA click | Majority of converting visitors act within first session | Validates that value prop and CTAs are clear enough to act on quickly |
| Bounce rate on homepage | Below industry benchmark for agency sites (~40-55%) | Signals whether the homepage communicates value fast enough |
| Mobile traffic conversion rate vs. desktop | Parity (no significant drop-off on mobile) | Confirms responsive design isn't costing conversions |
| Page load performance (Core Web Vitals) | Passing "Good" thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms) | The site is a portfolio piece for a dev/design studio — poor performance undermines credibility directly |
| Service-page engagement | Visitors viewing 2+ service areas per session | Confirms visitors understand the full breadth of offerings, not just one service |
| Zero-downtime cutover | No period where the domain serves an error/blank page during launch | Confirms the staged rollout worked cleanly |

## 8. Phased Rollout Plan

### Phase 0 — Foundation (pre-launch)
- Extend the existing brand (logo + 2 existing colors) with a fuller color palette and a defined typography system before design work starts.
- Finalize information architecture and content model.
- Content collection: service descriptions, the 2 full case studies, team bios, testimonials if available.
- Technical foundation: Supabase project setup (database tables for leads, notification trigger), Vercel project setup, SEO basics. Analytics tool intentionally deferred (see Section 7).
- Build and deploy to a Vercel preview URL (not yet on the production domain).

### Phase 1 — MVP Launch (staged/soft launch)
- Ship all pages/flows listed in **Section 6 (MVP Scope)**.
- Instrument analytics and conversion tracking for the metrics in Section 7 before or at launch, not after.
- Validate on the Vercel preview URL: forms submit correctly to Supabase, mobile experience, page performance.
- Cut DNS over to the new build on the existing domain once validated (see Section 9 for cutover detail).
- Monitor closely for the first 1-2 weeks post-cutover for broken links, form failures, or traffic drops.

### Phase 2 — Content & Credibility Expansion
- Add case study detail pages (full write-ups per project, as more real client work becomes shareable).
- Add blog/insights section for SEO and thought leadership.
- Expand testimonials/social proof (video testimonials, client logos at scale).
- A/B test homepage value proposition and CTA placement based on Phase 1 data.

### Phase 3 — Product & Scale Considerations
- If Jarvis Studios launches its own SaaS/CRM product in the future, revisit this PRD's Non-Goals — a new product marketing surface and end-user segment would need its own PRD.
- Potential client portal (project status, invoices) if agency scale warrants it.
- Localization if international client demand emerges.

### Phase 4 — Optimization & Scale
- Ongoing conversion rate optimization based on accumulated funnel data.
- Expand investor/partner content (data room links, deck requests) if fundraising becomes active.
- Revisit CMS needs if content volume outgrows static/manual management.

## 9. Cutover Plan

- **Current state:** A live site already exists on the studio's domain today.
- **SEO risk:** Confirmed low/minimal current organic search traffic, so this rebuild is not constrained by legacy URL structure or redirect-mapping requirements.
- **Approach:** Staged/soft launch — deploy the rebuild to a Vercel preview URL first, validate real functionality (forms, mobile, performance) against production-like conditions, then switch the domain's DNS/deployment target to the new build.
- **Rollback:** Because this is a DNS/deployment cutover rather than an in-place edit, reverting to the prior site (if something breaks post-launch) should remain possible during the initial monitoring window — confirm the old site's deployment isn't torn down until the new site is stable in production.

## 10. Technical Considerations

*(Included here because it directly shapes MVP feasibility and scope; full technical design is out of scope for this PRD.)*

- **Frontend/backend:** React frontend with **Supabase** as the entire backend (database, and storage if needed for case study assets) — no separate Node/Express API layer for MVP. This is sufficient because MVP has no authenticated areas and the only backend need is durable storage of form submissions (leads).
- **Auth:** None required for MVP — confirmed no login/accounts needed on this site.
- **Hosting:** Vercel, deployed to the studio's existing domain via a staged DNS cutover (see Section 9).
- **Forms/lead capture:** Contact form (Section 6, item 5) writes directly to a Supabase table; investor/partner submissions should be distinguishable from client submissions at the data layer (e.g., a `type` field) to support the separate tracking required by Section 7's success metrics.
- **Lead notifications:** Confirmed required for MVP, via **both email and Slack** — a Supabase Database Webhook/Edge Function triggered on insert that (a) sends an email (e.g., via Resend) and (b) posts to a Slack channel via incoming webhook. Both fire on every new submission (client or investor/partner), so neither channel is a single point of failure. This is a hard MVP requirement, not a nice-to-have.
- **Brand system:** Logo and 2 base colors already exist and should be treated as fixed starting points. Phase 0 needs to expand this into a full palette (including neutrals, accent, semantic colors for things like form success/error states) and select a typography system (headings/body pairing) before UI design begins.

## Open Questions

- **Notification recipients:** Channel is confirmed (email + Slack, see Section 10) — still need the actual destination email address(es) and Slack channel/webhook to wire up in Phase 0.
- **Analytics tool (deferred by design):** No tool selected for MVP; to be recommended and added post-launch. Note for later: this means Section 7 metrics beyond lead/inquiry counts are unmeasured until this is added — worth revisiting soon after launch rather than indefinitely.
- **Case study consent/format:** Both clients have agreed to show full data — confirm the specific format (write-up length, whether real screenshots/metrics are included, whether client logos can be displayed) before content collection in Phase 0.
