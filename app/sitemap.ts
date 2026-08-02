import type { MetadataRoute } from "next";

// TODO: replace with the real production domain once the DNS cutover
// (docs/PRD.md §9) happens — no literal domain has been provided yet.
const BASE_URL = "https://jarvisstudios.com";

const ROUTES = ["", "/services", "/work", "/about", "/investors", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
