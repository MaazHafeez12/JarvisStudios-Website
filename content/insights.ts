// Structured content for the Insights section — studio-authored articles on
// process and engineering decisions. Typed content, not a database, same
// pattern as content/services.ts and content/process.ts.
//
// Most entries here are opinion and process pieces (kind: "note"): they
// explain how and why the studio works the way it does, grounded in facts
// already established elsewhere in this codebase (content/process.ts,
// content/services.ts, content/engagement.ts) rather than invented client
// outcomes. A case study (kind: "case-study") is held to a stricter bar —
// every figure and claim in it must already be published under the client's
// name elsewhere on the site (content/services.ts ServiceProof, the homepage
// featured-work section). It restates and explains that result; it does not
// introduce new numbers, dates, channels, or tactics that aren't already
// on hand. Nothing here is invented to sound like proof.
//
// WHAT IS NOT SIGNED OFF, the same notice content/trades.ts carries: the
// operational claims in the two 2026-09-23 notes (that silence after a quote
// rarely means a considered no, that a slow quote often loses to a fast one)
// are reasoned from the market the site addresses, not measured. They read
// as expertise. Review them as copy.

import type { ProjectType } from "@/lib/types/lead";

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  /**
   * Service lines this piece genuinely covers, used to build the related
   * reading on /services/<id>.
   *
   * Optional, and most posts leave it unset on purpose. `four-steps` and
   * `why-we-quote-scope-not-a-price-list` are about the studio's process and
   * commercial terms and apply to all six equally — tagging them with all six
   * would put the same two links on every service page, which is padding
   * rather than relevance. A post is tagged when it is about that service.
   */
  services?: ProjectType[];
  /** Distinguishes a process note from a client case study. Defaults to a
   *  note; only the listing/detail label treatment reads this. */
  kind?: "note" | "case-study";
  /** ISO date. The date each piece was actually written, not a backdated one. */
  publishedAt: string;
  body: string[];
}

