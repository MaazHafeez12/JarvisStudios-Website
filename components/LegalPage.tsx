import { Reveal } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/format-date";
import type { LegalDocument } from "@/content/legal";

// Shared renderer for the two legal documents in content/legal.ts. A server
// component — nothing here is interactive, so none of it belongs in the
// client bundle.
//
// ON THE ABSENCE OF SCROLL REVEALS IN THE BODY.
// Every other long-form page on this site wraps each block in <Reveal>. This
// one deliberately does not, and only the header animates. A privacy policy
// is reference material: people arrive at it hunting for one specific clause
// — usually "how do I get this deleted" — and scroll fast. Content that fades
// in as you reach it makes a document actively harder to scan, which is the
// opposite of what motion is for (docs/MOTION_REDESIGN.md §2: restraint
// governs ambient motion). The page still gets the site's entrance; the text
// underneath just stays put.

/** Stable, readable anchor ids so a specific clause can be linked to. */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalPage({ document: doc }: { document: LegalDocument }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Reveal lcpSafe>
        <h1 className="font-display text-4xl font-semibold">{doc.title}</h1>
        <p className="mt-3 text-[--text-secondary]">{doc.description}</p>
        {/* <time> rather than a bare string: the date is the one piece of
            metadata that tells a reader whether this page is current, and it
            should be machine-readable for the same reason. */}
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
          Last updated{" "}
          <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
        </p>
      </Reveal>

      <div className="mt-10 border-t border-[--border] pt-10">
        {doc.intro.map((paragraph, i) => (
          <p
            key={i}
            className="mb-5 max-w-[65ch] leading-relaxed text-[--text-primary]"
          >
            {paragraph}
          </p>
        ))}

        {doc.sections.map((section) => {
          const id = slugify(section.heading);
          return (
            <section key={id} id={id} className="mt-12 scroll-mt-24">
              <h2 className="font-display text-xl font-semibold">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-4 max-w-[65ch] leading-relaxed text-[--text-secondary]"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 max-w-[65ch] space-y-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 leading-relaxed text-[--text-secondary]"
                    >
                      {/* A marker drawn in the accent rather than a default
                          disc, matching the numbered markers on /about.
                          aria-hidden because list semantics already convey
                          "this is an item" — the glyph is decoration. */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-[--accent]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
