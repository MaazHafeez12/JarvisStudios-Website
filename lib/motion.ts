// The site's one easing curve, in the form Motion wants it.
//
// This is the same value as Tailwind's `ease-confident`
// (tailwind.config.ts) — CSS transitions should use that class and JS
// animations should import this, so the two never drift. It was previously
// hand-copied as a literal tuple in five files; a sixth copy is what made it
// worth extracting.
export const EASE = [0.16, 1, 0.3, 1] as const;
