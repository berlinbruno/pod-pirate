import { getCreatorIds, getPodcastIds } from "@/lib/api";
import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL;

  // Fetch dynamic IDs
  const [podcastIds, creatorIds] = await Promise.all([getPodcastIds(), getCreatorIds()]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/reset-password`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/verify-email`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic podcast pages
  const podcastPages: MetadataRoute.Sitemap = podcastIds.map((id) => ({
    url: `${baseUrl}/podcasts?podcastId=${encodeURIComponent(id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic creator pages
  const creatorPages: MetadataRoute.Sitemap = creatorIds.map((id) => ({
    url: `${baseUrl}/creators?creatorId=${encodeURIComponent(id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...podcastPages, ...creatorPages];
}
