import type { Metadata } from "next";

// Central SEO helpers. The canonical origin used to be declared three times —
// app/sitemap.ts, app/robots.ts, and app/layout.tsx's metadataBase — which is
// two places for it to drift out of step with the live domain. It lives here
// now and those files import it.
//
// ── WHAT NEXT ALREADY DOES, SO WE DON'T DO IT TWICE ─────────────────────
// `app/opengraph-image.tsx` is a file convention: because it sits at the app
// root it applies to every route, and Next synthesizes `og:title`,
// `og:description`, `og:image*` and the whole `twitter:*` set from each
// page's own `title`/`description`. Those tags are already correct per page
// and nothing here needs to restate them.
//
// What Next does NOT infer, and what this file therefore supplies:
//   - <link rel="canonical">      — never emitted unless you ask for it
//   - og:url, og:site_name, og:locale, og:type
//   - article:published_time on the insight posts
//
// Setting `openGraph` here does not clobber the file-convention image: Next
// merges the generated image tags into whatever openGraph object a page
// exports.

export const SITE_URL = "https://jarvisstudios.net";
export const SITE_NAME = "Jarvis Studios";

/** The site's title convention: "Page | Jarvis Studios", bare name on home. */
export function pageTitle(title?: string): string {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

/** Absolute URL for a route path. `""` is the homepage. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

interface PageSeoInput {
  /** Page title WITHOUT the " | Jarvis Studios" suffix. Omit on the homepage. */
  title?: string;
  description: string;
  /** Route path, leading slash, no trailing slash. `""` for the homepage. */
  path: string;
  /** `article` for insight posts, `website` for everything else. */
  type?: "website" | "article";
  /** ISO date — only meaningful when `type` is `article`. */
  publishedTime?: string;
}

/**
 * Builds the metadata object for a page: title, description, canonical, and
 * the Open Graph fields Next can't infer.
 *
 * The canonical is the reason this exists. Every route on this site is
 * reachable at more than one URL — with and without `www`, with and without a
 * trailing slash, and with any marketing query string a campaign appends.
 * Without a canonical those are separate URLs to a crawler, splitting ranking
 * signals across duplicates of the same page.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle(title),
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(type === "article" && publishedTime
        ? { publishedTime }
        : {}),
    },
  };
}
