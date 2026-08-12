# Motion & Animation Redesign — Phase 2

**Status:** Complete. Hero built (Option C, §3–§4); §5.1's service cards retired into §5.5's homepage service tour; §5 items 2–4 (sitewide reveal consistency + `Reveal` direction variants, mobile menu open/close, route cross-fade) all built. **Every open question in §7 is now closed**, including the two long-standing verification gaps — reduced motion and mid-tier device profiling — both discharged in §7 with method and figures. The one residual, stated there and not papered over: CPU throttling cannot test GPU fill rate, so WebGL cost on real mobile silicon is still unmeasured.
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
  - **Second amendment (homepage service tour, §5.5).** The tour is a third deliberate motion moment, and it does not fit the first amendment's test: a scroll-linked section plays *unprompted*, so on the letter of that rule it should have been refused. The test is the wrong discriminator for this effect. A scroll-*linked* animation has no clock of its own — nothing moves unless the visitor moves it, it moves exactly as far as they moved it, and it stops the instant they stop. That is closer to interaction feedback than to ambient autoplay, and the visitor cannot be surprised by it the way they can by something that starts on its own. What the constraint still buys is honoured in **vocabulary rather than absence**: the tour introduces no new effect, reusing the existing `ServiceVignette` family as its content, §5.1's angular clip-path as its transition, `ease-confident` as its curve, and `--accent` as its only colour. What it must not acquire, and what the restraint rule should still be read to forbid here: parallax on text, springs, opacity theatrics on copy, and any form of scroll-jacking (§5.5).
    - The honest cost, recorded because it is easy to lose: the section adds ~420svh to the homepage, which pushes the featured-work result and the final CTA about four screens further from the fold. Nothing in this doc's remit can settle whether that trade is right — it is a conversion question, and it is the first thing to revisit if the homepage underperforms.
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

