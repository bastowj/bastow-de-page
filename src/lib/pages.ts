import { allPages } from "content-collections";

export interface StaticPageFrontmatter {
  title: string;
  description?: string;
}

export interface StaticPage {
  slug: string;
  frontmatter: StaticPageFrontmatter;
  body: string;
}

type PageDoc = (typeof allPages)[number];

function toStaticPage(doc: PageDoc): StaticPage {
  return {
    slug: doc.slug,
    frontmatter: {
      title: doc.title,
      description: doc.description ?? undefined,
    },
    body: doc.body,
  };
}

export function getStaticPageSlugs(): string[] {
  return allPages.map((doc) => doc.slug);
}

export function getStaticPageBySlug(slug: string): StaticPage | null {
  const doc = allPages.find((d) => d.slug === slug);
  return doc ? toStaticPage(doc) : null;
}

export function getAllStaticPages(): StaticPage[] {
  return allPages.map(toStaticPage);
}
