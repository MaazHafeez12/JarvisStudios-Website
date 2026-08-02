# Jarvis Studios Website Rebuild — Design Document

**Status:** Draft
**Input:** [[PRD]] · [[TRD]] · [[ARCHITECTURE]]
**Related:** [[SECURITY_AUDIT]]
**Brand assets reviewed:** `D:\JarvisStudios\logo.svg` (current source of truth, supersedes the earlier `logo.jpeg`)
**Reference reviewed:** [senthora.ai](https://senthora.ai)
**Last updated:** 2026-08-03

---

## 1. Overview

This document defines the visual and motion design system for the rebuild: brand foundations (color, type, logo usage), an animation system calibrated to "showcase-level motion, still professional," light/dark theming, and a page-by-page layout spec for every page in the PRD §6 MVP scope. It does not cover copywriting/microcopy in full (that's a content task) or component-level code (that's implementation, per [[ARCHITECTURE]]).

**Explicit design goal, per direction given:** the site should read as clearly agency-made and clearly *not* AI-templated — motion-forward and bold enough to double as proof of the studio's own frontend/animation skill, without tipping into the generic "AI startup landing page" look. §5 spells out what that means concretely.

## 2. Brand Foundations

### 2.1 Logo

The current source file (`D:\JarvisStudios\logo.svg`) is a monogram: an interlocking block-letter **"J" (white) + "S" (`#00adef`/`#01ACEE` blue)** on a near-black background, with a "Jarvis Studio" wordmark below in white, set in a bold geometric sans.

- **File status:** this SVG is technically vector format, but inspecting the path data shows it's an **auto-traced conversion of the original JPEG** (roughly 240+ small path fragments reconstructing the shapes and background, rather than a small number of clean hand-drawn paths). This is a common artifact of running a bitmap image through an auto-trace tool rather than redrawing the mark natively in a vector editor.
- **Decision for now:** per direction given, this file is used **as-is, unmodified** — the black background stays baked in. It is not safe to hand-edit this file to strip the background or produce a true transparent/light-mode variant: with ~240+ fragments, reliably identifying which paths are "background" vs. letterform without a real vector editor and visual verification risks silently corrupting the mark. That work needs an actual redraw/re-vectorization pass (e.g., in Illustrator or Figma, tracing the letterforms cleanly), not a text-edit of this file — flagged in §10 as a follow-up, not blocking.
- **Practical light-mode handling in the meantime:** rather than a transparent-background variant, place the logo (with its existing black background intact) inside a small fixed-size rounded container in nav/footer contexts — this works on both light and dark theme backgrounds without needing to modify the source file at all.
- **Clear space:** maintain padding around the mark equal to the height of the "S" glyph on all sides, minimum.
- **Don't:** don't recolor the "J"/"S" split (the color contrast between the two letterforms is the mark's signature detail — losing it in a single-color lockup for favicons etc. is expected and fine, but never swap which letter is white vs. blue elsewhere).

### 2.2 Color System

Base colors confirmed: **`#222222`** (near-black / charcoal) and **`#00adef`** (bright azure blue). Expanded into a full system below — deliberately staying in the black/white/blue family rather than introducing the indigo-violet range that reads as generic "AI product" (see §5).

**Neutrals** (charcoal-based scale, not pure gray — keeps warmth consistent with the logo's near-black rather than a cold slate):

| Token | Hex | Usage |
|---|---|---|
| `neutral-950` | `#141414` | Dark mode background |
| `neutral-900` | `#1B1B1B` | Dark mode surface (cards, nav) |
| `neutral-800` | `#222222` | **Brand base** — dark mode elevated surfaces, light-mode primary text |
| `neutral-600` | `#4A4A4A` | Secondary text (light mode), muted text (dark mode) |
| `neutral-400` | `#8A8A8A` | Tertiary text, disabled states, borders |
| `neutral-200` | `#E4E4E4` | Light mode borders, dividers |
| `neutral-100` | `#F4F4F4` | Light mode subtle surface (alternating section backgrounds) |
| `neutral-0` | `#FFFFFF` | Light mode background |

**Brand blue scale** (tints/shades of `#00adef` for depth without introducing a second hue):

| Token | Hex | Usage |
|---|---|---|
| `blue-700` | `#0088BE` | Hover/active state for primary buttons, links on hover |
| `blue-500` | `#00ADEF` | **Brand base** — primary CTA, links, active nav state, accent details |
| `blue-300` | `#5FD0FF` | Accents on dark backgrounds where `blue-500` is too saturated against black (e.g., subtle glow/highlight effects) |
| `blue-100` | `#D6F3FF` | Light-mode tinted surfaces (e.g., a soft background behind a stat or quote), badges |

**Semantic colors** (for form states — the contact form is the one place these are load-bearing):

| Token | Hex | Usage |
|---|---|---|
| `success-500` | `#2FAE66` | Form success state, confirmation messaging |
| `error-500` | `#E5484D` | Form validation errors, failed submission state |
| `warning-500` | `#E5A000` | Non-blocking warnings (rare in this site's UI) |

**Contrast requirement:** every text/background pairing above must be verified against WCAG AA (4.5:1 for body text, 3:1 for large text/UI components) before implementation — this table states intended usage, not pre-verified pairs. `blue-500` on `neutral-0` white and `blue-300` on `neutral-950` black are the two combinations most likely to need a contrast check/adjustment pass.

### 2.3 Typography

**Confirmed direction:** keep **Inter** (as requested) but pair it — Inter alone, especially paired with the also-extremely-common Space Grotesk, is one of the clearest "this is an AI-scaffolded site" tells (see §5). Pairing it with a font with more character avoids that while keeping Inter's excellent readability for UI/body text.

| Role | Font | Notes |
|---|---|---|
| **Display/Headings** | **Clash Display** (variable, Fontshare, free) | Bold geometric sans with distinctive letterforms (notably the angled terminals on "a," "e," "s") — used for H1/H2 hero and section headings only. Reads as intentional and a little unexpected, not a default. |
| **Body/UI** | **Inter** | Paragraph text, nav, buttons, form labels/inputs, footer — anywhere legibility at small sizes matters more than personality. |
| **Monospace (optional accent)** | **JetBrains Mono** | Used sparingly for small tech-flavor details if desired (e.g., a "stack" callout on the Work page, service tags) — not required, a nice-to-have that reinforces "dev studio" without overusing it. |

**Scale (base 16px, 1.25 modular ratio):** H1 48–64px (responsive clamp), H2 36px, H3 28px, H4 22px, body 16–18px, small/caption 14px. Headings set in Clash Display use tighter letter-spacing (-0.02em) and a slightly heavier weight (600–700) than body copy.

### 2.4 Imagery Style

**Confirmed direction: abstract/illustrated graphics, no photography.** This fits a from-scratch rebuild with limited real photo assets and reinforces "design studio" credibility better than stock photography would.

- **Approach:** custom geometric/abstract graphics built from the brand system itself — angular shapes echoing the logo's block-letter geometry, gradient meshes in the blue scale over charcoal, subtle grid/dot patterns as section backgrounds. Avoid generic 3D-blob/gradient-orb illustrations (another common AI-site tell, see §5).
- **Case studies (Work page):** since real product screenshots exist for the 2 featured clients, those screenshots are the exception to "no photography" — real UI screenshots are the strongest credibility signal available and should be used, framed in a consistent device/browser-chrome mockup style.
- **Icons: [Lucide](https://lucide.dev)** (decided). Both Lucide and Phosphor are solid, free/open options — Lucide wins here because it's the icon set the rest of the intended stack already gravitates toward (it's the default in the shadcn/ui ecosystem common with Next.js + Tailwind projects per ARCHITECTURE §2), ships a single consistent stroke-based style rather than Phosphor's six weights (one less decision to make and keep consistent over time), and has a smaller per-icon footprint via `lucide-react`'s tree-shakeable imports. Use it at 1.5–2px stroke, sized consistently, matching the outline style already specified.

## 3. Motion & Animation System

**Confirmed direction: showcase-level motion** — the animation itself is part of the pitch, while staying professional enough not to undermine credibility with investors/prospective clients. The reference site (senthora.ai) is a useful structural model for this: numbered step tabs, alternating feature blocks with imagery, a tech-stack "under the hood" showcase strip — all patterns that read as confident and product-grade without being gimmicky. The patterns below adapt that structure to Jarvis Studios' content, not clone its visuals.

### 3.1 Principles
- **Motion earns its place.** Every animation should either draw attention to something worth noticing (a result, a transition between ideas) or provide feedback (button press, form state change) — never motion for its own sake on content that doesn't need it.
- **Respect `prefers-reduced-motion`.** All non-essential animation (parallax, staggered reveals, hover flourishes) must have a reduced-motion fallback that shows the final state immediately. This is both an accessibility requirement (PRD §8.2/TRD §8.2 WCAG AA target) and good practice.
- **Consistent easing:** use a single custom easing curve (e.g., `cubic-bezier(0.16, 1, 0.3, 1)` — a confident "ease-out" feel) across the whole site rather than mixing library defaults, so motion feels like one system.

### 3.2 Pattern Catalog

| Pattern | Where used | Behavior |
|---|---|---|
| **Hero entrance** | Homepage hero | Headline and supporting graphic animate in on load with a staggered reveal (headline first, then subtext, then CTA, then the abstract hero graphic sweeping/assembling into place) — sets the tone immediately that this is a motion-capable studio. |
| **Scroll-triggered reveals** | Every page, section-by-section | Content fades/slides into view as it enters the viewport (GSAP ScrollTrigger or Framer Motion `whileInView`), staggered for grouped elements (e.g., 3 service cards revealing in sequence, not simultaneously). |
| **Numbered step / tabbed sequence** | Services page ("our process") | Directly modeled on senthora.ai's "4 steps" pattern — a horizontal step indicator (Discovery → Design → Build → Launch) where the active step's detail animates in as the user scrolls or clicks through, rather than a static 4-column grid. |
| **Alternating feature blocks** | Services page (per service line), About page (differentiators) | Image/graphic + text alternating left-right down the page, each block's graphic animating in with a distinct micro-interaction (not just fade) as it enters view — mirrors senthora.ai's "signature features" section structure. |
| **Logo/credibility marquee** | Homepage credibility strip | If client logos become available, an infinite horizontal scroll strip (senthora.ai uses this pattern for OpenAI/ElevenLabs/Azure under "Under the Hood"); until then, use it for the studio's own service-line icons or tech-stack badges instead of leaving the section empty. |
| **Case study reveal** | Work page | Each of the 2 case studies gets a full-bleed animated transition into its screenshot mockup as it scrolls into view — this is the highest-stakes motion moment on the site since it's carrying real proof of work. |
| **Hover micro-interactions** | Buttons, cards, nav links | Subtle scale/color/underline-draw transitions (150–250ms) — deliberately restrained compared to the scroll-triggered showcase moments, since these fire constantly and shouldn't fatigue the user. |
| **Contact form state transitions** | Contact page | Field focus states animate border/label position smoothly; on successful submission, the form transitions to a success state (not just a toast) — this is the site's single conversion moment and deserves a designed, not default, confirmation. |
| **Page/route transitions** | Global | A brief (200–300ms) cross-fade or slide between route changes (Next.js App Router + a transition library) rather than an instant hard cut — reinforces the "polished product" feel senthora.ai has via its smooth section-to-section scroll. |

### 3.3 Suggested libraries

Per the animation skills already available in this environment: **GSAP + ScrollTrigger** for the scroll-driven showcase moments (step sequences, alternating feature reveals, marquee) where fine-grained timeline control matters, and **Motion (Framer Motion)** for React-component-level interactions (hover states, form transitions, route transitions) where declarative variants fit Next.js component structure better. Using both is intentional, not redundant — GSAP for orchestrated scroll storytelling, Motion for everyday component polish.

## 4. Light / Dark Mode Theming

**Confirmed: full light + dark support from launch.**

- **Default:** dark mode as the default theme — it matches the logo's native presentation (black background) and suits the "showcase-level motion, tech-forward" direction better as a first impression. Light mode is a fully-supported, equally polished alternative, not an afterthought.
- **Toggle:** a persistent theme toggle in the nav (respecting system preference on first visit via `prefers-color-scheme`, remembered thereafter via local storage).
- **Token-based theming:** the neutral and blue scales in §2.2 are defined as CSS custom properties that flip per theme (e.g., `--surface` maps to `neutral-0` in light mode and `neutral-900` in dark mode) rather than components branching on a `dark:` conditional everywhere — keeps the two themes from drifting out of sync as the site grows.
- **Motion parity:** every animation pattern in §3 must be verified in both themes — glow/highlight effects using `blue-300` (designed for dark backgrounds) need a light-mode equivalent that doesn't wash out against white.

## 5. Anti-AI-Slop Guardrails

Explicit direction was "don't want it to look like AI" — these are the concrete, common tells to actively avoid, checked against this design system:

- ❌ **Indigo/violet gradients** as the default "AI product" palette — this system stays in the black/white/`#00adef` blue family, deliberately not indigo/purple. ✅ Already satisfied by §2.2.
- ❌ **Gradient-clipped headline text** (the ubiquitous multicolor-gradient-on-bold-text hero treatment) — headlines use solid `neutral-800`/`neutral-0` (theme-dependent) or solid `blue-500` for a single accent word at most, never a gradient fill across the whole headline.
- ❌ **Inter + Space Grotesk pairing** — the single most common "this is a template" typography tell. §2.3 pairs Inter with **Clash Display** instead specifically to avoid this.
- ❌ **Glassmorphism / frosted-glass cards** — use solid or subtly-bordered surfaces (per the neutral scale) instead of translucent blur panels.
- ❌ **Generic gradient-orb / 3D-blob hero illustrations** — §2.4 specifies angular, brand-geometry-derived abstract graphics instead.
- ❌ **Badge/pill spam** (everything wrapped in a rounded pill with an icon) — used deliberately (e.g., service tags on the Work page) not by default on every element.
- ❌ **Pastel icon tiles in soft rounded squares** — icons render directly in brand colors on transparent/solid backgrounds, not boxed in pastel containers.
- ❌ **AI copywriting voice** ("not just X — it's Y", excessive em-dashes, emoji-as-bullet-points) — out of scope for this doc (content/copy is separate) but flagged here as a requirement for whoever writes final copy.
- ❌ **01 / 02 / 03 section markers as decorative numerals** — the one exception is the Services "process" step sequence (§3.2), where numbering is functionally meaningful (an ordered process), not decorative filler on unordered content.

## 6. Page-by-Page Design

Each page below maps to an item in PRD §6 MVP Scope.

### 6.1 Homepage
1. **Hero** — headline + subtext + primary CTA ("Start a project" → Contact) with the staggered entrance animation (§3.2). Abstract brand graphic, not a product screenshot (nothing to screenshot on a marketing site itself).
2. **Service summary** — 5 cards (Web, App, SaaS, CRM, Marketing/Design), scroll-reveal staggered, each linking to its section on the Services page.
3. **Credibility strip** — marquee pattern (§3.2), populated with the 2 real client names/logos if usable, or service-line/tech badges as a placeholder per §2.4.
4. **Featured case study teaser** — one of the 2 case studies previewed with a "View work" CTA to the Work page.
5. **Investor/partner callout** — a lower-emphasis band (not competing visually with the client-facing CTA above it) pointing to the Investors page, per PRD's requirement to keep this a secondary flow.
6. **Final CTA band** — repeat primary contact CTA before the footer.

### 6.2 Services
- **Process sequence** — the numbered step pattern (§3.2), e.g. Discovery → Design → Build → Launch.
- **5 alternating feature blocks**, one per service line (Web Dev, App Dev, SaaS, CRM, Marketing/Design), each with a short abstract graphic and 2–3 concrete capabilities listed (not vague marketing copy — per PRD user story: prospective clients want to immediately tell if the studio does what they need).

### 6.3 Work / Portfolio
- 2 full case study features, each getting the "case study reveal" animation (§3.2) and a real-screenshot mockup treatment (§2.4). Structure per case study: challenge → approach → result, with any real metrics the client's agreed to share called out visually (not buried in paragraph text).

### 6.4 About
- Mission/differentiation statement, team section, and credibility content that serves both prospective clients and investors (per PRD §6 item 4) — alternating feature block pattern for "why Jarvis Studios," team grid/list below.

### 6.5 Investors
- Lighter-weight, distinct visual treatment from the client-facing pages (per PRD's requirement that this not compete with the primary client CTA) — traction/team/vision content with its own CTA ("Request investor info") styled distinctly from the primary blue CTA (e.g., an outline/secondary button style) so the two audiences' paths stay visually separated.

### 6.6 Contact
- Single form (per TRD §5 API contract) with the client/investor type selector as a prominent toggle at the top (changes which fields are relevant — `projectType` only shown when "client" is selected). Form state transitions per §3.2. Honeypot field present but visually hidden (off-screen, not `display:none`, to remain a genuine bot trap per standard honeypot practice — a note for implementation, not just design).

## 7. Component Design System (summary)

Full component specs are an implementation-time task, not this document, but the following primitives should be designed once and reused everywhere per ARCHITECTURE §4.6's shared-content-types principle:

- **Button** — primary (solid `blue-500`), secondary (outline), ghost/text — each with defined hover/active/disabled states and the micro-interaction from §3.2.
- **Card** — service card, case study card — consistent padding/radius/border treatment across both light and dark themes.
- **Form controls** — text input, textarea, select/toggle (for the client/investor selector) — all states (default, focus, error per `error-500`, disabled) designed once.
- **Nav** — includes the theme toggle (§4) and mobile menu treatment (hamburger → full-screen or slide-in panel, animated open/close per §3.1 easing).
- **Footer** — contact info, social links, secondary nav — per PRD §6 item 7.

## 8. Responsive & Accessibility Notes

- **Breakpoints:** mobile 320–639px, tablet 640–1023px, desktop 1024px+ (standard Tailwind-compatible scale, consistent with the Next.js/Tailwind stack in ARCHITECTURE §2).
- **Mobile motion:** scroll-triggered reveals should be less elaborate on mobile (shorter travel distance, shorter duration) — showcase-level motion on desktop shouldn't become janky or battery-draining on mobile, and PRD §7 requires mobile conversion parity, not just mobile support.
- **WCAG AA target (PRD §8.2/TRD §8.2):** carries directly into this doc — contrast ratios (§2.2), reduced-motion support (§3.1), and keyboard-navigable interactive elements (nav, form, theme toggle, step sequence tabs) are all required, not optional polish.

## 9. Reference Notes: senthora.ai

What was borrowed structurally from the reference site: the numbered step-sequence pattern, alternating feature-block layout, and a trust-building "under the hood" style showcase strip — all reused above (§3.2, §6.2). What was **not** borrowed: senthora.ai's actual color palette and typography aren't referenced here — this system is built from Jarvis Studios' own brand (§2), not the reference site's visual identity. The reference was used for structural/motion-pattern inspiration only, per the direction given.

## 10. Open Questions

- **Logo needs a proper redraw, not just a format fix:** `logo.svg` (§2.1) is an auto-traced version of the JPEG, not clean vector art. Producing a true transparent-background + light-mode variant requires someone to redraw the "J"/"S" monogram and wordmark natively in a vector tool (Illustrator/Figma) — a design task, not something resolvable by editing the current file. Not blocking MVP (§2.1 documents a workaround), but should happen before the mark gets used at large sizes or in contexts where the black background genuinely doesn't work.
- **Client logo usage rights:** the credibility marquee (§6.1) and case study features (§6.3) both assume the 2 real clients have agreed to be named/shown — confirmed generally in prior conversation, but the exact format (logo usage vs. name-only) should be confirmed per TRD's open "case study consent/format" question.
- **Display font licensing:** Clash Display (Fontshare) is free for both personal and commercial use as of this writing — worth a quick license re-check at implementation time in case terms have changed.
