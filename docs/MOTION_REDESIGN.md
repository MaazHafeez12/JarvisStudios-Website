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
  - **Third amendment (scroll-scrubbed stages, §5.8).** Direction given by the user, with theradiuslab.com as the reference: the existing tours *step* — an IntersectionObserver swaps which vignette is showing — and the ask was for motion that *scrubs*, moving exactly as far as the visitor moved it. That is a change of vocabulary, not just of content, so it needs recording here rather than assuming the second amendment covers it.
    - **What is added.** One number, `--p`, written per frame onto a pinned element; every derived value is CSS arithmetic off it (`lib/use-scroll-progress.ts`, the `.stage-*` block in `globals.css`). Three effects sit on top: a frame that grows from a card to full-bleed with its corners melting to square; beats that fade in, hold and fade out on sub-ranges with a directional slide; and scroll-driven `video.currentTime`.
    - **Blur is the one genuinely new item**, and it is worth arguing rather than waving through. This bullet's own list forbids "opacity theatrics on copy", and a blur that resolves as a beat arrives is adjacent to that. The distinction being drawn: the forbidden version is decoration applied to copy that would otherwise simply be there — a headline that breathes for effect. Here the beat is *arriving from somewhere*, the blur is the same distance the slide expresses, and it resolves to zero and stays there for the whole time the beat is readable. It is capped at 4px and confined to `lg` and up (`globals.css`), because a filter on text is a per-frame raster cost and below `lg` the beats have nowhere to travel from anyway. If it ever reads as an effect rather than as arrival, it should be the first thing cut.
    - **What is still forbidden, unchanged:** parallax on text, springs, and any form of scroll-jacking. Scroll is still read, never written.
    - **The cost, recorded like the tour's.** The hero pin adds ~25svh and the thread film ~800svh to `/services`. The hero was deliberately cut from 190 to 125 during the build for a reason worth keeping: past the point the copy has ridden out it has nothing left to show, because `lib/hero-shards.ts` distributes shards on an annulus and the centre is empty by construction. A pinned section with nothing on it reads as a page failing to load. **A stage should be exactly as long as it has content for** — measure the dead stretches (`p` ranges where nothing is legible) rather than picking a length by eye.
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

### 5.6 Services page motion pass — built

`/services` shipped with five `Reveal` fade-ups, one staggered list re-form that only fires *after* the visitor answers the diagnostic, one tab crossfade, and `transition-colors` hovers. The six service lines — the substance of the page — had no scroll motion at all, and the six vignettes had none of any kind. §5.5 skipped this route on purpose and that decision still stands in its own terms; this section amends the *conclusion* drawn from it, which had quietly become "therefore this page gets nothing."

**What changed.** Word-by-word arrival on the H1 (`components/ui/RevealWords.tsx`, `lcpSafe`). Section seams and service-line dividers now draw themselves (`components/ui/Hairline.tsx` — a `scaleX` on the rule that was already there). Each service line settles as it is scrolled to. The situation buttons take the §5.1 angular wipe. The vignettes wipe in and their single brand-blue element lands a beat later. A scroll-linked progress rail runs down the list at `lg`, and below `lg` a swipeable chip strip sits above it. The process tabs share one sliding indicator instead of four fading underlines.

**What did not change, and must not.** The information architecture: diagnostic first, everything expanded by default, nothing hidden, `/services#<id>` deep links intact. No pinned stage on this page, no parallax on text, no scroll-jacking, no `layout`/FLIP on the service list. §5.5 decision 1's reasoning about *layout* is untouched — what it declined was six alternating blocks and a second pinned tour, not motion as such.

Decisions worth not relitigating:

