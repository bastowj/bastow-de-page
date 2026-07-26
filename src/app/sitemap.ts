import { getCategorySlugs, getAllBlogPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";
import { legalNavItems, navItems } from "@/constants/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.baseUrl;

  // Blog posts
  const allPosts = getAllBlogPosts();
  const postsSitemap = allPosts.map((post) => ({
    url: `${baseUrl}/texts/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Text Categories
  const categorySlugs = getCategorySlugs();
  const categoriesSitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/texts/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Static routes, derived from the nav so a new page cannot be forgotten here
  const routes: string[] = [...navItems, ...legalNavItems].map((item) =>
    item.href === "/" ? "" : item.href,
  );

  const staticRoutesSitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutesSitemap, ...postsSitemap, ...categoriesSitemap];
}
