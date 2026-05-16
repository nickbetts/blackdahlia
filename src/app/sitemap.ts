import type { MetadataRoute } from "next";
import { artists } from "@/content/studio";

const baseUrl = "https://www.theblackdahlia.co.uk";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/artists", "/faq", "/policies", "/contact", "/booking"];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const artistEntries = artists.map((artist) => ({
    url: `${baseUrl}/artists/${artist.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...artistEntries];
}
