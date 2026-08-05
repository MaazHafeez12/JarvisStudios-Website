# Motion & Animation Redesign — Phase 2

**Status:** Hero built — Option C signed off and implemented (§3, §4). §5 sitewide additions still pending.
**Input:** [[DESIGN]] §3 (original motion system), current implementation in `app/`, `components/`
**Related:** [[ARCHITECTURE]], [[SECURITY_AUDIT]] (perf/CWV constraints), recent commits `8529cda` (Lighthouse fixes), `f8a918c` (a11y/reduced-motion)
**Last updated:** 2026-08-05

---

## 1. Why this doc exists

[[DESIGN]] §3 already specifies a "showcase-level motion" system — GSAP + ScrollTrigger for scroll storytelling, Motion for component polish, alternating feature blocks, a numbered process sequence. Checking the live site and codebase against that spec:

**Already built:**
- `Reveal` ([components/ui/Reveal.tsx](../components/ui/Reveal.tsx)) — scroll-triggered fade/slide-up via Motion's `whileInView`, with an LCP-safe transform-only variant for above-the-fold content. Used throughout the homepage.
- `Marquee` ([components/ui/Marquee.tsx](../components/ui/Marquee.tsx)) — CSS-only infinite scroll ticker for the service-line strip.
- `ProcessSteps` ([components/ProcessSteps.tsx](../components/ProcessSteps.tsx)) — tabbed step sequence with `AnimatePresence` crossfade, matching §3.2's process pattern.
- Global reduced-motion handling via `<MotionConfig reducedMotion="user">` in `app/layout.tsx` — every `Reveal`/`ProcessSteps` animation already degrades correctly.
- Full color/type/theming system from [[DESIGN]] §2/§4 is live (Clash Display + Inter, brand blue scale, light/dark theming).

**Not built yet, still just spec:**
- GSAP/ScrollTrigger isn't installed or used anywhere — everything animated today runs on Motion alone.
- No hero-level "showcase" moment. The current hero ([app/page.tsx](../app/page.tsx)) is three staggered `Reveal`s and a button; there's no assembling graphic, no interactive/3D element.
- Alternating feature blocks (Services page) and the case-study reveal (Work page) aren't implemented.
- No route/page transitions.

This doc doesn't replace [[DESIGN]] — it's the implementation-ready spec for the specific gap identified above: **the homepage hero**, prioritized first per direction given, plus the site-wide motion additions needed to make the rest of the site match the hero's ambition instead of looking unfinished by comparison.

## 2. Direction confirmed (this scoping pass)

- **Intensity:** bold, showcase-grade motion in the hero specifically — the hero doubles as proof of the studio's frontend/animation capability. Everything past the hero stays refined and restrained (Motion-level polish, not a second showcase moment) so the rest of the site doesn't fight the content or fatigue the visitor.
  - **Amended after the hero shipped:** the service cards are now a deliberate *second* accent moment (the angular wipe + shard burst in §5.1), not the restrained micro-interaction this bullet originally called for. The reasoning that still holds: the accent is confined to a hover state the visitor opts into, it reuses the hero's shard vocabulary rather than introducing a new effect, and it costs no runtime JS. What stays restrained is everything that plays *unprompted* — scroll reveals, nav, page transitions (§5 items 2–4). Read "restrained past the hero" as governing ambient motion, not deliberate interaction feedback.
- **Priority order:** homepage hero first; service cards/ticker, sitewide scroll-reveal, and nav/route-transition polish come after, once the hero direction is validated.
- **Hero concept:** interactive 3D/WebGL — chosen over the lighter Linear-style and scroll-storytelling alternatives specifically because it's the highest "proof of capability" signal, accepted with its higher engineering cost.
- **Interactivity:** reacts to **both** mouse/cursor and scroll.
- **Mobile/low-end:** lighter scene (fewer particles/polygons, simpler shaders) *and* lazy-loaded bundle *and* a static/CSS fallback for very low-end devices or `prefers-reduced-motion` — not a single mitigation, all three together (see §4).
- **3D concept content:** not yet chosen — §3 below proposes concrete options for sign-off before build starts.

## 3. Hero concept options (pick one before implementation)

All three stay inside the existing brand system ([[DESIGN]] §2.2/§5 anti-AI-slop guardrails still apply — no gradient-orb/blob clichés, no indigo/violet, stay in the black/`#00adef` family).

