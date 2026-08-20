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
            We build for businesses that can&apos;t afford downtime.
          </h1>
          <p className="mt-4 text-[--text-secondary]">
            Trades and local service businesses run on the phone ringing and
            the job getting done. We build the software that keeps that
            running, and we stand behind every build we ship.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Slide from the left rather than up: each row *is* a horizontal
              construction — the 01/02/03 marker, then the text — so arriving
              along that axis lands the number first and reads in the same
              direction the eye already travels. Vertical reveals on a
              numbered list make the markers bob independently of the rule
              they're meant to sit against. */}
          {DIFFERENTIATORS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.08} from="left">
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
            <h2 className="font-display text-2xl font-semibold">
              Built lean, on purpose.
            </h2>
            <p className="mt-3 max-w-xl text-[--text-secondary]">
              A focused team of specialists per project, not a bloated bench.
              That means more attention on your build and faster decisions,
              not more layers between you and the person doing the work.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