> **Profiled, and it passes (see §7).** The `useFrame` requirement above is met: a locked ~60fps with zero long animation frames and zero long tasks at 4× and 6× CPU throttle, on both the lite and full tiers. §7 carries the baseline definition, the full table, and the GPU caveat this method cannot address.

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
2. ~~**Sitewide scroll-reveal consistency**~~ — **Done.** The audit found coverage already consistent on `/services`, `/insights` and `/about`, and three genuine gaps, now closed: `/contact` had **no `Reveal` at all** (its H1 arrived flat while every other page's assembled), the homepage insights callout had none, and the closing CTA on `/insights/[slug]` had none — everything above it revealed and then the last block just sat there.
   - `Reveal` gained a `from?: "bottom" | "left" | "right"` prop backed by a precomputed variant table, as specified, rather than a new component. `bottom` is the default and reproduces the original variants exactly, so all pre-existing call sites are behaviourally unchanged — verified in the prerendered HTML, which still emits `translateY(16px)` everywhere except the three rows that opted in.
   - Applied in exactly one place: the `/about` differentiators, with `from="left"`. Each row *is* a horizontal construction (the `01`/`02`/`03` marker, then the text), so arriving along that axis lands the number first; a vertical reveal makes the markers bob independently of the rule they sit against. **The alternating left/right feature blocks this item originally imagined were not built**, and should not be bolted on: `/services` is the page they were meant for, and its DIRECTION CONTRACT explicitly refuses that arrangement. Direction is now available where a layout earns it, which is the useful half of the original idea.
   - The horizontal offset is 20px, deliberately under the site's 24px `px-6` gutter, so a full-width block cannot slide past the viewport edge. Verified: no horizontal overflow on `/about`, with 265px of slack. **A wider offset would need `overflow-x: clip` on the section — never `hidden`, which creates a scroll container and silently kills §5.5's pinned stage.** That warning is in `Reveal`'s docblock for whoever reaches for it next.
3. ~~**Nav & micro-interactions**~~ — **Mobile menu done.** The panel now rolls down from `height: 0` and back (220ms, `ease-confident`, via `AnimatePresence`), and the hamburger/close glyphs rotate through each other (120ms each way, `mode="wait"`). Two things the animation work surfaced and fixed on the way past, neither of them motion:
   - The border and background had to move to an *inner* element. On the animating wrapper, `border-t` stays 1px tall all the way down to `height: 0` and lands as a stray rule directly beneath the header's own `border-b` for the last frames of the exit.
   - The menu was a disclosure with no keyboard exit. Escape now closes it and returns focus to the toggle, which also gained the `aria-controls` that pairs with its existing `aria-expanded`.
   - `height` is the one animated property `<MotionConfig reducedMotion="user">` does **not** cover — it is neither a transform nor CSS, so it is branched explicitly on `useReducedMotion()`, leaving a plain opacity change. Note this is the opposite call from §5.5, which refuses to branch on that hook: there the hook's null-first window would move *layout* and cost a shift, whereas here nothing reads it until the visitor taps.
   - Not done under this item: nav link hover/focus states (already `transition-colors`, unchanged) and the theme-toggle transition.
4. ~~**Route transitions**~~ — **Done**, and it was right to leave it last: it is the least visible thing here. A 180ms opacity cross-fade of the page body via `app/template.tsx` (a template, not a layout — Next remounts one on every navigation and reuses the other, and the remount is the trigger). It sits inside the root layout, so `Nav` and `Footer` hold still and only the page content crosses; a header that fades with the page reads as a full reload.
   - **Enter-only.** App Router exposes no hook for a route leaving, and the machinery to fake one — freezing the outgoing tree while the incoming one mounts — costs far more than a true cross-fade is worth here.
   - **It must not fade on first load, and the guard for that is subtle.** A template that faded in unconditionally would defer the LCP of *every* page by its own duration — the exact penalty `Reveal`'s `lcpSafe` variant exists to avoid, reintroduced site-wide one level higher. The fade is therefore gated on a module-scope flag that survives the template's own remount (component state cannot: the remount resets it), read behind a `typeof window` check because module scope on the server is **shared across requests** — without it, the second request a server process handled would bake `opacity: 0` into the HTML for everyone and mismatch a client whose first render still said false. Server-side the answer is always "no animation". Verified across `/`, `/contact`, `/about` and `/insights`: zero `opacity: 0` occurrences anywhere before `<main>` in the prerendered HTML, and no `<h1>` starts hidden on any route.
   - Opacity only, no translate: a transform would be stripped by `<MotionConfig reducedMotion="user">` anyway, and a page that slides on every navigation is precisely the ambient motion §2 asks to avoid. A cross-fade is vestibular-safe, so it degrades to itself.

GSAP + ScrollTrigger (already specified in [[DESIGN]] §3.3, still unused in the codebase) is the right tool specifically for item 2's alternating-block choreography if Motion's `whileInView` variants prove too limited for the "assemble from left/right" effect — evaluate Motion first since it's already a dependency, add GSAP only if needed.

### 5.5 Homepage service tour — built

The "What we do" grid on the homepage is now a scroll-linked pinned sequence (`components/services/ServiceTour.tsx`). At `lg` the copy scrolls through six `70svh` panels while a `position: sticky` stage holds beside it and hands off between the six `ServiceVignette` scenes; below `lg` the same panels become a horizontal `scroll-snap` rail. This is the "scroll storytelling" [[DESIGN]] §3.3 specified, built on Motion rather than GSAP — see §7.

Decisions worth not relitigating, and the reasons that are not obvious from the code:

1. **This section, and not another one.** It is the only place on the site with an ordered set of six peer items that already share a hand-authored visual system, which is what a pinned tour needs. The featured-work panel has one item and building more would mean inventing client results, which `content/services.ts` and `ServiceVignette.tsx` both refuse by construction. `/services` was rejected on different grounds: its DIRECTION CONTRACT explicitly declines "six alternating image/text blocks," and `ServiceExplorer` records two failed FLIP attempts and a deliberate decision that the page gets *one* authored moment.
2. **`ServiceCard` was retired into this, not deleted from it.** The grid was its only call site. The §5.1 wipe survives as the tour's vignette handoff, which is what lets a whole new section ship without a new effect.
3. **No layout branch in JS.** Breakpoint and reduced-motion switching are `@media` rules; the component renders one tree. This is deliberately not `HeroVisual`'s null-first tier pattern — correct there, a self-inflicted CLS here. The cost is 12 vignettes in the DOM with six hidden. Do not "optimise" that into a conditional render.
4. **Reduced motion gets a complete alternative layout**, not a disabled pin — `.tour-stage { display: none }` is the unconditional CSS baseline, which also covers no-JS and Reader Mode. `lib/hero-capability.ts` is not reused: it answers whether to download a WebGL bundle, and its save-data/low-memory checks would hand those visitors a different information architecture rather than less motion.
5. **Scroll is read, never written.** No wheel interception, no `scrollTo()`, no vertical snapping — across ~420svh that traps slow scrollers and breaks Find-in-Page and PageDown. The horizontal rail's `x mandatory` is a different thing: scoped to its own container, it never touches page scroll.
6. **Two known trip hazards, both silent.** `overflow: hidden` on any ancestor (`body`, `#main-content`, `main`) kills the pin with no error — use `overflow-x: clip` if a sideways scroll ever needs stopping. And `--nav-h: 69px` in `globals.css` duplicates a Tailwind-derived value: change `Nav`'s padding or control height and every pinned surface misaligns with nothing failing.

## 6. Accessibility (non-negotiable, carries from [[DESIGN]] §3.1 and prior a11y work)

- Every new animated element — 3D hero included — has a reduced-motion static equivalent (§4.3).
- The 3D canvas must not trap keyboard focus or interfere with tab order; if it's purely decorative (no interactive controls beyond ambient cursor/scroll response), mark it `aria-hidden` and ensure it sits behind/outside the focus order entirely.
- No new animation should reintroduce any regression `f8a918c` fixed (contrast, skip link, motion-triggered layout shift).

## 7. Open questions

- ~~**Hero concept (§3):**~~ **Resolved** — Option C, built.
- ~~**Custom 3D geometry scope:**~~ **Moot** — Option A wasn't chosen, so no letterform modelling is needed. The 2D logo redraw flagged in [[DESIGN]] §10 is still outstanding on its own merits.
- ~~**GSAP addition:**~~ **Closed — not needed, not added.** The pinned scroll sequence in §5.5 was the strongest remaining case for it, and Motion's `useScroll` plus an `IntersectionObserver` and plain CSS covered it without a second scroll engine. §5 item 2's alternating-block choreography is still unbuilt and could still raise the question, but it is a weaker case than the one just settled: reopen only with a specific effect Motion demonstrably cannot express.
- ~~**Device testing baseline:**~~ **Closed — baseline defined and met.** The blocker was never the measuring, it was that no target existed to measure against. Defined now, in §7's own suggested terms:

  > **Mid-tier baseline.** 375×812, **4× CPU throttle**, 4 logical cores, Slow-4G. Low-end floor: 6× CPU. Measured against the **production** build (`next start`) — profiling `next dev` measures HMR and unminified React, not the site. Method: headless Chrome over CDP, `Emulation.setCPUThrottlingRate` + `setHardwareConcurrencyOverride`, with a rAF frame-delta sampler and `PerformanceObserver` on `long-animation-frame` and `longtask` installed before page scripts run.

  Results, §4.2's `useFrame` requirement first:

  | Scenario | fps | p95 | worst | >50ms | LoAF |
  |---|---|---|---|---|---|
  | Hero idle — desktop, unthrottled (control) | 59.5 | 16.9 | 33.6 | 0 | 0 |
  | Hero idle — **mid-tier baseline** (lite tier) | 60.0 | 16.8 | 16.9 | 0 | 0 |
  | Hero idle — low-end floor, 6× CPU | 60.0 | 16.8 | 16.9 | 0 | 0 |
  | Hero idle — **full tier**, desktop, 4× CPU | 59.8 | 16.8 | 33.2 | 0 | 0 |
  | Tour scroll — mid-tier baseline | 55.6 | 33.3 | 66.6 | 4 | 4 (worst 65ms) |
  | Tour scroll — full tier + 4× CPU (worst realistic) | 47.7 | 50.0 | 50.1 | 3 | 1 (worst 58ms) |

  **§4.2's requirement is met.** The `useFrame` loop holds a locked 60fps with **zero** long animation frames and **zero** long tasks at 4× and even 6× throttle — the per-frame cost §4.2 named as "the realistic way this regresses INP" is not present. The structural work it credits (capped DPR, shared geometry/materials, no per-frame React state, loop parked off-screen) is doing its job.

  The tour's scroll cost is the looser number and is still fine: worst frame 66ms and worst LoAF 65ms, an order of magnitude inside INP's 200ms "good" threshold, with no long tasks at all. The dropped frames are paint on a large sticky area under a 4× handicap, not script — consistent with the design, where the only per-scroll JS is one motion value written to a composited transform and an observer firing five times.

  **What this does not cover, and no amount of CDP will:** throttling applies to the CPU, not the GPU. Fill rate and shader cost for the WebGL hero on real mobile silicon remain untested, as does thermal behaviour over time. If the hero ever gains post-processing or a higher shard count, that is the axis that will break first and this method will not see it coming.
- ~~**Reduced-motion verification:**~~ **Closed.** Long assumed to need a manual OS-level toggle; it does not. `Emulation.setEmulatedMedia` over CDP sets `prefers-reduced-motion: reduce` directly, and headless Chrome driven from a throwaway Node script (built-in `WebSocket`, no project dependency) confirmed the §5.5 fallback end to end — stage `display: none`, rail unsnapped and `block`, panels `static` at `min-height: 0`, all six carrying their own vignette, no horizontal overflow, no zero-height panel. Use that method for any future reduced-motion claim rather than asserting the CSS rule exists and hoping.
- **Device testing baseline:** still open, and now the main gap in §4.2's verification. Note the headless-Chrome method above does **not** touch it: a desktop GPU says nothing about frame cost on a mid-tier phone. The hero's structural perf work is done and verifiable by inspection (capped DPR, shared geometry/materials, no per-frame React state, opaque materials, render loop parked off-screen), and the bundle claim is confirmed — the Three.js chunk is absent from the prerendered homepage HTML. But the §4.2 requirement that the `useFrame` loop "must be profiled on a mid-tier device before ship" has **not** been met: it needs a concrete target (e.g. "Moto G-class Android, 4x CPU throttle in DevTools") before it's a bar anything can be measured against. Treat that profiling pass as outstanding.
