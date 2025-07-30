import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MdxContent {
  slug: string;
  frontmatter: Record<string, any>;
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

export function getMdxContentBySlug(
  directory: string,
  slug: string,
): MdxContent | null {
  try {
    const fullPath = path.join(directory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data,
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

export function getAllMdxContent(directory: string): MdxContent[] {
  const slugs = getMdxSlugs(directory);
  const allContent = slugs
    .map((slug) => getMdxContentBySlug(directory, slug))
    .filter((content): content is MdxContent => content !== null);

  return allContent;
}
