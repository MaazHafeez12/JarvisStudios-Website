// Structured content for the Insights section — studio-authored articles on
// process and engineering decisions. Typed content, not a database, same
// pattern as content/services.ts and content/process.ts.
//
// These are opinion and process pieces, not case studies: they explain how
// and why the studio works the way it does, grounded in facts already
// established elsewhere in this codebase (content/process.ts,
// content/services.ts, content/engagement.ts) rather than client outcomes,
// metrics, or names — none of which exist yet (see PRODUCT.md "Evidence on
// Hand"). Nothing here is invented to sound like proof; it's the studio's
// own reasoning, which it can state plainly without evidence of delivery.

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date. The date each piece was actually written, not a backdated one. */
  publishedAt: string;
  body: string[];
}

export const INSIGHTS: InsightPost[] = [
  {
    slug: "four-steps",
    title: "The four steps behind every project we run",
    excerpt:
      "Discovery, design, build, launch — why the order matters more than the labels.",
    publishedAt: "2026-08-05",
    body: [
      "Every project we take on moves through the same four stages: discovery, design, build, launch. The labels aren't the point — plenty of studios use the same four words and mean something completely different by them. What matters is the order, and what we refuse to skip.",
      "Discovery comes first because it's the stage most easily skipped under time pressure, and the most expensive to skip. It's not a formality before the \"real work\" starts — it's where we find out what the real work actually is. A request that arrives as \"we need an app\" usually turns out to be a narrower, more specific problem once we've asked enough questions about the business, the users, and the constraints nobody put in the first email.",
      "Design comes before a single line of production code, not after. Wireframes and interface decisions get reviewed with the client while they're still cheap to change. The alternative — building first and adjusting the interface once the backend is already opinionated about it — is how projects end up with UI compromises nobody actually chose, just inherited.",
      "Build is iterative, not a single disappearance followed by a reveal. We'd rather show a rough version of the right thing early than a polished version of the wrong thing late. Regular check-ins during this stage exist so that if we've misunderstood something from discovery, it surfaces in week two, not week eight.",
      "Launch is the stage most often treated as the finish line, and we don't treat it that way. Shipping is when real users start finding the edge cases nobody thought to ask about in discovery. We stay through that — monitoring, support, the unglamorous week after the glamorous one — because that's when a project either holds up or doesn't.",
    ],
  },
  {
    slug: "ai-automation-with-a-human-in-it",
    title: "What we actually mean by \"AI automation\"",
    excerpt:
      "Not a chatbot bolted onto your product. Automation with a person still in the loop where it matters.",
    publishedAt: "2026-08-05",
    body: [
      "\"AI automation\" gets used to mean almost anything right now, so it's worth being specific about what we mean when we offer it as a service: automating the parts of a workflow that are genuinely mechanical — the copy-paste between systems, the manual data entry, the first-pass draft of something a person will still review — without quietly removing the person from decisions that still need one.",
      "That distinction shows up in the shape of what we build. A document or data pipeline we automate still has a review step in it, not because the model can't be trusted in the abstract, but because the cost of a wrong answer going out unreviewed is almost always higher than the cost of a person spending thirty seconds confirming it. Automation that removes that checkpoint to save thirty seconds is optimizing for the wrong thing.",
      "In practice this covers three kinds of work: internal workflow and back-office automation — the spreadsheets-and-copy-paste category of manual work that eats a team's time without needing their judgment; LLM features inside a product you're building, like search, drafting, or classification, where the model assists rather than decides; and document or data pipelines that route work to a person at the point where a decision actually needs making.",
      "None of this requires the automation to be invisible. The workflows we build make it obvious to the people using them where the automated part ends and their own judgment starts — because a system that quietly blurs that line is the failure mode we're specifically building against, not an acceptable tradeoff for speed.",
    ],
  },
  {
    slug: "why-we-quote-scope-not-a-price-list",
    title: "Why we quote a scope before we quote a price",
    excerpt:
      "$1,000 is where projects start, not what most of them cost. Here's the actual reasoning.",
    publishedAt: "2026-08-05",
    body: [
      "Our services page states plainly that projects start at $1,000 and that most work runs four to eight weeks. Read next to each other, those two numbers invite a rate calculation that would misrepresent almost every project we take on — so it's worth explaining what each one is actually for.",
      "The $1,000 figure is a floor, not a typical price. It's what a small, well-defined scope costs — the kind of project where the brief is already clear and the work is genuinely bounded. It exists so that a visitor with a small, real need can tell immediately that they're not below our minimum, rather than finding out three emails into a conversation.",
      "Everything larger than that gets quoted against the actual scope, before the work starts rather than after. We don't have a public price list for that tier for the same reason most studios don't: the honest answer to \"what does a SaaS product cost\" depends entirely on what it needs to do, and a number given without that context is either a lowball that grows once the real scope appears, or padding to cover for not knowing yet. Neither is a number worth publishing.",
      "The same reasoning applies to how we structure the engagement itself. Fixed scope suits a project with a clear finish line — a defined brief, a defined result. A retainer suits ongoing work with no fixed endpoint. We'll say which one we think fits before you have to guess, for the same reason we'd rather tell you the price depends on the scope than hand you a number that doesn't.",
    ],
  },
];
