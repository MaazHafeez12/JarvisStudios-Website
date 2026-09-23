// Legal pages — privacy policy and terms of use. Typed, in-repo content,
// same pattern as content/insights.ts and content/services.ts.
//
// EVERY FACTUAL CLAIM HERE IS DERIVED FROM THE CODE, NOT DRAFTED FROM A
// TEMPLATE. That is the whole point of keeping it in the repo next to the
// thing it describes. Specifically:
//
//   - The collected fields are `LeadInput` in lib/types/lead.ts.
//   - The sub-processor list is exactly what app/api/leads/route.ts touches:
//     Supabase (insert), Resend (lib/notifications/email.ts), Slack
//     (lib/notifications/slack.ts), Upstash (lib/rate-limit.ts), plus Vercel
//     for hosting and analytics (app/layout.tsx).
//   - The IP disclosure exists because checkRateLimit() keys on the
//     requester's IP. An IP is personal data under GDPR; a privacy policy
//     that lists only the form fields would be incomplete.
//   - The "no cookies" claim is literal: the only client-side storage is the
//     `theme` key in localStorage (app/layout.tsx, components/ui/ThemeToggle.tsx),
//     which never leaves the device, and Vercel Web Analytics is cookieless.
//
// IF YOU CHANGE WHAT THE FORM COLLECTS, WHO IT IS SENT TO, OR HOW LONG IT IS
// KEPT, CHANGE THIS FILE IN THE SAME COMMIT. A privacy policy that has
// drifted from the implementation is worse than no privacy policy: it is a
// published, false statement about what happens to someone's data.
//
// ── Jurisdiction ────────────────────────────────────────────────────────
// Deliberately written jurisdiction-neutral, granting GDPR-tier rights to
// every visitor regardless of where they are. That is not a dodge: honouring
// the strongest common set of rights for everyone meets or exceeds what the
// other major regimes require, and it avoids naming a governing law that
// isn't settled yet.
//
// The terms carry NO governing-law / venue clause for the same reason. That
// is the one genuine omission in this file and it is intentional rather than
// forgotten — add it once the business has a registered entity and a home
// jurisdiction, because a venue clause naming the wrong place is worse than
// none. See the "Entity" note below.
//
// ── Entity ──────────────────────────────────────────────────────────────
// The controller is named as the trading name "Jarvis Studios" with an email
// contact, per the operator's decision. GDPR Art. 13(1)(a) wants the
// controller *identifiable*; a trading name plus a working contact address is
// thin but workable at this size. Revisit when an entity is registered.

export interface LegalSection {
  heading: string;
  body: string[];
  /** Rendered as a bulleted list after `body`. */
  list?: string[];
}

