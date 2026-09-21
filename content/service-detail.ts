import type { ProjectType } from "@/lib/types/lead";

// Long-form content for the per-service pages at /services/<id>.
//
// ── WHY THIS IS A SEPARATE FILE FROM content/services.ts ────────────────
// Not organisational tidiness — bundle size. components/services/
// ServiceExplorer.tsx is a "use client" component and imports SERVICES, so
// everything in that file is serialised into the client bundle and shipped to
// every visitor of /services. The prose below is roughly 4KB per service and
// is only ever rendered on the server, by app/services/[slug]/page.tsx.
// Putting it in services.ts would send all six essays to every browser to
// render a comparison grid that displays none of them.
//
// Keep it that way. If a client component ever needs a field from here, move
// that one field to services.ts rather than importing this file.
//
// ── WHY THESE PAGES EXIST ───────────────────────────────────────────────
// All six service lines used to live on one URL as fragment anchors
// (/services#crm and so on). Fragments are not separate URLs to a crawler, so
// Google saw a single ~1,000-word page competing for "web development", "CRM",
// "SaaS", "app development", "AI automation" and "marketing & design" at once,
// and could rank it for none of them because it was not *about* any of them.
//
// /services remains the comparison hub and its DIRECTION CONTRACT is intact —
// all six still carry their name, summary, capabilities, proof and CTA in
// every state. These pages are depth hanging off that hub, not a replacement
// for it.
//
// ── THE STANDARD THIS COPY IS HELD TO ───────────────────────────────────
// PRODUCT.md Principle 1 forbids fabricating *evidence*: results, clients,
// metrics, testimonials. It does not forbid explaining a service the studio
// actually offers, which is what this is. Every `outcomes` entry restates a
// capability already published in content/services.ts, and the commercial
// answers in `faqs` restate figures from content/engagement.ts that are marked
// there as supplied by the business.
//
// WHAT IS NOT YET SIGNED OFF, and the reason this notice exists: the *stances*
// taken in the body copy — "we'd push back on a brief that asked for it",
// "we'd rather argue about a headline", "rewrites are the most commonly
// over-prescribed fix" — are inferred from the positions the site already
// takes elsewhere (content/insights.ts, content/engagement.ts), not supplied.
// They read as commitments a client could hold the studio to. Review them as
// copy before treating them as settled, the same way engagement.ts flags its
// own framing. No figure, client name, or result appears here that is not
// already published elsewhere on the site.

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  /** The page's H1. Carries the search term and still reads as a sentence. */
  headline: string;
  /** Meta description and the standfirst under the H1. Keep under ~155 chars. */
  lead: string;
  /** Body paragraphs. */
  body: string[];
  /** What the client ends up with. Each restates a published capability. */
  outcomes: string[];
  /**
   * Rendered as a <dl> and emitted as FAQPage structured data.
   *
   * Deliberately service-specific rather than a shared set with the wording
   * swapped. Identical answers repeated across six pages is duplicate thin
   * content, which costs more in ranking than the questions gain — and an FAQ
   * that answers a question nobody asked about *this* service is not an FAQ.
   */
  faqs: ServiceFaq[];
}

