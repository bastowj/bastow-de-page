import {
  getBlogPostsByCategory,
  getAllCategories,
  getCategoryBySlug,
  getCategorySlugs,
} from "@/lib/blog";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/BlogLayout";

// Define params type for Next.js 15
type CategoryParams = Promise<{ category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategorySlugs().map((category) => ({ category }));
}

// Generate metadata for the page - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params }: { params: CategoryParams }) {
  const resolvedParams = await params;
  const categoryName = getCategoryBySlug(resolvedParams.category);

  if (!categoryName) {
    notFound();
  }

  return {
    title: `${categoryName} | bastow.de blog`,
    description: `Explore articles in the ${categoryName} category`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: CategoryParams;
}) {
  // Await the params object first
  const resolvedParams = await params;
  const categoryName = getCategoryBySlug(resolvedParams.category);

  if (!categoryName) {
    notFound();
  }

  const allCategories = getAllCategories();
  const posts = getBlogPostsByCategory(categoryName);

  return (
    <BlogLayout
      posts={posts}
      categories={allCategories}
      activeCategory={categoryName}
    />
  );
}
