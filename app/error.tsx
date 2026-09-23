"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";

// Route-level error boundary. Until this existed, a render error anywhere in
// a route segment fell through to Next's built-in error page — which on a
// production build is a bare "Application error: a client-side exception has
// occurred" with no nav, no footer, and no way back to the site.
//
// This renders *inside* app/layout.tsx, so Nav and Footer stay put and the
// page still looks like the site. Deliberately shaped like app/not-found.tsx:
// someone who hits either one should land somewhere recognisable, not on a
// stack trace.
//
// `reset()` re-renders the segment. It genuinely fixes the transient class of
// failure (a chunk that failed to fetch on a flaky connection, a hydration
// race) and does nothing for a deterministic one — hence the second, always-
// works route home next to it rather than a retry button on its own.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Goes to the Vercel function/browser logs. This is the whole of the
    // site's client-side error reporting today — there is no Sentry or
    // equivalent wired up, so an error here is visible only if someone looks.
    console.error("[app/error] unhandled render error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-(--accent)">Error</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">
        Something broke on our end.
      </h1>
      <p className="mt-3 text-(--text-secondary)">
        That&rsquo;s our fault, not yours. Try again — and if it keeps
        happening, tell us and we&rsquo;ll fix it.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md border border-(--border) px-5 py-2.5 text-sm font-medium transition-colors duration-150 ease-confident hover:border-(--accent) hover:text-(--accent)"
        >
          Back to homepage
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* The digest is the only handle on a production error: stack traces are
          stripped from the client, and this id is what ties what the visitor
          saw to the server log entry. Shown so someone reporting the problem
          can quote it. */}
      {error.digest && (
        <p className="mt-10 font-mono text-xs text-(--text-secondary)">
          Reference: {error.digest}
        </p>
      )}
    </main>
  );
}
