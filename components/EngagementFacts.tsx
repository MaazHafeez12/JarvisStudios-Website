import { Reveal } from "@/components/ui/Reveal";
import { Hairline } from "@/components/ui/Hairline";
import { ENGAGEMENT_FACTS } from "@/content/engagement";

// Commercial terms block for the Services page. The page previously ran
// ~265 words with no pricing signal, no timeline, and no engagement model,
// so every enquiry had to spend a conversation establishing all three.
//
// Deliberately restrained: this is ambient content, and per
// docs/MOTION_REDESIGN.md §2 (as amended) only interaction feedback gets
// the bolder treatment. Its motion is the page's existing Reveal cascade
// plus the rule above each fact drawing itself — the same Hairline the
// service lines and the section seams use, so the four terms arrive the way
// everything else on this page does (§5.6). Nothing here is bespoke.

export function EngagementFacts() {
  return (
    <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {ENGAGEMENT_FACTS.map((fact, i) => (
        <Reveal key={fact.headline} delay={i * 0.06}>
          <Hairline delay={i * 0.06} />
          <div className="pt-5">
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
