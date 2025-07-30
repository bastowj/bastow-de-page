import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/pages";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";

interface StaticPageProps {
  slug: string;
  className?: string;
}

export async function generateStaticPageMetadata(slug: string): Promise<Metadata> {
  const page = getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default function StaticPage({ slug, className }: StaticPageProps) {
  const page = getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className={className}>
      <MDXContent content={page.content} />
    </div>
  );
}