1. **The answer and the arrival are two separable layers, and the second must not be built with `Reveal`.** `Reveal` animates by variant *label* and declares no `animate` prop, so nested inside `ServiceExplorer`'s `LIST`/`ITEM` variant tree it inherits the parent's `visible` propagation and fires on the answer instead of on scroll. The arrival layer is therefore written as inline `initial`/`whileInView` objects, which a parent label cannot drive. This is the one place on the site where using the shared primitive would be the bug.
2. **`useScroll({ target })` cannot track an ancestor of the component that calls it.** The rail was first written as a child of the list with the ref passed down from `ServiceExplorer`; React attaches a parent's ref only after its whole subtree has committed, so the nested rail's layout effect read `target.current === null` and the fill sat at `scaleY(0)` forever — silently, with no warning and no visual except a rail that never moved. `ServiceListRail` now renders the tracked element itself. A component may rely on refs to elements it renders; not on refs owned by an ancestor it sits inside.
3. **`whileInView` cannot observe the element it collapses.** `Hairline` began as one node carrying both `initial={{ scaleX: 0 }}` and `whileInView`; Motion watches the element it animates, so the observed box had zero width and the section seams never drew, at any scroll position, with no error. The observer belongs on the full-width track, the fill takes its state by propagation, and the variant names are deliberately not `hidden`/`visible` so a Hairline nested in another variant tree cannot inherit that tree's label. Applies to anything that animates a scale from zero.
4. **The vignette's hidden state is armed by JS, never the default.** The served HTML is the finished vignette, so JS-off, Reader Mode and failed hydration all get complete illustrations — verified in the prerendered output: zero `vg-armed`, six `vg-scene`, seven `vg-accent`. Arming is additionally skipped for any card not starting fully below the fold, because paint-then-hide-then-reveal is a flash on first load and worse than no animation. This is the inverse of the usual "start hidden, reveal on view" and the inversion is the point.
5. **Every new effect here is CSS, so `<MotionConfig reducedMotion="user">` reaches none of it** (§5 item 1, for the third time). The wipe's two clip states stay unconditional and only its *transition* is gated, so a reduced-motion visitor still sees which situation is selected — it arrives instantly. The vignette rules are wholly inside a `no-preference` query, so reduced motion never hides anything. Both progress readouts are `display: none` under `reduce`: they are motion values piped into `style`, not Motion *animations*, so there is nothing for `MotionConfig` to strip.
6. **The swipe strip is additive, not a replacement.** The vertical list is untouched beneath it; the chips are ordinary anchors to section ids that already existed. Six duplicated service names is the cost, and it buys a phone-sized touch target for a rail that is otherwise a 1px line in a gutter phones do not have. Same reasoning as §5.5 decision 3 — one DOM tree, a breakpoint decides.
7. **The process-tab indicator is the only `layoutId` on this page and that is not a contradiction of `ServiceExplorer`'s FLIP failures.** Those were `layout` applied to tall sections whose *size* had to animate, which Motion does by scaling. A positioned 2px bar never changes size. The arrival motion on the tabs is on the buttons themselves, not on wrappers: a `div` between `role="tablist"` and `role="tab"` breaks the ownership the pattern depends on.

### 5.7 Services process timeline — built

§5.6 left one section of `/services` structurally untouched: the process sequence was still four tab buttons and a crossfading paragraph, with three of its four descriptions behind a click and no visual at all. It is now a scroll-scrubbed pinned timeline — four steps of copy moving past one sticky stage that hands off between four authored scenes, with a horizontal four-node timeline beneath the stage (`components/services/ProcessTour.tsx`, `components/services/ProcessVignette.tsx`).

**This does not reverse §5.5 decision 1.** That declined to turn the *six service lines* into a tour, because `ServiceExplorer` owns them and the page's DIRECTION CONTRACT refuses six alternating blocks. The process steps are different content, and [[DESIGN]] §3.2 specified them as a "numbered step sequence" from the start — §5's anti-pattern list even names this sequence as the one sanctioned exception to "no decorative 01/02/03 numerals", because here the ordering is functionally meaningful.

Decisions worth not relitigating:

