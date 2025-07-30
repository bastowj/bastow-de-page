import { getBlogPostsByCategory, getAllCategories } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { CategoryList } from "@/components/CategoryList";
import { notFound } from "next/navigation";

// Define params type for Next.js 15
type CategoryParams = Promise<{ category: string }>;

// Generate metadata for the page - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params }: { params: CategoryParams }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category);
  const allCategories = getAllCategories();

  if (!allCategories.includes(categoryName)) {
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
  const categoryName = decodeURIComponent(resolvedParams.category);
  const allCategories = getAllCategories();

  if (!allCategories.includes(categoryName)) {
    notFound();
  }

  const posts = getBlogPostsByCategory(categoryName);

  return (
    <div className="main-content-wrapper">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Category: {categoryName}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Explore articles in the {categoryName} category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <CategoryList
            categories={allCategories}
            activeCategory={categoryName}
          />
        </div>

        {/* Blog posts */}
        <div className="lg:col-span-3">
          <div className="space-y-10">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogPostPreview key={post.slug} post={post} />
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">
                No blog posts found in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
