import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";
import { getStaticPageSlugs } from "@/lib/pages";

type SlugParams = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: SlugParams }) {
  const { slug } = await params;
  return generateStaticPageMetadata({ slug });
}

export default async function StaticContentPage({
  params,
}: {
  params: SlugParams;
}) {
  const { slug } = await params;
  return <StaticPage slug={slug} className="main-content-wrapper" />;
}
