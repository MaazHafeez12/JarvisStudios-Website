import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/content/legal";
import { SERVICES, type Service } from "@/content/services";
import type { ServiceDetail } from "@/content/service-detail";
import type { InsightPost } from "@/content/insights";

// schema.org structured data. Crawlers read the page fine — every route here
// is statically prerendered — but rendered HTML doesn't tell them *what the
// page is*: that this is a business rather than a blog, that a given page is
// an article with a publication date, or how the pages relate. That is what
// this supplies.
//
// ── THE RULE THIS FILE FOLLOWS ──────────────────────────────────────────
// Structured data is machine-readable marketing copy, and it is held to the
// same standard as the visible kind (PRODUCT.md, Product Principle 1: never
// fabricate evidence). Every value below is already published on the site in
// human-readable form. Nothing is asserted here that a visitor could not read
// for themselves.
//
// That rules out several tempting types. `LocalBusiness` is not used: it
// wants an address and geo coordinates, and inventing them to satisfy a
// schema is exactly the failure mode the principle names. `AggregateRating`
// and `Review` are not used because there are no reviews. `foundingDate`,
// `numberOfEmployees` and `sameAs` are omitted rather than guessed — an
// omitted property costs nothing, a wrong one is a false statement that also
// risks a manual action.

/** Stable node id, so Article nodes can reference the org without repeating it. */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Web development, app development, SaaS, CRM, AI automation, and marketing/design for growing businesses.",
  email: CONTACT_EMAIL,
  // The 180x180 raster rather than logo.svg: Google's Organization logo
  // guidance expects a raster image, and this is the same mark.
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/apple-icon.png"),
    width: 180,
    height: 180,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: CONTACT_EMAIL,
    url: absoluteUrl("/contact"),
  },
  // Derived from content/services.ts rather than hand-listed, for the same
  // reason the /services meta description is: a hand-written copy of this
  // list went stale the moment a sixth service line was added.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
        url: absoluteUrl(`/services#${service.id}`),
      },
    })),
  },
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en",
};

/**
 * Homepage graph: who this business is and what site this is. Emitted once,
 * on `/` only — repeating the Organization node on every page adds bytes
 * without adding information, since the `@id` above is what other pages
 * reference.
 */
export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, WEBSITE],
  };
}

/**
 * A service page: what the service is, who provides it, and the questions it
 * answers, plus the breadcrumb trail back to the hub.
 *
 * The FAQPage node is doing double duty. For search it is eligible for rich
 * results; more reliably, it is the shape an answer engine can lift a response
 * from and attribute. A model asked "do I need an app or a website" has
 * something to quote here and a URL to credit it to, which a page of prose
 * about the studio's methodology does not provide.
 *
 * `provider` points at the Organization node by @id rather than repeating it,
 * so the six service pages describe six services offered by one identified
 * business instead of six unrelated pages that happen to share a domain.
 */
export function serviceGraph(service: Service, detail: ServiceDetail) {
  const url = absoluteUrl(`/services/${service.id}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        description: detail.lead,
        url,
        provider: { "@id": ORGANIZATION_ID },
        serviceType: service.name,
        // Every entry restates a capability already published in
        // content/services.ts — nothing is asserted here that a visitor
        // cannot read for themselves on the page.
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.name} capabilities`,
          itemListElement: service.capabilities.map((capability) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: capability },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: detail.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Services",
            item: absoluteUrl("/services"),
          },
          { "@type": "ListItem", position: 2, name: service.name, item: url },
        ],
      },
    ],
  };
}

/**
 * An insight post: a dated article by a known publisher, plus the breadcrumb
 * trail that gets it shown as `jarvisstudios.net › Insights › Title` rather
 * than as a bare URL.
 */
export function articleGraph(post: InsightPost) {
  const url = absoluteUrl(`/insights/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        // No separate modified date is tracked in content/insights.ts, and
        // claiming a fresher one than we have would be the fabrication this
        // file's header rules out. Equal to published is the honest value.
        dateModified: post.publishedAt,
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Insights",
            item: absoluteUrl("/insights"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };
}
