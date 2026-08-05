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
    <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {ENGAGEMENT_FACTS.map((fact, i) => (
        <Reveal key={fact.headline} delay={i * 0.06}>
          <div className="border-t border-[--border] pt-5">
            <dt className="font-display text-xl font-semibold">
              {fact.headline}
            </dt>
            <dd className="mt-2 max-w-sm text-sm leading-relaxed text-[--text-secondary]">
              {fact.detail}
            </dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
