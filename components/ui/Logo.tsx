import Link from "next/link";

/**
 * The source logo (public/logo.svg) has a black background baked in and
 * can't safely be made transparent without a proper vector redraw — see
 * docs/DESIGN.md §2.1 and §10. Interim fix: contain it in a fixed-size
 * rounded box so it reads correctly on both light and dark nav/footer
 * backgrounds without touching the source file.
 *
 * Loaded as a plain <img> (not inlined) so the browser fetches and caches
 * it once across all pages, rather than bundling all ~250KB of its
 * auto-traced path data into the JS bundle.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md"
      aria-label="Jarvis Studios — home"
    >
      <span className="block h-9 w-9 overflow-hidden rounded-md">
        <img
          src="/logo.svg"
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-[--text-primary]">
        Jarvis Studios
      </span>
    </Link>
  );
}
