import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MdxContent<T = Record<string, unknown>> {
  slug: string;
  frontmatter: T;
  content: string;
}

export function getMdxSlugs(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

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

export function getAllMdxContent<T = Record<string, unknown>>(
  directory: string,
): MdxContent<T>[] {
  const slugs = getMdxSlugs(directory);
  const allContent = slugs
    .map((slug) => getMdxContentBySlug<T>(directory, slug))
    .filter((content): content is MdxContent<T> => content !== null);

  return allContent;
}
