import path from "path";
import {
  getMdxSlugs,
  getMdxContentBySlug,
  getAllMdxContent,
  MdxContent,
} from "./mdx";

// Types for blog posts
export interface BlogPostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  coverImage?: string;
  author?: string;
}

export interface BlogPost extends MdxContent {
  frontmatter: BlogPostFrontmatter;
}

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

/**
 * Get all blog post slugs
 */
export function getBlogPostSlugs(): string[] {
  return getMdxSlugs(BLOG_DIRECTORY);
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const mdxContent = getMdxContentBySlug(BLOG_DIRECTORY, slug);
  if (!mdxContent) {
    return null;
  }

  // Type assertion for frontmatter
  return {
    ...mdxContent,
    frontmatter: mdxContent.frontmatter as BlogPostFrontmatter,
  };
}

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPost[] {
  const allMdxContent = getAllMdxContent(BLOG_DIRECTORY);
  const posts = allMdxContent
    .map((mdxContent) => ({
      ...mdxContent,
      frontmatter: mdxContent.frontmatter as BlogPostFrontmatter,
    }))
    .sort(
      (post1, post2) =>
        new Date(post2.frontmatter.date).getTime() -
        new Date(post1.frontmatter.date).getTime(),
    );

  return posts;
}

/**
 * Get all categories from blog posts
 */
export function getAllCategories(): string[] {
  const posts = getAllBlogPosts();
  const categoriesSet = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.categories.forEach((category) => {
      categoriesSet.add(category);
    });
  });

  return Array.from(categoriesSet).sort();
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(category: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter((post) => post.frontmatter.categories.includes(category));
}
