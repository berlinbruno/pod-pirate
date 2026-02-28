import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baserUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://podpirate.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/"],
    },
    sitemap: `${baserUrl}/sitemap.xml`,
  };
}
