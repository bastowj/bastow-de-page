import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.baseUrl;
  return {
    rules: [
      {
        userAgent: "*",
        // Do not add /_next/ — it holds the CSS and JS crawlers need to render
        // pages, and /_next/image serves every optimised image.
        disallow: "/api/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
