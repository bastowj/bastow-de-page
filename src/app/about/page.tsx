import StaticPage, { generateStaticPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata("about");
}

export default function AboutPage() {
  return <StaticPage slug="about" className="max-w-4xl mx-auto px-4 py-12" />;
}