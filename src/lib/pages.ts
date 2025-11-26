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

export type StaticPage = MdxContent<StaticPageFrontmatter>;

const PAGES_DIRECTORY = path.join(process.cwd(), "content/pages");

/**
 * Get all static page slugs
 *
 * @returns An array of slugs
 */
export function getStaticPageSlugs(): string[] {
  return getMdxSlugs(PAGES_DIRECTORY);
}

/**
 * Get a single static page by slug
 *
 * @param slug - The slug of the page to get
 * @returns The static page or `null` if not found
 */
export function getStaticPageBySlug(slug: string): StaticPage | null {
  const mdxContent = getMdxContentBySlug<StaticPageFrontmatter>(
    PAGES_DIRECTORY,
    slug,
  );
  if (!mdxContent) {
    return null;
  }

  return mdxContent as StaticPage;
}

/**
 * Get all static pages
 *
 * @returns An array of static pages
 */
export function getAllStaticPages(): StaticPage[] {
  const pages = getAllMdxContent<StaticPageFrontmatter>(PAGES_DIRECTORY);
  return pages as StaticPage[];
}
