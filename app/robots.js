export default function robots() {
  const baserUrl = process.env.NEXT_PUBLIC_BASE_URL
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${baserUrl}/sitemap.xml`,
  };
}
