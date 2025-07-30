import StaticPage, { generateStaticPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata("impressum");
}

export default function ImpressumPage() {
  return <StaticPage slug="impressum" className="max-w-6xl mx-auto px-4 py-12" />;
}
