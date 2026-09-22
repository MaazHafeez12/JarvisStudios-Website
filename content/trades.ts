import type { ProjectType } from "@/lib/types/lead";

// Long-form content for the per-trade pages at /for/<id>.
//
// ── WHY THESE EXIST ─────────────────────────────────────────────────────
// The site is positioned for trades and local service businesses — /about
// says so in its first paragraph — but the vocabulary that market searches
// with was almost entirely absent from it. Across every content file before
// this one: "construction" four times, "trades" once, "plumbing" once,
// "roof" once, and nothing at all for HVAC. Meanwhile the six service pages
// compete for "web development" and "CRM" against agencies with orders of
// magnitude more domain authority. "Software for plumbing companies" is a
// search this studio can plausibly win; "web development" is not.
//
// ── WHY THREE AND NOT SIX ───────────────────────────────────────────────
// Six services times six trades is thirty-six pages, and thirty-six pages
// spun from one template with the trade name swapped is the doorway-page
// pattern Google penalises — correctly, because it is what it would be. A
// trade earns a page here when the operational problem is genuinely
// different, not when the noun is. Electrical and roofing are omitted for
// exactly that reason: their call-and-quote economics are plumbing's with a
// different tool in the van, and a near-duplicate of a page already here
// costs more than it earns.
//
// ── THE STANDARD THIS COPY IS HELD TO ───────────────────────────────────
// PRODUCT.md Principle 1 forbids fabricating evidence: results, clients,
// metrics, testimonials. It does not forbid describing work the studio
// offers to a market it has already said it serves.
//
// The line is drawn as follows, and it matters more here than anywhere else
// on the site, because an industry page is where the temptation to imply a
// client list is strongest:
//   - No page says or implies the studio has done this work for this trade.
//   - `proofFrom` pulls a published `ServiceProof` out of content/services.ts
//     rather than restating one, so a result cannot drift from its source or
//     be invented alongside it. Only `construction` sets it, because SNF
//     Construction Group is the only real client result the site publishes.
//   - Every capability named is already in content/services.ts, and every
//     commercial figure is already in content/engagement.ts.
//
// WHAT IS NOT SIGNED OFF, and the same notice service-detail.ts carries:
// the operational claims about each trade — that the out-of-hours gap is
// where plumbing loses most jobs, that maintenance agreements lapse for want
// of tracking — are reasoned from the market the site already addresses, not
// supplied by the business or measured anywhere. They read as expertise.
// Review them as copy before treating them as settled.

export interface TradeFaq {
  question: string;
  answer: string;
}

export interface Trade {
  /** URL slug: /for/<id>. */
  id: string;
  /** Display name, as a heading would use it. */
  name: string;
  /** How this audience refers to itself. Used in copy and in schema. */
  audience: string;
  /** The page's H1. Carries the search term and still reads as a sentence. */
  headline: string;
  /** Meta description and the standfirst under the H1. Under ~155 chars. */
  lead: string;
  /** Body paragraphs. */
  body: string[];
  /** What tends to be broken, in the trade's own terms rather than ours. */
  breaks: string[];
  /**
   * Service lines that genuinely apply, most relevant first. These render as
   * links to /services/<id>, which is the other half of why these pages are
   * worth building: they give the service pages inbound internal links from
   * pages about the problem rather than about the category.
   */
  services: ProjectType[];
  /**
   * Pulls the published proof off that service line in content/services.ts.
   * Never a string — a result restated here in its own words is a result that
   * can drift from the one it came from, or be invented next to it.
   */
  proofFrom?: ProjectType;
  faqs: TradeFaq[];
}

