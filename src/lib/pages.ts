import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Types for static pages
export interface StaticPage {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
  };
  content: string;
}

const PAGES_DIRECTORY = path.join(process.cwd(), "content/pages");

/**
 * Get all static page slugs
 */
export function getStaticPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(PAGES_DIRECTORY)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get a single static page by slug
 */
export function getStaticPageBySlug(slug: string): StaticPage | null {
  try {
    const fullPath = path.join(PAGES_DIRECTORY, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: {
        title: data.title || "",
        description: data.description || "",
      },
      content,
    };
  } catch (error) {
    console.error(`Error getting static page ${slug}:`, error);
    return null;
  }
}

/**
 * Get all static pages
 */
export function getAllStaticPages(): StaticPage[] {
  const slugs = getStaticPageSlugs();
  const pages = slugs
    .map((slug) => getStaticPageBySlug(slug))
    .filter((page): page is StaticPage => page !== null);

  return pages;
}
