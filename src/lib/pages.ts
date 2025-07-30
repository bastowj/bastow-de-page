import path from "path";
import {
  getMdxSlugs,
  getMdxContentBySlug,
  getAllMdxContent,
  MdxContent,
} from "@/lib/mdx";

// Types for static pages
export interface StaticPageFrontmatter {
  title: string;
  description: string;
}

export interface StaticPage extends MdxContent {
  frontmatter: StaticPageFrontmatter;
}

const PAGES_DIRECTORY = path.join(process.cwd(), "content/pages");

/**
 * Get all static page slugs
 */
export function getStaticPageSlugs(): string[] {
  return getMdxSlugs(PAGES_DIRECTORY);
}

/**
 * Get a single static page by slug
 */
export function getStaticPageBySlug(slug: string): StaticPage | null {
  const mdxContent = getMdxContentBySlug(PAGES_DIRECTORY, slug);
  if (!mdxContent) {
    return null;
  }

  // Type assertion for frontmatter
  return {
    ...mdxContent,
    frontmatter: mdxContent.frontmatter as StaticPageFrontmatter,
  };
}

/**
 * Get all static pages
 */
export function getAllStaticPages(): StaticPage[] {
  const allMdxContent = getAllMdxContent(PAGES_DIRECTORY);
  const pages = allMdxContent
    .map((mdxContent) => ({
      ...mdxContent,
      frontmatter: mdxContent.frontmatter as StaticPageFrontmatter,
    }))
    .filter((page): page is StaticPage => page !== null);

  return pages;
}