export const TRADES: Trade[] = [
  {
    id: "construction",
    name: "Construction & contracting",
    audience: "construction and contracting businesses",
    headline: "Software for construction and contracting businesses",
    lead: "Estimating, variations, and the phone that rings while everyone is on site — the parts of a contracting business software actually reaches.",
    body: [
      "A contracting business loses money in two places that have nothing to do with the quality of the build. The first is the quote that took four days to go out, by which time the customer has two others. The second is the variation agreed verbally on site and never written down, which turns up months later as a margin that came in under the estimate and an argument nobody can win, because there is no record of what was agreed.",
      "The phone is the third. A call that arrives while you are twenty feet up is a call you return that evening, and the person who rang has spoken to two other contractors by then. An automatic text the moment the call drops does not depend on anyone remembering, and it turns a lost job into a conversation that is still open when you get down.",
      "What this usually needs is not one system. It is a quote that can go out the same day from wherever you are, a written record every time the scope moves, and a pipeline that shows which jobs are waiting on you rather than just which jobs exist. None of that is specific to construction as an industry — it is specific to work that happens away from a desk, which is exactly what generic office software handles badly.",
      "Winning the work is a separate problem from running it, and it is usually solved by different work: a site that says plainly what you build and who for, and enough visible activity that a prospect checking whether you are still trading finds an answer.",
    ],
    breaks: [
      "Quotes that take days because the estimate lives in a spreadsheet on one laptop",
      "Variations agreed on site and never written down",
      "Calls missed while everyone who could answer them is on a job",
      "Job status that exists only in one person's head",
      "A website last updated the year it was built",
    ],
    services: ["crm", "ai", "design", "web"],
    // The one trade in this set where a published result exists. Pulled from
    // the `design` service line rather than restated.
    proofFrom: "design",
    faqs: [
      {
        question: "Do we need the whole thing, or can we start with one piece?",
        answer:
          "Start with one piece. Projects start at $1,000, which is the entry point for a small, well-defined scope — a missed-call text-back on its own is a reasonable first project, and it tells you quickly whether the rest is worth doing. Discovery is free either way, so finding out what you need costs nothing.",
      },
      {
        question: "Our crews aren't technical. Will anyone actually use it?",
        answer:
          "That is the constraint we design to, not a risk we manage afterwards. Anything a crew touches on site has to work on a phone, in one hand, without training — which in practice means a text message or two taps, not a login. The parts that need a screen and a keyboard belong in the office, and we build them that way.",
      },
      {
        question: "We already use job management software. Do we have to replace it?",
        answer:
          "No, and usually you should not. Integrating with the sales and support tools you already run, and migrating data out of spreadsheets or legacy systems, is part of the CRM work. Replacing a system your team has already learned carries a cost that rarely shows up in the quote, so we would want a specific reason before recommending it.",
      },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    audience: "plumbing companies",
    headline: "Software for plumbing companies",
    lead: "Emergency calls, the out-of-hours gap, and quotes written on a tailgate — where a system either holds a plumbing business together or loses it the job.",
    body: [
      "Plumbing demand does not queue. A burst pipe is not a job somebody shops around for over a week — it is three numbers dialled in ten minutes, and the one that answers takes the work. That single fact sets the economics of the whole business: the difference between a good month and a bad one is usually not price, quality, or reviews. It is who picked up.",
      "Which makes the out-of-hours gap the most expensive thing most plumbing companies own, and the least visible, because a call nobody answered leaves no trace. Nothing appears in a calendar. Nothing appears in the accounts. The job simply happened somewhere else. An automatic reply the moment a call drops — acknowledging it, saying when you will ring back, letting them describe the problem in a text — is the cheapest thing on this page to build and usually the first one worth building.",
      "The second is what happens after. Quotes written on a tailgate get typed up that night if they get typed up at all, and follow-ups live in somebody's head. A pipeline that knows a quote went out on Tuesday and nobody has replied is not sophisticated software. It is a list that chases itself, and what it recovers is work that was already won and then quietly dropped.",
      "Repeat customers are the part most systems ignore. A plumber who fitted a boiler three years ago has a service due and no way to know it without opening a filing cabinet. The record already exists in the job history — what is missing is something that reads it and gets in touch.",
    ],
    breaks: [
      "Calls that come in while both hands are under a sink",
      "Nothing after hours except voicemail nobody rings back",
      "Quotes typed up at 9pm, or not at all",
      "Follow-ups that depend on remembering",
      "Repeat work sitting in old job records that nothing reads",
    ],
    services: ["ai", "crm", "web"],
    faqs: [
      {
        question: "Is this just an answering service?",
        answer:
          "No. An answering service puts a person between you and the caller and charges per call. This is an automated first response — a text within seconds of a missed call, so the customer knows they have been heard and you have their number and their problem in writing before you ring back. The two solve overlapping problems and can sit alongside each other; this one costs nothing per call once it is built.",
      },
      {
        question: "What does a first project cost?",
        answer:
          "Projects start at $1,000 for a small, well-defined scope, and most work runs four to eight weeks from kickoff to launch. Larger builds are quoted against the actual work, and you get a scope and a real price within 48 hours — before the work starts, not after.",
      },
      {
        question: "We're two people and a van. Is this overkill?",
        answer:
          "For two people and a van, the missed-call piece is usually the only thing worth building, and we would say so rather than sell the rest. The value of a CRM scales with how many jobs are in flight at once; below a certain number, a phone and a notebook genuinely are fine. Discovery is free, which is the point at which we would tell you that.",
      },
    ],
  },
  {
    id: "hvac",
    name: "HVAC",
    audience: "HVAC companies",
    headline: "Software for HVAC companies",
    lead: "Seasonal demand you cannot staff for, maintenance agreements that quietly lapse, and install quotes that go out and are never followed up.",
    body: [
      "HVAC has a demand curve no other trade has to manage. The first genuine cold snap produces a week of calls in two days, and the constraint is never the work — it is the phone. Every call that goes unanswered during that window is lost during the only period of the year when there is more work than anyone can take. Capacity you cannot hire for in October is the argument for automating the first response rather than staffing it.",
      "Maintenance agreements are the other half of the business and behave in the opposite way. They are the revenue that does not care what the weather did, and they lapse quietly — not because customers decided against renewing, but because nobody was tracking which ones came due this month. That is a tracking problem with a known shape, and it is what a CRM is for in the specific sense of surfacing the fifteen renewals due in March rather than storing all of them equally.",
      "Installs are a third pattern again. A system replacement is a considered purchase at a price that makes people think, so the quote going out is the beginning of the sale rather than the end of it. The companies that win those jobs are usually not the cheapest; they are the ones still politely in touch a fortnight later, which is a sequence that can be built once and then runs without anyone maintaining a list.",
      "Three different problems with three different answers, and worth saying plainly: they do not have to be bought together, and there is rarely a good reason to.",
    ],
    breaks: [
      "Peak-season calls arriving faster than anyone can answer them",
      "Maintenance agreements lapsing because nothing flags the renewal",
      "Install quotes that go out and are never followed up",
      "Service history spread across paperwork, texts, and memory",
      "No way to tell which customers are due for anything",
    ],
    services: ["crm", "ai", "web"],
    faqs: [
      {
        question: "Can this handle maintenance agreement renewals?",
        answer:
          "Yes — that is custom pipelines and workflows, which is the core of the CRM work. The renewal date is already in your records; what is usually missing is something that reads it, surfaces the ones due, and prompts the contact. Whether that prompt goes to a person or goes out automatically is a decision we would make with you rather than for you.",
      },
      {
        question: "Our busy season starts in two months. Is that enough time?",
        answer:
          "Most work runs four to eight weeks from kickoff to launch, so a focused scope is realistic in that window and a full rebuild is not. If the deadline is real, the honest sequence is to build the piece that protects peak-season calls first and leave the rest until the season is over. We will say so upfront if what you have asked for does not fit, rather than discovering it halfway through.",
      },
      {
        question: "We have service history going back years. Can it come across?",
        answer:
          "Data migration from spreadsheets or legacy systems is part of the CRM work. How clean the result is depends on how consistent the source is, and that is worth looking at during discovery — which is free — rather than assuming either way. Old service history is usually the most valuable thing an HVAC company owns and the least usable in the shape it is currently in.",
      },
    ],
  },
];
