import { getAllBlogPosts } from "@/lib/blog";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { LabelBar } from "@/components/LabelBar";
import Link from "next/link";

export default function Home() {
  // Get the latest 3 blog posts
  const latestPosts = getAllBlogPosts().slice(0, 3);

  return (
    <div className="main-content-wrapper">
      <section className="mb-16">
        <div className="mb-12">
          <LabelBar />
          <h1 className="text-4xl font-bold mb-4">Welcome to my stuff</h1>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest texts</h2>
          <Link href="/texts" className="link">
            View all texts
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
