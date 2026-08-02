import type { MetadataRoute } from "next";

// Live once the DNS cutover (docs/PRD.md §9) happens.
const BASE_URL = "https://jarvisstudios.net";

const ROUTES = ["", "/services", "/work", "/about", "/investors", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
