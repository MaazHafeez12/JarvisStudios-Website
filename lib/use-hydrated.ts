import { useSyncExternalStore } from "react";

// False during the server render and hydration, true from then on. Used to
// gate values that only exist on the client (device capability, viewport)
// without the render-then-setState-in-an-effect round trip.
//
// The store never changes, so subscribe is a no-op. What does the work is
// the pair of snapshots: React hydrates with the server one, so the first
// client render matches the HTML, and then immediately re-renders with the
// client one. On a client-side navigation there is no hydration, so the
// component gets `true` on its first render and skips the server-shaped
// frame altogether.
//
// Deliberately a flag and not a generic "client value" hook. getSnapshot runs
// on every render, and the values gated on this (detectHeroTier's WebGL
// probe, for one) are too expensive for that. Callers compute them once with
// useMemo keyed on this flag.
const subscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