### Option A — Interlocking monogram, reimagined in 3D
A 3D reinterpretation of the actual logo geometry: the "J"/"S" block-letter interlock rendered as extruded/faceted 3D geometry, slowly rotating, that subtly separates and re-interlocks as the cursor moves nearby (the two letterforms drift apart on X/Y with cursor proximity, snap back when idle) and compresses/settles as the user scrolls past the hero.
- **Pro:** directly reinforces brand identity, not generic abstract decoration — nobody else can use this exact shape.
- **Con:** requires clean 3D letterform geometry, not the auto-traced `logo.svg` — needs new geometry built for this purpose (a small, scoped ask, not the full logo redraw flagged in [[DESIGN]] §10).

### Option B — Reactive node/wireframe lattice
An abstract wireframe polyhedron or point-cloud lattice (echoing "systems/software" without being literal), rendered in charcoal + brand blue, where nearby nodes light up and connecting edges animate in as the cursor moves through the scene, and the whole lattice slowly unfolds/expands as the user scrolls into the hero.
- **Pro:** cheapest to build well (procedural geometry, no custom asset needed), scales cleanly to "lighter mobile scene" by just reducing node count.
- **Con:** closest of the three to a generic "tech company" visual — needs restraint on color/density to avoid drifting toward the gradient-mesh cliché [[DESIGN]] §5 explicitly warns against.

### Option C — Assembling geometric shard field
Angular shard/fragment geometry (matching the logo's block-letter angularity — see [[DESIGN]] §2.4's "angular shapes echoing the logo's geometry" imagery direction) that flies in and assembles into a loose abstract formation on load, drifts gently, parts subtly follow the cursor (parallax by depth layer), and disperses/reforms on scroll.
- **Pro:** strongest "entrance" moment (something to see on first load, not just on interaction); reuses the angular-geometry visual language [[DESIGN]] already committed to for imagery, so it's consistent with the rest of the site rather than a one-off.
- **Con:** most moving parts to tune (entrance timing + idle drift + cursor parallax + scroll response all need to feel like one coherent system, not four separate effects).

