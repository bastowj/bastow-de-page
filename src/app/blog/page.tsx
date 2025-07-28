import { getAllBlogPosts, getAllCategories } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { CategoryList } from "@/components/CategoryList";

export const metadata = {
  title: "blog | bastow.de",
  description: "tech, dev, digital",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = getAllCategories();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          tech, dev, digital
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <CategoryList categories={categories} />
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
                No blog posts found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
