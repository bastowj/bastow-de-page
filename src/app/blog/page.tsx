import { getAllBlogPosts, getAllCategories } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { CategoryList } from "@/components/CategoryList";
import { LabelBar } from "@/components/LabelBar";

export const metadata = {
  title: "blog | bastow.de",
  description: "🌍 Language / 💻 Tech / 🖧 Infra / 📦 Product / 👥 Team",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = getAllCategories();

  return (
    <div className="main-content-wrapper">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Stuff I write</h1>
        <LabelBar />
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
