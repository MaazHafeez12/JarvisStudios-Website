export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-[--text-secondary]">
        Jarvis Studios — scaffold
      </p>
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">
        Step 1: project foundation is live.
      </h1>
      <p className="max-w-xl text-[--text-secondary]">
        Next.js + TypeScript + Tailwind are wired up with the brand color
        system and dark/light theming from{" "}
        <code className="text-[--accent]">docs/DESIGN.md</code>. Real pages
        come next.
      </p>
    </main>
  );
}
