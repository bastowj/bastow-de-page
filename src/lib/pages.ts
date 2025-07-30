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
 */
export function getStaticPageSlugs(): string[] {
  return getMdxSlugs(PAGES_DIRECTORY);
}

/**
 * Get a single static page by slug
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
 */
export function getAllStaticPages(): StaticPage[] {
  const pages = getAllMdxContent<StaticPageFrontmatter>(PAGES_DIRECTORY);
  return pages as StaticPage[];
}
