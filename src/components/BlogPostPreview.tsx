import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";
import { categorySlug, formatDate } from "@/lib/utils";

interface BlogPostPreviewProps {
  post: BlogPost;
}

export function BlogPostPreview({ post }: BlogPostPreviewProps) {
  const { slug, frontmatter } = post;
  const { title, date, excerpt, categories, coverImage } = frontmatter;

  // Format the date using the utility function
  const formattedDate = formatDate(date);

  return (
    <article className="blog-post-preview">
      <div className="blog-post-preview-inner">
        {/* Categories */}
        <div className="blog-post-categories">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/texts/category/${categorySlug(category)}`}
              className="blog-category-link"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="blog-h2">
          <Link href={`/texts/${slug}`}>{title}</Link>
        </h2>

        {/* Date */}
        <div className="blog-date">{formattedDate}</div>

        {/* Cover Image (if available) */}
        {coverImage && (
          <div className="my-4">
            <Link href={`/texts/${slug}`}>
              <Image
                src={coverImage}
                alt={title}
                width={800}
                height={450}
                className="blog-cover-image"
              />
            </Link>
          </div>
        )}

        {/* Excerpt */}
        <p className="blog-excerpt">{excerpt}</p>

        {/* Read More Link */}
        <div>
          <Link href={`/texts/${slug}`} className="link">
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
