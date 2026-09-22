import type { MetadataRoute } from "next";
import { INSIGHTS } from "@/content/insights";
import { SERVICES } from "@/content/services";
import { TRADES } from "@/content/trades";
import { SITE_URL as BASE_URL } from "@/lib/seo";

// /work is deliberately absent while there is no real work to show. Listing
// it would actively ask search engines to index an empty placeholder, which
// is worse than the page simply not existing. Restore it alongside the route.
const ROUTES = [
  "",
  "/services",
  "/about",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  // Derived from SERVICES, like the insight routes below are derived from
  // INSIGHTS — adding a seventh service line should not require remembering
  // to add it here as well.
  const serviceRoutes = SERVICES.map((service) => ({
    url: `${BASE_URL}/services/${service.id}`,
    lastModified: new Date(),
  }));

  // Same reasoning as the service routes: derived, so adding a fourth trade
  // does not depend on anyone remembering this file.
  const tradeRoutes = TRADES.map((trade) => ({
    url: `${BASE_URL}/for/${trade.id}`,
    lastModified: new Date(),
  }));

  const insightRoutes = INSIGHTS.map((post) => ({
    url: `${BASE_URL}/insights/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticRoutes, ...serviceRoutes, ...tradeRoutes, ...insightRoutes];
}
