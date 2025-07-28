import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Types for blog posts
export interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    categories: string[];
    coverImage?: string;
    author?: string;
  };
  content: string;
}

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog");

/**
 * Get all blog post slugs
 */
export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: {
        title: data.title || "",
        date: data.date || "",
        excerpt: data.excerpt || "",
        categories: data.categories || [],
        coverImage: data.coverImage || "",
        author: data.author || "",
      },
      content,
    };
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error);
    return null;
  }
}

/**
 * Get all blog posts
 */
export function getAllBlogPosts(): BlogPost[] {
  const slugs = getBlogPostSlugs();
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
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
