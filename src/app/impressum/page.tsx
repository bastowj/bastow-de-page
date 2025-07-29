import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/pages";
import { MDXContent } from "@/components/MDXContent";
import { notFound } from "next/navigation";

// Generate metadata for the page - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export function generateMetadata(): Metadata {
  const page = getStaticPageBySlug("impressum");

  if (!page) {
    notFound();
  }

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  };
}

export default function ImpressumPage() {
  const page = getStaticPageBySlug("impressum");

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <MDXContent content={page.content} />
    </div>
  );
}
