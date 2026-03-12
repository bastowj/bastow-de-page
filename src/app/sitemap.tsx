import { getAllCategories, getAllBlogPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.baseUrl;

  // Blog posts
  const allPosts = await getAllBlogPosts();
  const postsSitemap = allPosts.map((post) => ({
    url: `${baseUrl}/texts/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Text Categories
  const allCategories = await getAllCategories();
  const categoriesSitemap = allCategories.map((category) => ({
    url: `${baseUrl}/texts/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Static routes
  const routes: string[] = [
    "", // root
    "/about",
    "/contact",
    "/impressum",
    "/privacy",
  ];

  const staticRoutesSitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutesSitemap, ...postsSitemap, ...categoriesSitemap];
}
