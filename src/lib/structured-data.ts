import { SITE_CONFIG } from "@/constants/config";
import type { BlogPost } from "@/lib/blog";

export function getBlogPostUrl(slug: string): string {
  return `${SITE_CONFIG.baseUrl}/texts/${slug}`;
}

export function getBlogPostingJsonLd(post: BlogPost) {
  const url = getBlogPostUrl(post.slug);
  const author = post.author ?? SITE_CONFIG.author;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.baseUrl,
    },
    articleSection: post.categories,
    keywords: post.categories.join(", "),
    ...(post.coverImage && {
      image: new URL(post.coverImage, `${SITE_CONFIG.baseUrl}/`).toString(),
    }),
  };
}

/** Prevent user-controlled content from closing the JSON-LD script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
