import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.baseUrl;
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/api/", // Next.js API routes
      },
      {
        userAgent: "*",
        disallow: "/_next/", // Next.js build output
      },
      {
        userAgent: "*",
        disallow: "/public/", // Public folder
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
