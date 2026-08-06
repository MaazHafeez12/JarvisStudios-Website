import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/content/insights";

// Live once the DNS cutover (docs/PRD.md §9) happens.
const BASE_URL = "https://jarvisstudios.net";

// /work is deliberately absent while there is no real work to show. Listing
// it would actively ask search engines to index an empty placeholder, which
// is worse than the page simply not existing. Restore it alongside the route.
const ROUTES = ["", "/services", "/about", "/insights", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const insightRoutes = INSIGHTS.map((post) => ({
    url: `${BASE_URL}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticRoutes, ...insightRoutes];
}
