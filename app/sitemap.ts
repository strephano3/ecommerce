import type { MetadataRoute } from "next";

const baseUrl = "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/shop",
    "/shop/posters",
    "/cart",
    "/checkout",
    "/privacy",
    "/terms",
    "/shipping",
    "/returns"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));
}
