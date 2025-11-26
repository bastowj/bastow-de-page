import fs from "fs";
import path from "path";
import matter from "gray-matter";
/**
 * Represents MDX content with frontmatter and content
 *
 * @template T - Type of the frontmatter
 *
 * @property {string} slug - The slug of the MDX file
 * @property {T} frontmatter - The frontmatter of the MDX file
 * @property {string} content - The content of the MDX file
 */
export interface MdxContent<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  content: string;
}
/**
 * Get all MDX slugs from a directory
 *
 * @param {string} directory - The directory to search for MDX files
 * @returns {string[]} An array of slugs (filenames without .mdx extension)
 */
export function getMdxSlugs(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
/**
 * Get MDX content by slug
 *
 * @template T - Type of the frontmatter
 * @param {string} directory - The directory containing the MDX files
 * @param {string} slug - The slug of the MDX file to retrieve
 * @returns {MdxContent<T> | null} The MDX content or null if not found
 */
export function getMdxContentBySlug<T = Record<string, unknown>>(
  directory: string,
  slug: string,
): MdxContent<T> | null {
  try {
    const fullPath = path.join(directory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as T,
      content,
    };
  } catch (error) {
    console.error(
      `Error getting MDX content for ${slug} in ${directory}:`,
      error,
    );
    return null;
  }
}
/**
 * Get all MDX content from a directory
 *
 * @template T - Type of the frontmatter
 * @param {string} directory - The directory containing the MDX files
 * @returns {MdxContent<T>[]} An array of MDX content objects
 */
export function getAllMdxContent<T = Record<string, unknown>>(
  directory: string,
): MdxContent<T>[] {
  const slugs = getMdxSlugs(directory);
  const allContent = slugs
    .map((slug) => getMdxContentBySlug<T>(directory, slug))
    .filter((content): content is MdxContent<T> => content !== null);

  return allContent;
}
