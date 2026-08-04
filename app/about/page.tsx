import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { DIFFERENTIATORS } from "@/content/differentiators";

export const metadata: Metadata = {
  title: "About — Jarvis Studios",
  description: "Mission, team, and differentiation for Jarvis Studios.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal lcpSafe>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Software built by people who ship.
          </h1>
          <p className="mt-4 text-[--text-secondary]">
            Jarvis Studios is a software agency offering web development,
            app development, SaaS, CRM, and marketing/design — one team
            covering the full build, from idea to launch.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {DIFFERENTIATORS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08}>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                <span className="font-mono text-sm text-[--accent] sm:w-12 sm:shrink-0">
                  0{i + 1}
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold">{d.title}</h2>
                  <p className="mt-2 max-w-xl text-[--text-secondary]">{d.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">Team</h2>
            <p className="mt-3 max-w-xl text-[--text-secondary]">
              Team bios are coming soon.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