**Recommendation:** Option A if the small scoped geometry work is acceptable (best differentiation, can't be templated by a competitor), otherwise Option C (best effort-to-impact ratio without needing brand-specific geometry). Option B is the fallback if timeline is tight.

> **Decided: Option C.** Option A was ruled out on inspection of the actual asset — `public/logo.svg` is ~250KB of auto-traced path data with a baked-in black background, so there is no clean letterform geometry to reinterpret; building it would have meant inventing brand geometry without a reliable reference, which is a bigger call than this doc's scope. Implemented in `components/hero/` + `lib/hero-shards.ts`.
>
> One thing the build changed from this spec: shards are banded **above and below** the copy, not distributed around it. A ring/annulus was tried first and put shards to the left and right of the headline — but at most viewport widths the headline already fills that space, so they rendered straight through the text. The copy's height is stable across breakpoints while its width isn't, so banding vertically is what actually holds at every aspect ratio.

## 4. Technical architecture

### 4.1 Stack
- **Rendering:** React Three Fiber (R3F) + Three.js, per the environment's `react-three-fiber` skill. Not raw Three.js — R3F's declarative scene graph fits the existing component structure better and composes with Motion for the non-3D parts of the hero (headline, CTA stay as `Reveal`/Motion, only the visual is R3F).
- **Loading:** the R3F/Three.js bundle is dynamically imported (`next/dynamic`, `ssr: false`) so it is never part of the initial JS payload and never blocks first paint or the headline's LCP. The static/CSS fallback (§4.3) is what actually paints first; the 3D scene mounts in after.
- **Scroll/cursor input:** cursor tracked via a lightweight pointer-move listener scoped to the hero section only (not `window`-global) to avoid unnecessary work outside the hero. Scroll response driven by Motion's `useScroll`/`useTransform` against the hero's own scroll progress — GSAP ScrollTrigger is not required for this specific effect; reserve GSAP for the sitewide scroll-storytelling work in §6 if that phase proceeds, to avoid shipping two scroll-animation engines for one effect.

### 4.2 Performance budget
Given `8529cda` (Lighthouse/CWV fixes) and `f8a918c` (a11y) landed recently, this addition must not regress either:
- **LCP:** unaffected by construction — the hero headline is the LCP candidate today (`lcpSafe` `Reveal`) and stays that way; the 3D canvas is decorative and loads after, never gating text paint.
- **TBT/INP:** R3F/Three.js parses and executes off the critical path (dynamic import), but the scene's `useFrame` render loop must be profiled on a mid-tier device before ship — a heavy per-frame cost here is the realistic way this regresses INP, not the bundle size itself.
- **Bundle:** dynamic import means the cost only hits visitors who reach the hero in a capable state (see §4.3) — visitors served the static fallback pay zero Three.js bytes.
- **Target:** hold current Lighthouse scores from `8529cda`'s fix pass; treat any regression there as a blocker, not a follow-up.

### 4.3 Fallback tiers
Four states, not one on/off switch:

| Condition | What renders |
|---|---|
| `prefers-reduced-motion: reduce` | Static image/CSS composition of the same visual — no animation, no WebGL, no listeners attached. Non-negotiable per [[DESIGN]] §3.1 and the existing a11y work. |
| Desktop, capable GPU | Full 3D scene, full particle/geometry count, mouse + scroll reactive. |
| Mobile / touch device | Same scene, reduced particle/polygon count and simplified shaders (no post-processing), scroll-reactive; cursor-reactivity naturally becomes touch-drag-reactive or is dropped in favor of a subtle idle-drift animation — decide per chosen concept in §3. |
| WebGL unavailable / very low-end (feature-detected) | Same static/CSS fallback as the reduced-motion case. |

Feature-detect via a cheap capability check (WebGL context availability + a coarse device-memory/connection heuristic where available) before even issuing the dynamic import — low-end devices should never download the 3D bundle just to discard it.

## 5. Sitewide motion additions (after hero, per priority order)

Once the hero direction is validated, extend the existing patterns rather than introducing new ones where the current implementation already covers the pattern:

1. ~~**Service cards & ticker**~~ — **Done, and deliberately bolder than this item originally specified** (see the amendment in §2). Instead of a lift plus border shift, cards get an angular brand-blue wipe with content inversion and a shard burst echoing the hero. Ticker left CSS-only as specified.
   - Implementation note worth carrying into items 2–4: `<MotionConfig reducedMotion="user">` only governs Motion components and does **nothing** for CSS transitions, so every CSS-driven effect needs its own `prefers-reduced-motion` handling (either Tailwind's `motion-safe:` variant or an explicit media query). §6's reduced-motion guarantee is not automatic outside Motion.
   - Second note: a wipe that inverts text can't be built by translating a panel and transitioning the text `color` — that leaves a window where light text sits on a partly-arrived fill. Reveal a stationary panel via `clip-path` with a pre-inverted copy of the content inside it instead.
2. **Sitewide scroll-reveal consistency** — audit Services/Work/About/Investors/Contact pages against the homepage's `Reveal` usage; several of [[DESIGN]] §3.2's specified patterns (alternating feature blocks on Services/About, case-study reveal on Work) are still unbuilt and should use `Reveal` extended with direction variants (slide-from-left/right per alternating side) rather than a new component.
3. **Nav & micro-interactions** — hover/focus states on nav links, theme toggle transition, mobile menu open/close animation (currently a plain "Open menu" button per the nav's accessibility tree — no confirmed animated state yet).
4. **Route transitions** — brief cross-fade between pages, lowest priority; only worth doing once the above are in place, since it's the least visible improvement relative to effort.

GSAP + ScrollTrigger (already specified in [[DESIGN]] §3.3, still unused in the codebase) is the right tool specifically for item 2's alternating-block choreography if Motion's `whileInView` variants prove too limited for the "assemble from left/right" effect — evaluate Motion first since it's already a dependency, add GSAP only if needed.

## 6. Accessibility (non-negotiable, carries from [[DESIGN]] §3.1 and prior a11y work)

- Every new animated element — 3D hero included — has a reduced-motion static equivalent (§4.3).
- The 3D canvas must not trap keyboard focus or interfere with tab order; if it's purely decorative (no interactive controls beyond ambient cursor/scroll response), mark it `aria-hidden` and ensure it sits behind/outside the focus order entirely.
- No new animation should reintroduce any regression `f8a918c` fixed (contrast, skip link, motion-triggered layout shift).

## 7. Open questions

- ~~**Hero concept (§3):**~~ **Resolved** — Option C, built.
- ~~**Custom 3D geometry scope:**~~ **Moot** — Option A wasn't chosen, so no letterform modelling is needed. The 2D logo redraw flagged in [[DESIGN]] §10 is still outstanding on its own merits.
- **GSAP addition:** still open, still not added. Confirm before adding it as a new dependency for §5 item 2, once that phase is actually reached.
- **Device testing baseline:** still open, and now the main gap in §4.2's verification. The hero's structural perf work is done and verifiable by inspection (capped DPR, shared geometry/materials, no per-frame React state, opaque materials, render loop parked off-screen), and the bundle claim is confirmed — the Three.js chunk is absent from the prerendered homepage HTML. But the §4.2 requirement that the `useFrame` loop "must be profiled on a mid-tier device before ship" has **not** been met: it needs a concrete target (e.g. "Moto G-class Android, 4x CPU throttle in DevTools") before it's a bar anything can be measured against. Treat that profiling pass as outstanding.
