import type { MetadataRoute } from "next";

// TODO: replace with the real production domain once the DNS cutover
// (docs/PRD.md §9) happens — no literal domain has been provided yet.
const BASE_URL = "https://jarvisstudios.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
