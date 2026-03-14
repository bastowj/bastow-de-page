import { getBlogPostBySlug } from "@/lib/blog";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils"; // Import formatDate

// Define params type for Next.js 15
type SlugParams = Promise<{ slug: string }>;

// Generate metadata for the page - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export async function generateMetadata({ params }: { params: SlugParams }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: SlugParams }) {
  // Await the params object first
  const resolvedParams = await params;

  // Get the post data
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Get the raw MDX content
  const mdxContent = post.content;

  // Format the date using the utility function
  const formattedDate = formatDate(post.frontmatter.date);

  return (
    <div className="main-content-wrapper">
      <article>
        <header className="mb-8">
          {/* Categories, Author, Date, Back link */}
          <div className="blog-post-categories mb-4">
            {post.frontmatter.categories.map((category) => (
              <Link
                key={category}
                href={`/texts/category/${category}`}
                className="blog-category-link"
              >
                {category}
              </Link>
            ))}
            {post.frontmatter.author && (
              <span className="blog-post-meta">By {post.frontmatter.author},</span>
            )}
            <span className="blog-post-meta">{formattedDate}</span>
            <Link href="/texts" className="link ml-auto">
              Back to all texts
            </Link>
          </div>

          {/* Cover Image */}
          {post.frontmatter.coverImage && (
            <div className="mb-8">
              <Image
                src={post.frontmatter.coverImage}
                alt={post.frontmatter.title}
                width={1200}
                height={630}
                className="blog-cover-image"
              />
            </div>
          )}
        </header>

        {/* MDX Content */}
        <MDXContent content={mdxContent} />
      </article>
    </div>
  );
}
