import type { MetadataRoute } from "next";

// Live once the DNS cutover (docs/PRD.md §9) happens.
const BASE_URL = "https://jarvisstudios.net";

// /work is deliberately absent while there is no real work to show. Listing
// it would actively ask search engines to index an empty placeholder, which
// is worse than the page simply not existing. Restore it alongside the route.
const ROUTES = ["", "/services", "/about", "/investors", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
