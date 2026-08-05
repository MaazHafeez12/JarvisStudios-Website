// Commercial terms for the Services page (docs/MOTION_REDESIGN.md follow-up
// work on /services). Structured, typed content — not a database
// (docs/ARCHITECTURE.md §4.6), same as services.ts and process.ts.
//
// The figures here are supplied facts about the business, not generated
// copy: $1,000 entry point, 4–8 week typical timeline, both fixed-scope and
// retainer engagements, free discovery. Anything beyond those four facts is
// framing and should be reviewed before it ships.
//
// Note on ordering: the price and the timeline are deliberately NOT
// adjacent in the grid. Read side by side they imply a ~$125–250/week rate,
// which misrepresents the work — $1,000 is the floor for a small,
// well-defined scope, while 4–8 weeks describes a typical project. The
// `detail` on each says so explicitly rather than relying on the reader.

// Each fact leads with a headline that carries its own meaning. An earlier
// version split these into a small uppercase label above a large value —
// which is the eyebrow/kicker pattern, and used monospace as decoration
// rather than for data. A heading that needs a label above it to be
// understood is a heading that hasn't been written yet.

export interface EngagementFact {
  headline: string;
  detail: string;
}

export const ENGAGEMENT_FACTS: EngagementFact[] = [
  {
    headline: "Discovery is free",
    detail:
      "We'll dig into your business, users, and constraints before either side commits to anything. No charge, no obligation.",
  },
  {
    headline: "Projects start at $1,000",
    detail:
      "That's the entry point for a small, well-defined scope. Larger builds are quoted against the actual work — we'll give you a number before we start, not after.",
  },
  {
    headline: "Fixed scope or retainer",
    detail:
      "Fixed scope when the brief is clear and the finish line is known. A retainer when the work is ongoing. We'll tell you which one we think fits.",
  },
  {
    headline: "Most work runs 4–8 weeks",
    detail:
      "Four to eight weeks from kickoff to launch is typical. Larger scopes take longer, and we'll say so upfront rather than discovering it halfway through.",
  },
];
