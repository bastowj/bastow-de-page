import { allPages } from "content-collections";

export interface StaticPage {
  slug: string;
  title: string;
  description?: string;
  body: string;
}

type PageDoc = (typeof allPages)[number];

function toStaticPage(doc: PageDoc): StaticPage {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? undefined,
    body: doc.body,
  };
}

export function getStaticPageBySlug(slug: string): StaticPage | null {
  const doc = allPages.find((d) => d.slug === slug);
  return doc ? toStaticPage(doc) : null;
}

export function getStaticPageSlugs(): string[] {
  return allPages.map((page) => page.slug).sort();
}
