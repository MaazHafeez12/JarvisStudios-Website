import type { MetadataRoute } from "next";

// Live once the DNS cutover (docs/PRD.md §9) happens.
const BASE_URL = "https://jarvisstudios.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