1. **The ARIA tabs were removed, and not because they were hard.** `ProcessSteps.tsx` carried a complete APG tabs pattern — roving tabindex, Arrow/Home/End, one stable `role="tabpanel"` — and argued in its own comments for implementing the pattern fully or dropping the roles. It is deleted because **the content no longer has a selector**, not because the pattern was abandoned. The layout underneath the pin shows all four steps and all four visuals at once, so the three hidden panels the tabs cost are simply gone. Net a11y gain; verified zero remaining `role="tab*"` and no dangling `process-panel` reference.
2. **The architecture is `ServiceTour`'s, reproduced rather than re-derived.** Both governing rules carry: no layout branch in JS, and scroll position never becomes React state. So do the three details in that file that exist because the obvious version was wrong — the active index comes from an `IntersectionObserver` band rather than arithmetic on `scrollYProgress` (which drifts at the ends because the stage centre is below the viewport centre and the track's range is `(n × panel) − 100svh`); boundary hits re-test containment against the centre line with a half-open interval rather than trusting entry order; the observer is rebuilt on `resize` because the band is in viewport pixels.
3. **The handoff gesture is reused, not reinvented.** `.tour-layer` and `.tour-stage-card` are shared outright. The pin mechanics duplicate ~10 declarations from `.tour-stage`, deliberately: generalising `.tour-*` into a shared set is the tidier refactor, and re-plumbing a section profiled and documented at 55.6fps to save forty lines of CSS is a bad trade. Both blocks now carry a comment pointing at the other.
4. **The timeline is horizontal.** A vertical gutter rail would have been a second copy of the homepage tour's; horizontal is what makes it read as a *timeline*, which is what the content is. Same construction otherwise — a composited `scaleX`, never an animated `width`, and not `role="progressbar"`, which would announce on every scroll tick.
5. **Four panels at 60svh, not six at 70svh.** `/services` is the longest page on the site and this adds ~240svh to it. That is the accepted cost of the form, but it is why the section is sized tighter than the homepage's.
6. **The scenes are authored, and the constraint is not stylistic.** `PRODUCT.md:58` records that no screenshots or photography of any kind exist, and `:61` that imagery must be authored as illustrative compositions, clearly generic. Each scene shows the *kind of artifact* its stage produces, structure only, one `#00ADEF` element each. The Launch monitoring line is shape without scale for the same reason `SaasVignette`'s is — an axis would invite reading a number the studio never measured.
7. **Assembly reuses `.vg-accent` rather than inventing a second accent vocabulary.** Three groups at 0 / 90 / 180ms, accent at 300ms. Only the trigger differs from §5.6: there it is an armed card entering view, here a layer becoming active — and because it is keyed on state rather than on `once`, it re-runs on the way back up.

### 5.8 Scroll-scrubbed stages — built

Direction given by the user with theradiuslab.com as the reference; the vocabulary change is recorded as §2's third amendment. The complaint was precise: the tours *step*. An `IntersectionObserver` swaps which vignette is showing, so between wipes nothing moves at all — a step, a hold, a step. Scrubbing means the section moves exactly as far as the visitor moved it and stops when they stop.

**The mechanism, once, for the whole site.** `lib/use-scroll-progress.ts` writes one number — `--p`, 0 to 1 across a track — onto a pinned element. Everything else is CSS arithmetic off it. Sub-ranges use a documented remap convention (the `.stage-*` block in `globals.css`); a beat's fade-in / hold / fade-out is `min()` of two ramps. No JS computes a transform, an opacity, or a colour.

The hook is the primitive rather than a component because the two tours own their DOM — their track is a two-column grid and the pinned stage is one of its children, so there is no wrapper to hand them. `components/motion/ScrollStage.tsx` is a thin shell for everything else.

Decisions worth not relitigating:

