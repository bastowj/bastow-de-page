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
    title: `${post.frontmatter.title} | Bastow.de Blog`,
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
      <div className="mb-8">
        <Link href="/texts" className="link">
          Back to all texts
        </Link>
      </div>

      <article>
        <header className="mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.frontmatter.categories.map((category) => (
              <Link
                key={category}
                href={`/texts/category/${category}`}
                className="blog-category-link"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="blog-h1">{post.frontmatter.title}</h1>

          {/* Date and Author */}
          <div className="text-gray-600 dark:text-gray-400 mb-6">
            {formattedDate}
            {post.frontmatter.author && ` • By ${post.frontmatter.author}`}
          </div>

          {/* Cover Image */}
          {post.frontmatter.coverImage && (
            <div className="mb-8">
              <Image
                src={post.frontmatter.coverImage}
                alt={post.frontmatter.title}
                width={1200}
                height={630}
                className="rounded-lg w-full object-cover"
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
