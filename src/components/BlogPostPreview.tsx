import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/utils"; // Import formatDate

interface BlogPostPreviewProps {
  post: BlogPost;
}

export function BlogPostPreview({ post }: BlogPostPreviewProps) {
  const { slug, frontmatter } = post;
  const { title, date, excerpt, categories, coverImage } = frontmatter;

  // Format the date using the utility function
  const formattedDate = formatDate(date);

  return (
    <article className="mb-10 border-b border-subtle pb-8">
      <div className="flex flex-col gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/texts/category/${category}`}
              className="bp-category-link"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold">
          <Link href={`/texts/${slug}`} className="bp-title">
            {title}
          </Link>
        </h2>

        {/* Date */}
        <div className="bpp-date">{formattedDate}</div>

        {/* Cover Image (if available) */}
        {coverImage && (
          <div className="my-4">
            <Link href={`/texts/${slug}`}>
              <Image
                src={coverImage}
                alt={title}
                width={800}
                height={450}
                className="bpp-cover-image"
              />
            </Link>
          </div>
        )}

        {/* Excerpt */}
        <p className="bpp-excerpt">{excerpt}</p>

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
