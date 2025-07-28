import { getBlogPostsByCategory, getAllCategories } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { CategoryList } from "@/components/CategoryList";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { category: string } }) {
  // Await the params object first
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category);
  const allCategories = getAllCategories();
  
  if (!allCategories.includes(categoryName)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }
  
  return {
    title: `${categoryName} | Bastow.de Blog`,
    description: `Explore articles in the ${categoryName} category`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  // Await the params object first
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category);
  const allCategories = getAllCategories();
  
  if (!allCategories.includes(categoryName)) {
    notFound();
  }
  
  const posts = getBlogPostsByCategory(categoryName);
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Category: {categoryName}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Explore articles in the {categoryName} category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <CategoryList categories={allCategories} activeCategory={categoryName} />
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