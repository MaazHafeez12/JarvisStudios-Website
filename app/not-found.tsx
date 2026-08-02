import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <p className="font-mono text-sm text-[--accent]">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">Page not found.</h1>
      <p className="mt-3 text-[--text-secondary]">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
      >
        Back to homepage
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </main>
  );
}
