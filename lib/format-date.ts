/**
 * Explicit locale and UTC timeZone, not the runtime's defaults — this
 * renders on the server at build time and again on hydration, and
 * `toLocaleDateString()` with no arguments depends on the environment's
 * locale/timezone, which differs between a build server and a visitor's
 * browser. That mismatch is exactly the kind of thing that trips a
 * hydration error elsewhere in this codebase (see lib/seeded-random.ts).
 * Pinning both inputs makes the output identical everywhere.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}