export interface LegalDocument {
  title: string;
  /** Meta description, and the standfirst under the H1. */
  description: string;
  /** ISO date. The date the text last actually changed, never backdated. */
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

/** Single source of truth — used in the copy below and by the contact links. */
export const CONTACT_EMAIL = "jarvisstudios12@gmail.com";

/** Stated retention window for enquiries, in months. */
const RETENTION_MONTHS = 24;

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  description:
    "What Jarvis Studios collects when you use this site, why, who else processes it, and how to have it deleted.",
  updated: "2026-09-21",
  intro: [
    "This policy covers jarvisstudios.net. It is written to be read rather than skimmed past, so it is specific about what actually happens instead of reserving every right a lawyer could think of.",
    "The short version: the only information we ask for is what you type into the contact form. We do not sell it, we do not advertise to you, we do not build a profile of you, and we set no cookies.",
  ],
  sections: [
    {
      heading: "Who is responsible for your data",
      body: [
        `Jarvis Studios is the data controller for the information described here. You can reach us about anything in this policy at ${CONTACT_EMAIL}, and we will respond to any request about your own data within 30 days.`,
      ],
    },
    {
      heading: "What we collect",
      body: [
        "When you submit the contact form, we receive and store exactly the fields on it:",
      ],
      list: [
        "Your name",
        "Your email address",
        "Your company name, if you choose to give one (the field is optional)",
        "The project type you select, if you select one (also optional)",
        "The message you write",
      ],
    },
    {
      heading: "What we collect automatically",
      body: [
        "Two things, neither of which identifies you by name.",
        "Your IP address is used to rate-limit the contact form, so that one source cannot flood it. It is held briefly by our rate-limiting provider as part of a counter and expires automatically within the hour. It is not stored alongside your enquiry and we never look at it.",
        "We also run privacy-preserving analytics on page views and page performance. These are cookieless and aggregated: they tell us that a page was viewed, roughly from where, and how quickly it loaded. They do not track you between sites, and they do not build a profile.",
      ],
    },
    {
      heading: "Why we are allowed to hold it",
      body: [
        "Under the GDPR, and as a matter of plain fairness wherever you happen to be, the reasons are:",
      ],
      list: [
        "Your enquiry: because you asked us to contact you about working together, which is a step taken at your request before entering a contract.",
        "Your IP address for rate limiting: our legitimate interest in keeping a public form from being abused. There is no way to run an open contact form safely without it.",
        "Analytics: our legitimate interest in knowing which pages are useful. We use a cookieless, non-profiling tool specifically so this stays proportionate.",
      ],
    },
    {
      heading: "Who else processes it",
      body: [
        "We are a small studio and we do not run our own infrastructure. Your enquiry passes through these providers, and no others:",
      ],
      list: [
        "Vercel: hosts the site and provides the cookieless analytics described above.",
        "Supabase: the database your enquiry is stored in.",
        "Upstash: the rate-limiting store that briefly holds the IP counter.",
        "Resend: delivers the notification email containing your enquiry to us.",
        "Slack: receives a notification message containing your enquiry.",
      ],
    },
    {
      heading: "A copy reaches our inbox",
      body: [
        "Worth stating plainly, because most policies leave it implied: the notification email and Slack message contain what you wrote. That means a copy of your enquiry lives in our email and our Slack workspace as well as in the database, and it stays there under those services' own retention until we delete it. When you ask us to erase your data, we delete those copies too, not just the database row.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        `We keep enquiries for ${RETENTION_MONTHS} months from our last contact with you, then delete them. A project conversation can restart a year later, which is why the window is not shorter; there is no reason for it to be longer.`,
        "Rate-limiting records expire automatically within an hour. Analytics data is aggregated and holds nothing that identifies you.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This site sets no cookies. There is no consent banner because there is nothing to consent to.",
        "The one thing stored in your browser is your light/dark theme preference. It stays on your device, is never transmitted to us or anyone else, and you can clear it by clearing site data.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "We extend these to every visitor, not only those in a jurisdiction that mandates them. You can ask us to:",
      ],
      list: [
        "Give you a copy of what we hold about you",
        "Correct anything that is wrong",
        "Delete it entirely",
        "Restrict what we do with it, or object to us holding it at all",
        "Send it to you in a portable, machine-readable format",
      ],
    },
    {
      heading: "How to exercise them",
      body: [
        `Email ${CONTACT_EMAIL}. We do not require a form, an account, or a reason. If you are in the UK or EU and you think we have handled your data badly, you are also entitled to complain to your national data protection authority, and you do not need to raise it with us first.`,
      ],
    },
    {
      heading: "Where your data goes",
      body: [
        "The providers listed above may process data on servers outside your country, including in the United States. Where that involves personal data leaving the UK or EEA, it is covered by the transfer safeguards those providers maintain, such as Standard Contractual Clauses.",
      ],
    },
    {
      heading: "What we do not do",
      body: [
        "We do not sell or rent your information. We do not share it with advertisers. We do not use it to train machine-learning models. We do not make automated decisions about you, and we do not profile you. If any of that changes, it changes here first.",
      ],
    },
    {
      heading: "Security",
      body: [
        "Enquiries are stored in a database with no public read or write access. Every access goes through our server, never your browser. The site is served over HTTPS only. Input is validated and escaped on the server before it is stored or included in any notification.",
        "No system is perfect, and we would rather say that than claim otherwise. If you find a security problem with this site, please tell us at the address above.",
      ],
    },
    {
      heading: "Children",
      body: [
        "This is a business-to-business site and it is not directed at children. We do not knowingly collect information from anyone under 16. If you believe a child has sent us something, contact us and we will delete it.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change what we collect, who processes it, or how long we keep it, we update this page and the date at the top of it. Material changes are not applied retroactively to data already collected under an earlier version.",
      ],
    },
  ],
};

