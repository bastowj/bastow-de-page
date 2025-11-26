import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/pages";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";
import { cache } from "react";

interface StaticPageProps {
  slug: string;
  className?: string;
}

/**
 * Caches the result of getStaticPageBySlug to avoid re-fetching data.
 * @see https://react.dev/reference/react/cache
 */
const cachedGetStaticPageBySlug = cache(getStaticPageBySlug);

export async function generateStaticPageMetadata({
  slug,
}: {
  slug: string;
}): Promise<Metadata> {
  const page = cachedGetStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default async function StaticPage({
  slug,
  className,
}: StaticPageProps) {
  const page = cachedGetStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className={className}>
      <MDXContent content={page.content} />
    </div>
  );
}
