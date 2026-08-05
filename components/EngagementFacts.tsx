import { Reveal } from "@/components/ui/Reveal";
import { ENGAGEMENT_FACTS } from "@/content/engagement";

// Commercial terms block for the Services page. The page previously ran
// ~265 words with no pricing signal, no timeline, and no engagement model,
// so every enquiry had to spend a conversation establishing all three.
//
// Deliberately restrained: this is ambient content, and per
// docs/MOTION_REDESIGN.md §2 (as amended) only interaction feedback gets
// the bolder treatment. It inherits the page's existing Reveal on scroll
// and adds no motion of its own.

export function EngagementFacts() {
  return (
    <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
      {ENGAGEMENT_FACTS.map((fact, i) => (
        <Reveal key={fact.label} delay={i * 0.06}>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
              {fact.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {fact.value}
            </p>
            <p className="mt-2 max-w-sm text-sm text-[--text-secondary]">
              {fact.detail}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
