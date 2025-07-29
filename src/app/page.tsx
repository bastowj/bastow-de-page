import { getAllBlogPosts } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import Link from "next/link";

export default function Home() {
  // Get the latest 3 blog posts
  const latestPosts = getAllBlogPosts().slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to my page</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            🌍 Language / 💻 Tech / 🏗️ Infra / 📦 Product / 👥 Team
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest posts</h2>
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all posts →
          </Link>
        </div>

        <div className="space-y-10">
          {latestPosts.map((post) => (
            <BlogPostPreview key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
