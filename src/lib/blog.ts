import { allTexts } from "content-collections";

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  coverImage?: string;
  author?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  body: string;
}

type TextDoc = (typeof allTexts)[number];

function toBlogPost(doc: TextDoc): BlogPost {
  return {
    slug: doc.slug,
    frontmatter: {
      title: doc.title,
      date: doc.date,
      excerpt: doc.excerpt,
      categories: doc.categories,
      coverImage: doc.coverImage ?? undefined,
      author: doc.author ?? undefined,
    },
    body: doc.body,
  };
}

export function getBlogPostSlugs(): string[] {
  return allTexts.map((doc) => doc.slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const doc = allTexts.find((d) => d.slug === slug);
  return doc ? toBlogPost(doc) : null;
}

export function getAllBlogPosts(): BlogPost[] {
  return allTexts
    .map(toBlogPost)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
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
    post.frontmatter.categories.includes(category),
  );
}