export const SERVICE_DETAIL: Record<ProjectType, ServiceDetail> = {
  ai: {
    headline: "AI automation for the jobs your team still does by hand",
    lead: "Automation that clears the copy-paste, re-keying and follow-ups nobody has time for — without removing the person from decisions that still need one.",
    body: [
      "The clearest case is a missed call. Someone rings while you're on a roof or under a sink, it goes to voicemail, and by the time you ring back they have already booked someone else. A text that fires the moment the call drops turns a lost job into a conversation, and it never depends on anyone remembering to send it.",
      "The same reasoning covers the rest of the back office: quotes typed out by hand, job details re-keyed from one system into another, follow-ups that live in somebody's head. Those are mechanical steps, and mechanical steps are what automation is genuinely good at.",
      "Where a language model does the work — search, drafting, classification — the review step is built into the workflow rather than bolted on afterwards. The cost of a wrong answer going out unreviewed is almost always higher than the cost of someone spending thirty seconds confirming it. Automation that removes that checkpoint to save the thirty seconds is optimising for the wrong thing.",
    ],
    outcomes: [
      "Missed calls answered in seconds, without anyone lifting a phone",
      "Job data moving between systems without being typed twice",
      "A review step wherever a decision actually needs a person",
    ],
    faqs: [
      {
        question: "Does this replace my team?",
        answer:
          "No, and we would push back on a brief that asked for it. The mechanical steps get automated — copy-paste, data entry, the first-pass draft. Anything involving judgment keeps a person in the loop by design, because that is exactly where the cost of being wrong is highest.",
      },
      {
        question: "What is the smallest useful version of this?",
        answer:
          "Usually a missed-call text-back. It is self-contained, it takes days rather than weeks, and it pays for itself the first time it saves a job. It is a common starting point precisely because it does not require changing anything else about how you work.",
      },
      {
        question: "Do I need to replace the software I already use?",
        answer:
          "Usually not. Most of this work sits between the tools you already have rather than replacing them. The value is in the handoffs, which is where the manual re-keying happens today.",
      },
    ],
  },

  crm: {
    headline: "CRM systems built around how your team actually sells",
    lead: "Pipelines, fields and workflows shaped to your business — including the migration out of the spreadsheet you are currently running on.",
    body: [
      "Most CRM projects fail the same way: the tool arrives with someone else's sales process baked in, the team works around it, and within a few months the real information is back in a spreadsheet and a group chat. A CRM is only useful if it matches how the work already happens.",
      "So the first stage is mapping that — who touches a job between the enquiry and the invoice, what actually decides whether it moves forward, and which fields someone will realistically fill in while standing in a driveway. Fields nobody completes are worse than no fields at all, because they make the data look trustworthy when it is not.",
      "Then it connects to what you already run: quotes, calendars, accounting, the phone system. Most of the value in a CRM is not having to enter the same job in four places, and that only materialises if the integrations are real rather than a weekly CSV export.",
    ],
    outcomes: [
      "A pipeline that matches your actual stages, not a template's",
      "Your existing sales and support tools connected, so a job is entered once",
      "Spreadsheet or legacy data migrated rather than abandoned",
    ],
    faqs: [
      {
        question: "We are running on spreadsheets. Is that a problem?",
        answer:
          "It is the most common starting point, and it is usually a good sign. A spreadsheet that has been in daily use for years is an accurate record of how your process really works. We migrate the data and use the structure you have already evolved as the starting design.",
      },
      {
        question: "Do you build custom, or set up something off the shelf?",
        answer:
          "Either, and the answer depends on how unusual your process is. Configuring an existing platform is faster and cheaper when your workflow is close to standard. A custom build earns its cost when the workarounds would be worse than the build.",
      },
      {
        question: "What happens to the data we already have?",
        answer:
          "It is migrated, and that is a real part of the scope rather than an afterthought. Messy data is normal. We would rather clean it during migration than have you start fresh and lose the history.",
      },
    ],
  },

  web: {
    headline: "Web development for sites that load fast and get enquiries",
    lead: "Marketing sites, landing pages and web apps built for speed and conversion, with Core Web Vitals treated as a requirement rather than an audit.",
    body: [
      "A slow site costs you enquiries before anyone reads a word. Someone searching on a phone, on mobile data, outside a job that needs doing, will leave a page that takes four seconds to appear — and you will never know they were there.",
      "So performance is not a polish step. Core Web Vitals are measured and optimised as part of the build, not audited afterwards when the architecture has already made them expensive to fix. This site is the same argument made in public: its own metrics are kept as a regression baseline rather than quoted as a marketing claim.",
      "The same applies to what the page says. A site that loads instantly and still does not tell a visitor what you do, where you work, or how to reach you produces no enquiries. Structure and copy are part of the build, and we would rather argue about a headline than ship a fast page that converts nobody.",
    ],
    outcomes: [
      "A site that loads fast on mobile data, measured rather than assumed",
      "A clear path from landing on the page to making an enquiry",
      "A content model you can update without calling us",
    ],
    faqs: [
      {
        question: "Can you work with our existing site?",
        answer:
          "Often, yes. Whether that is cheaper than rebuilding depends on what is underneath — some sites are a handful of fixable problems, others have the problem baked into the platform. We will tell you which one you have before you commit to either.",
      },
      {
        question: "Do we get a CMS?",
        answer:
          "If you need one. A content model and CMS setup is part of the service and is worth having if you will genuinely publish. If you will not, it is a maintenance burden you are paying for, and we will say so.",
      },
      {
        question: "How do you measure that it is actually fast?",
        answer:
          "Core Web Vitals — LCP, CLS and INP — measured against a production build rather than a dev server, because a dev server's numbers are meaningless. Those figures then become the baseline that later changes are checked against.",
      },
    ],
  },

  app: {
    headline: "App development, from first prototype to app store",
    lead: "iOS, Android and cross-platform builds, including the store submission process that catches out most first launches.",
    body: [
      "The decision that costs the most is made earliest: native or cross-platform. Cross-platform gets you both stores from one codebase and is the right answer for most projects. Native earns its extra cost when the app leans hard on hardware, background behaviour or platform-specific integrations — and discovering that after the build has started is expensive.",
      "So that conversation happens in discovery, weighed against what the app actually has to do, rather than being settled in advance by whichever framework a studio happens to prefer.",
      "Launch is inside the scope, not a handover. App Store and Play Store submission has its own rules about privacy disclosures, permissions, screenshots and review, and a rejection can cost a week each time it happens. We would rather absorb that than hand over a finished build and a login.",
    ],
    outcomes: [
      "A build that runs on the platforms your customers actually use",
      "Store submission handled, including the privacy and permissions paperwork",
      "Push, offline support and native integrations where the app needs them",
    ],
    faqs: [
      {
        question: "Native or cross-platform?",
        answer:
          "Cross-platform for most projects: one codebase, both stores, lower cost to build and to maintain. Native when the app depends heavily on hardware, background processing or platform-specific features. It is a discovery question, decided against your requirements rather than in advance.",
      },
      {
        question: "Do we need an app, or would a website do?",
        answer:
          "Frequently a website would do, and we will say so. An app earns its cost when you need offline use, push notifications, or hardware the browser cannot reach. If none of those apply, a fast mobile site is cheaper to build and easier for customers to reach.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. It is your codebase and your store listings, and you can take both elsewhere. We would rather you stayed because the work is good than because leaving was difficult.",
      },
    ],
  },

  saas: {
    headline: "SaaS development — auth, billing, and the parts that are hard to get right",
    lead: "Full-stack product builds, including the multi-tenant and subscription plumbing that is consistently underestimated.",
    body: [
      "Most of the difficulty in a SaaS build is not the feature you are excited about. It is auth, billing, roles, and keeping one customer's data provably separate from another's — the parts nobody demos, that everything else depends on, and that are painful to retrofit.",
      "Multi-tenancy in particular is an early architectural decision with a long shadow. Getting it wrong does not show up in week three. It shows up when your second-largest customer asks a question about data isolation that you cannot answer confidently.",
      "Billing has the same shape. Subscriptions, plan changes, proration, failed payments and refunds are a system rather than an integration, and the edge cases arrive late — usually from your most valuable customers.",
    ],
    outcomes: [
      "Auth, roles and permissions that hold up as you add customers",
      "Subscription billing including the awkward cases, not just the happy path",
      "An API and integration surface that is designed rather than accreted",
    ],
    faqs: [
      {
        question: "Can you take over an existing product?",
        answer:
          "Yes, and we would start by reading it rather than proposing a rewrite. Rewrites are the most commonly over-prescribed fix in this category. Often the real problem is two or three specific decisions that can be changed without discarding everything that already works.",
      },
      {
        question: "How do you handle billing?",
        answer:
          "Usually on an established payments provider rather than building payments from scratch. The build effort goes into the logic around it — plan changes, proration, failed payments, refunds — which is where the complexity actually lives.",
      },
      {
        question: "What about multi-tenancy?",
        answer:
          "Decided in discovery, because it is the architectural choice with the longest shadow. The right answer depends on how isolated your customers' data has to be, and on what you will need to be able to prove about it later.",
      },
    ],
  },

  design: {
    headline: "Marketing and design that makes the rest of the work land",
    lead: "Brand, interface and campaign design, plus ongoing content and social where that is what actually moves the number.",
    body: [
      "Design here is not decoration applied at the end. A brand system, an interface and a campaign are all answering the same question — whether someone trusts you enough to get in touch — and they fail in the same way when they look like everything else in the category.",
      "So the work starts from what makes you different in practice rather than from a moodboard. For a trades business that is often unglamorous and specific: you answer the phone, you turn up when you said you would, you quote in writing. Those are the things worth designing around.",
      "Where the engagement is ongoing rather than a fixed scope, it is measured monthly and reported against the previous month. A one-off percentage with no window attached tells you almost nothing; a figure you can watch repeat is a claim that survives being looked at closely.",
    ],
    outcomes: [
      "A brand and design system that does not read as the category default",
      "Interface design that carries through into the built product",
      "Ongoing content and social, measured month over month",
    ],
    faqs: [
      {
        question: "Do you do ongoing social, or only the design?",
        answer:
          "Both. Content and social management runs as a retainer, because social growth has no finish line — the moment you stop publishing, reach decays. A fixed-scope launch would hand back a channel that starts shrinking the day it is delivered.",
      },
      {
        question: "How do you report on ongoing work?",
        answer:
          "Monthly, against the previous month, from the point we took over. That window is what makes a number a trend rather than a screenshot.",
      },
      {
        question: "Can you work with our existing brand?",
        answer:
          "Yes. Plenty of businesses have a mark and a colour that work perfectly well and a website that does not. Replacing a brand that is not the problem is an easy way to spend a budget on the wrong thing.",
      },
    ],
  },
};
