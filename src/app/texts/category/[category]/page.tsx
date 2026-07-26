import {
  getBlogPostsByCategory,
  getAllCategories,
  getCategoryBySlug,
  getCategorySlugs,
} from "@/lib/blog";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/BlogLayout";

type CategoryParams = Promise<{ category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategorySlugs().map((category) => ({ category }));
}

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
