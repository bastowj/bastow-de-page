import { allTexts } from "content-collections";
import { categorySlug, isValidSlug } from "@/lib/utils";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  coverImage?: string;
  author?: string;
  body: string;
}

type TextDoc = (typeof allTexts)[number];

/**
 * A post's slug is its MDX filename, which becomes the public URL verbatim.
 * Unlike a category it is not slugified, because that would rewrite already
 * published URLs. So an unsafe filename has to fail the build instead.
 */
function assertSafeSlug(slug: string): string {
  if (!isValidSlug(slug)) {
    throw new Error(
      `Post slug ${JSON.stringify(slug)} is not URL-safe. Rename the MDX file to use only letters, digits, hyphens and underscores.`,
    );
  }
  return slug;
}

function toBlogPost(doc: TextDoc): BlogPost {
  return {
    slug: assertSafeSlug(doc.slug),
    title: doc.title,
    date: doc.date,
    excerpt: doc.excerpt,
    categories: doc.categories,
    coverImage: doc.coverImage ?? undefined,
    author: doc.author ?? undefined,
    body: doc.body,
  };
}

export function getBlogPostSlugs(): string[] {
  return allTexts.map((doc) => assertSafeSlug(doc.slug));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const doc = allTexts.find((d) => d.slug === slug);
  return doc ? toBlogPost(doc) : null;
}

export function getAllBlogPosts(): BlogPost[] {
  return allTexts
    .map(toBlogPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllCategories(): string[] {
  const categoriesSet = new Set<string>();
  for (const post of allTexts) {
    for (const category of post.categories) {
      categoriesSet.add(category);
    }
  }
  return Array.from(categoriesSet).sort();
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter((post) =>
    post.categories.includes(category),
  );
}

function getCategorySlugMap(): Map<string, string> {
  const bySlug = new Map<string, string>();
  for (const category of getAllCategories()) {
    const slug = categorySlug(category);
    if (!slug) {
      throw new Error(
        `Category ${JSON.stringify(category)} has no URL-safe slug`,
      );
    }
    const claimed = bySlug.get(slug);
    if (claimed !== undefined && claimed !== category) {
      throw new Error(
        `Categories ${JSON.stringify(claimed)} and ${JSON.stringify(category)} both slugify to ${JSON.stringify(slug)}`,
      );
    }
    bySlug.set(slug, category);
  }
  return bySlug;
}

export function getCategorySlugs(): string[] {
  return Array.from(getCategorySlugMap().keys()).sort();
}

export function getCategoryBySlug(slug: string): string | null {
  return getCategorySlugMap().get(slug) ?? null;
}
