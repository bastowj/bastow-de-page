import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.baseUrl;
  return {
    rules: [
      {
        userAgent: "*",
        // "/public/" was also listed, but Next serves that directory's contents
        // from the root, so no such path exists to disallow.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