export const INSIGHTS: InsightPost[] = [
  {
    slug: "the-quote-that-goes-quiet",
    title: "The quote that goes quiet",
    services: ["crm", "ai"],
    excerpt:
      "A sent quote with no reply isn't a no. It's a job waiting for someone to remember it.",
    publishedAt: "2026-09-23",
    body: [
      "Most of the effort in winning a job goes in before the quote is sent: the call, the site visit, the measuring, the pricing. Then the quote goes out, and in a lot of businesses that's where the process stops. If the customer replies, great. If they don't, the job slowly becomes one more thing someone meant to chase.",
      "Silence after a quote rarely means a considered no. More often the customer got busy, is waiting on a second price, has a question they haven't got round to asking, or simply lost the email. Every one of those is recoverable with a short message at the right time. None of them is recoverable if nobody sends it.",
      "The reason follow-up doesn't happen isn't laziness. It depends on memory, and memory is the first thing to go in a busy week. There's usually no single list of open quotes, only a sent folder and a vague sense of which ones are still live. And chasing can feel pushy, so it gets put off until it's too late to feel natural.",
      "The fix is less clever than it sounds. Every quote goes into one list the moment it's sent, with its value and how long it's been open. At a set interval, a follow-up goes out automatically, or lands in front of the right person as a task, depending on how much the job is worth. When the customer replies, accepts or declines, the reminders stop. Nobody has to remember anything, and the list shows at a glance what's still in play.",
      "What the message says matters as much as when it arrives. \"Just checking in\" asks the customer to do the work of replying. A useful follow-up gives them a reason to: whether anything in the scope should change, whether the timing still works, or an honest note that the price holds until a given date. For a small job, a template can send that on its own. For a large one, the system should draft it and a person should read it before it goes. That's the same line we draw with any automation, where a machine handles the routine part and a person still makes the call that matters.",
      "Speed on the way out matters too. A quote that takes three days to arrive has often already lost to one that took three hours, which is why we commit to a scope and a real price within 48 hours ourselves. A quote-tracking setup like this is a CRM job, usually a small one, and it can start from the spreadsheet or inbox you already quote from rather than replacing how you work.",
    ],
  },
  {
    slug: "what-a-trades-website-is-for",
    title: "What a trades website is actually for",
    services: ["web"],
    excerpt:
      "Not to impress other businesses. To get the right customer to call you, from a phone, in under a minute.",
    publishedAt: "2026-09-23",
    body: [
      "It helps to picture who's actually on the page. Not a design award panel, and not a competitor. Someone with a problem, often an urgent one, on a phone, comparing you against two or three other results they found in the same search. They aren't reading. They're scanning for three answers: do you do this, do you cover where I am, and how do I reach you right now.",
      "So the phone number goes at the top of every page, and it's a link that dials when you tap it, not a picture of a number or a line of text someone has to copy. It sounds obvious, but a surprising number of sites bury it in the footer or behind a contact page, and every extra step is a chance for the visitor to go back to the search results and tap the next one.",
      "Say where you work, in words a customer would search for: the towns and areas you actually cover, not \"serving the region.\" Say what you do, and just as usefully, what you don't. A site that makes clear you don't take small repairs, or don't travel past a certain distance, loses nothing. The calls it filters out are ones you would have turned down anyway, after spending time on them.",
      "If there's a form, keep it short enough to finish standing on a driveway: name, a way to reach them, and what the problem is. Then say what happens next and when, and keep that promise. \"We'll call you back within two hours during working days\" is worth more than any slogan, because it answers the question the visitor actually has, which is whether sending the form is worth it.",
      "Photos should be of your real work or not be there at all. Stock images of spotless vans and smiling technicians read as exactly what they are, and a customer who notices once will assume everything else on the page is borrowed too. A few honest photos of finished jobs do more than a gallery of someone else's. We hold our own site to the same rule: nothing on it is presented as evidence that isn't.",
      "None of this needs a large site. A fast, clear handful of pages that answers those three questions well will usually beat a sprawling one that answers them slowly. A small, well-defined site is exactly the kind of project our $1,000 starting point exists for, and discovery is free, so the first conversation costs nothing either way.",
    ],
  },
  {
    slug: "snf-construction-group-social-reach",
    title: "SNF Construction Group: reach that compounds, not spikes",
    kind: "case-study",
    services: ["design"],
    excerpt:
      "One published number, 10% month-over-month social growth, and what it takes to make a number like that mean something.",
    publishedAt: "2026-09-07",
    body: [
      "We run content and social management for SNF Construction Group on a monthly retainer, and their social reach has grown roughly 10% month over month since we took it over. That figure is published on our services page and our homepage, and this piece exists to explain what's behind it, not to add a second, more impressive number that nobody measured.",
      "The word doing the work in that sentence is \"month over month.\" A single good month is a spike: one post lands, reach jumps, and the next month it settles back to where it was. Ten percent compounding is a different shape. It means the baseline itself moves up every month, so the same 10% is a larger absolute gain each time. It also means the growth has to come from something repeatable (a posting rhythm, a content approach that keeps working) rather than a one-off that can't be run again.",
      "This is retainer work, not a fixed scope, and that's a deliberate match rather than a default. Our engagement terms say fixed scope suits a project with a known finish line and a retainer suits ongoing work with no fixed endpoint. Social growth has no finish line: the moment you stop publishing, reach decays. A fixed-scope \"social launch\" would hand back a channel that starts shrinking the day it's delivered. So the engagement is structured the way the work actually behaves.",
      "Measured monthly is the other half of it. We report the number every month, against the previous month, from the point we took over, which is what makes it a trend instead of a screenshot. A one-time \"reach up 40%\" with no window attached tells you almost nothing: up from when, over how long, and does it hold. A month-over-month figure you can see repeat is a claim that survives being looked at closely.",
      "What we're not putting in this case study is as intentional as what we are. No vanity baseline chosen to make the percentage look bigger, no invented list of tactics, no client quote we wrote ourselves. The result is one honest number with its measurement window attached, and the reasoning is the studio's own. That's the standard for anything we publish under a client's name, and it's the same standard we'd want applied to a number a studio showed us.",
    ],
  },
  {
    slug: "four-steps",
    title: "The four steps behind every project we run",
    excerpt:
      "Discovery, design, build, launch: why the order matters more than the labels.",
    publishedAt: "2026-08-05",
    body: [
      "Every project we take on moves through the same four stages: discovery, design, build, launch. The labels aren't the point. Plenty of studios use the same four words and mean something completely different by them. What matters is the order, and what we refuse to skip.",
      "Discovery comes first because it's the stage most easily skipped under time pressure, and the most expensive to skip. It's not a formality before the \"real work\" starts. It's where we find out what the real work actually is. A request that arrives as \"we need an app\" usually turns out to be a narrower, more specific problem once we've asked enough questions about the business, the users, and the constraints nobody put in the first email.",
      "Design comes before a single line of production code, not after. Wireframes and interface decisions get reviewed with the client while they're still cheap to change. The alternative, building first and adjusting the interface once the backend is already opinionated about it, is how projects end up with UI compromises nobody actually chose, just inherited.",
      "Build is iterative, not a single disappearance followed by a reveal. We'd rather show a rough version of the right thing early than a polished version of the wrong thing late. Regular check-ins during this stage exist so that if we've misunderstood something from discovery, it surfaces in week two, not week eight.",
      "Launch is the stage most often treated as the finish line, and we don't treat it that way. Shipping is when real users start finding the edge cases nobody thought to ask about in discovery. We stay through that (monitoring, support, the unglamorous week after the glamorous one) because that's when a project either holds up or doesn't.",
    ],
  },
  {
    slug: "ai-automation-with-a-human-in-it",
    title: "What we actually mean by \"AI automation\"",
    services: ["ai"],
    excerpt:
      "Not a chatbot bolted onto your product. Automation with a person still in the loop where it matters.",
    publishedAt: "2026-08-05",
    body: [
      "\"AI automation\" gets used to mean almost anything right now, so it's worth being specific about what we mean when we offer it as a service: automating the parts of a workflow that are genuinely mechanical (the copy-paste between systems, the manual data entry, the first-pass draft of something a person will still review) without quietly removing the person from decisions that still need one.",
      "That distinction shows up in the shape of what we build. A document or data pipeline we automate still has a review step in it, not because the model can't be trusted in the abstract, but because the cost of a wrong answer going out unreviewed is almost always higher than the cost of a person spending thirty seconds confirming it. Automation that removes that checkpoint to save thirty seconds is optimizing for the wrong thing.",
      "In practice this covers three kinds of work: internal workflow and back-office automation, the spreadsheets-and-copy-paste category of manual work that eats a team's time without needing their judgment; LLM features inside a product you're building, like search, drafting, or classification, where the model assists rather than decides; and document or data pipelines that route work to a person at the point where a decision actually needs making.",
      "None of this requires the automation to be invisible. The workflows we build make it obvious to the people using them where the automated part ends and their own judgment starts, because a system that quietly blurs that line is the failure mode we're specifically building against, not an acceptable tradeoff for speed.",
    ],
  },
  {
    slug: "why-we-quote-scope-not-a-price-list",
    title: "Why we quote a scope before we quote a price",
    excerpt:
      "$1,000 is where projects start, not what most of them cost. Here's the actual reasoning.",
    publishedAt: "2026-08-05",
    body: [
      "Our services page states plainly that projects start at $1,000 and that most work runs four to eight weeks. Read next to each other, those two numbers invite a rate calculation that would misrepresent almost every project we take on, so it's worth explaining what each one is actually for.",
      "The $1,000 figure is a floor, not a typical price. It's what a small, well-defined scope costs: the kind of project where the brief is already clear and the work is genuinely bounded. It exists so that a visitor with a small, real need can tell immediately that they're not below our minimum, rather than finding out three emails into a conversation.",
      "Everything larger than that gets quoted against the actual scope, before the work starts rather than after. We don't have a public price list for that tier for the same reason most studios don't: the honest answer to \"what does a SaaS product cost\" depends entirely on what it needs to do, and a number given without that context is either a lowball that grows once the real scope appears, or padding to cover for not knowing yet. Neither is a number worth publishing.",
      "The same reasoning applies to how we structure the engagement itself. Fixed scope suits a project with a clear finish line: a defined brief, a defined result. A retainer suits ongoing work with no fixed endpoint. We'll say which one we think fits before you have to guess, for the same reason we'd rather tell you the price depends on the scope than hand you a number that doesn't.",
    ],
  },
];