export const TERMS_OF_USE: LegalDocument = {
  title: "Terms of Use",
  description:
    "The terms that apply to using the Jarvis Studios website, including what our published pricing does and does not commit us to.",
  updated: "2026-09-21",
  intro: [
    "These terms cover your use of jarvisstudios.net. They do not govern any project we take on together. That is covered by a separate written proposal and agreement, and nothing on this website replaces one.",
  ],
  sections: [
    {
      heading: "What this site is",
      body: [
        "A marketing site for Jarvis Studios. It describes the work we do and gives you a way to get in touch. There are no accounts, no logins, and nothing to buy on it.",
      ],
    },
    {
      heading: "Published prices and timelines are indicative",
      body: [
        "We publish a starting price and a typical project duration because hiding them wastes everyone's first conversation. They are honest figures, and they are not an offer.",
        "A starting price is a floor for a small, well-defined scope, not a quote for your project. A typical duration describes most work, not a commitment about yours. The only price and timeline that bind us are the ones in a written proposal you have accepted.",
      ],
    },
    {
      heading: "An enquiry is not a contract",
      body: [
        "Submitting the contact form starts a conversation. It does not create an engagement, reserve capacity, or oblige either of us to proceed. We may decline work, and you are free to walk away at any point before a proposal is signed.",
      ],
    },
    {
      heading: "Content on this site",
      body: [
        "The articles, descriptions, and opinions published here are general commentary on how we work. They are not professional, legal, financial, or technical advice for your situation, and you should not act on them without advice that accounts for your circumstances.",
        "We try to keep everything accurate and current. Where a figure relates to a client's results, it is a real measured figure with its measurement window stated, and we do not publish results we cannot stand behind.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The design, code, written content, and graphics on this site belong to Jarvis Studios, except where noted below. You are welcome to read it, link to it, and quote it with attribution. You may not copy the site or substantial parts of it, present our work as yours, or reuse our content commercially without permission.",
        "Third-party components carry their own licences and are used under them: the Clash Display and Inter typefaces, and the Lucide icon set.",
      ],
    },
    {
      heading: "Acceptable use",
      body: ["When using this site, please do not:"],
      list: [
        "Submit the contact form automatically, repeatedly, or with content you know to be false",
        "Send anything through it that is unlawful, abusive, or designed to attack the systems it reaches",
        "Scrape, mirror, or bulk-download the site",
        "Attempt to gain access to anything not deliberately made public, or probe, scan, or test our systems without written permission",
      ],
    },
    {
      heading: "Availability",
      body: [
        "We take the reliability of this site seriously, but it is a marketing site and we do not promise it will be available uninterrupted or error-free. We may change, move, or remove any part of it without notice.",
      ],
    },
    {
      heading: "Links to other sites",
      body: [
        "Where we link somewhere else, we are pointing at something we thought was worth reading. We do not control those sites and we are not responsible for their content or their privacy practices.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "To the extent the law allows, we are not liable for loss arising from your use of this website or from reliance on anything published on it. Nothing here limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these terms. The current version is always the one on this page, with its date at the top, and continuing to use the site after a change means those terms apply.",
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about these terms go to ${CONTACT_EMAIL}.`,
      ],
    },
  ],
};
