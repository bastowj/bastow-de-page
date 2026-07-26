import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/blog";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categorySlug, formatDate } from "@/lib/utils";

type SlugParams = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: SlugParams }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: SlugParams }) {
  const resolvedParams = await params;

  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = formatDate(post.date);

  return (
    <div className="main-content-wrapper">
      <article>
        <header className="mb-8">
          {/* Categories, Author, Date, Back link */}
          <div className="blog-post-categories mb-4">
            {post.categories.map((category) => (
              <Link
                key={category}
                href={`/texts/category/${categorySlug(category)}`}
                className="blog-category-link"
              >
                {category}
              </Link>
            ))}
            {post.author && (
              <span className="blog-post-meta">By {post.author},</span>
            )}
            <span className="blog-post-meta">{formattedDate}</span>
            <Link href="/texts" className="link ml-auto">
              Back to all texts
            </Link>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                className="blog-cover-image"
              />
            </div>
          )}
        </header>

        {/* MDX Content */}
        <MDXContent code={post.body} />
      </article>
    </div>
  );
}