1. **No GSAP, no Lenis, no `scroll-timeline`.** §7 closed GSAP as "not needed, not added"; that holds — this is `position: sticky`, one custom property, and `calc()`. The reference site does the same thing, which is worth knowing: none of what it does needs a library.
2. **`--p` is a registered `@property` of `syntax: "<number>"`.** The style system stores a parsed number instead of re-tokenising a string every frame, and the registered `initial-value: 0` is simultaneously the server render, the pre-hydration frame, the no-JS state and the reduced-motion state. **Every stage is authored so that `--p: 0` is a coherent resting frame**, never a blank one.
3. **No layout reads in the scroll callback.** Track offset and range are measured on mount, on resize, and on re-entering the viewport. `getBoundingClientRect()` per frame is the usual way a section like this ends up janky for no visible reason.
4. **The tours kept their discrete channel.** The `IntersectionObserver` handoff and the angular `clip-path` wipe are unchanged — decision 2 of §5.7 still holds and the arithmetic alternative is still wrong. What was added is continuous sub-motion *within* each layer's slice of the track (`--local` in `globals.css`), applied to all three layer states rather than only the active one: scoping it to `[data-state="active"]` makes the outgoing layer snap 9px at every handoff, inside the sliver the wipe has not yet clipped.
5. **Both rails dropped Motion.** `useScroll` feeding a motion value into `scaleY`/`scaleX` became `transform: scaleY(var(--p))`. One progress source per section instead of two measuring the same element, and `motion/react` left both tour bundles.
6. **The film's resting frame is authored, not captured** (`components/motion/ThreadStill.tsx`). A weave with one thread pulled, drawn on `currentColor` — so the section is complete before the video loads, and stays complete if it never does. `components/motion/ScrubVideo.tsx` is transparent until `loadeddata` rather than painting a black box over it, and the source ladder ships **empty**: pointing at files that do not exist would cost every visitor a failed request for no picture.
7. **The film frame is dark in both themes.** Not a theming oversight. The veil is a dark gradient, the beat copy is white so it survives arbitrary footage, and `ThreadStill` draws on `currentColor`; a themed frame gave grey hairlines on near-white with a grey vignette over them, and white beat copy that vanished wherever it overhung the frame. The beats are also sized to exactly the frame's width for that last reason.
8. **Scrub video must be encoded all-intra.** With a normal GOP a seek decodes forward from the last keyframe, so scrubbing backwards decodes most of a group per frame. No amount of code fixes it. `ScrubVideo` holds a `requestVideoFrameCallback` seek-lock so fast scrolling cannot queue seeks faster than the decoder retires them, but that is the second-order problem.
9. **`isConstrainedClient()` was split out of `detectHeroTier()`.** The film shares the reduced-motion / save-data / slow-connection / low-memory checks but not the WebGL probe — a device with no WebGL context plays H.264 perfectly well, and gating the film on `detectHeroTier() !== "static"` would deny it to visitors who could see it fine.

**Measured**, method per §7 — 375×812, 4× CPU, 4 cores, production build, driven by a continuous fling rather than a stepper:

| Section | fps | p95 frame | worst | LoAF |
|---|---|---|---|---|
| Homepage hero | 58.8 | 17ms | 50ms | 0 |
| Homepage service tour | 60.0 | 17ms | 17ms | 0 |
| Services process tour | 60.0 | 17ms | 17ms | 0 |
| Services thread film | 59.2 | 17ms | 33ms | 0 |

The tour figures are better than the 55.6fps / 66ms / 4 LoAF recorded in §7 for the same section before this pass, which is the expected direction: the per-frame work went from Motion writing motion values to one `setProperty` of a registered number.

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
- ~~**`/services` reduced-motion verification (§5.6, §5.7):**~~ **Closed.** Run over CDP with `Emulation.setEmulatedMedia`, at 1280×800 and 375×812, against the running build. `matchMedia` agrees; the process stage is `display: none`, its list a plain block stack with `scroll-snap-type: none`, panels `static` at `min-height: 0`, all four descriptions visible, all four carrying their own visual; every layer transition computes `0s`, so no wipe is reachable; every scene group and accent sits at `opacity: 1`, so nothing is hidden from a reduced-motion visitor; `.svc-rail` and `.svc-strip-fill` are `display: none`; no horizontal overflow. The no-preference control on the same run flips all of it back (stage `flex`, panels `min-height: 480px`, transitions `0.42s`, rails `block`), which is what makes the reduce result meaningful rather than a page that failed to load.
- **Scroll-cost profiling for `/services` is still open, and the naive version of it is misleading.** A 4×-CPU, 4-core, Slow-4G pass over the production build reports **zero long animation frames and zero long tasks** on both `/services` and `/` at 375×812 and 1280×800 — that part is solid, and it says the per-scroll script cost is absent. The **fps figures from that harness are not comparable to the table above**: it reported a locked 60fps for the homepage tour, which this table records at 47.7fps under the same nominal conditions. The difference is the scroll driver — stepping 120px and awaiting one `rAF` per step samples a *paced* scroll, so dropped frames during a fling never appear. Running the homepage as a control is what exposed that; without it the run would have read as a straight improvement. Anyone closing this needs a driver that produces continuous fling-speed scrolling, not a stepper.
