import { getAllCategories } from "@/lib/blog";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.bastow.de";

  // Blog Categories
  const allCategories = await getAllCategories();
  const categoriesSitemap = allCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
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

  return [...staticRoutesSitemap, ...categoriesSitemap];
}
