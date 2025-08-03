import { getAllBlogPosts, getAllCategories } from "@/lib/blog";
import { BlogLayout } from "@/components/BlogLayout";

export const metadata = {
  title: "blog | bastow.de",
  description: "🌍 Language / 💻 Tech / 🖧 Infra / 📦 Product / 👥 Team",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = getAllCategories();

  return <BlogLayout posts={posts} categories={categories} showLabelBar />;
}
