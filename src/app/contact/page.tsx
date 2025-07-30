import StaticPage, { generateStaticPageMetadata } from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata("contact");
}

export default function ContactPage() {
  return <StaticPage slug="contact" className="max-w-5xl mx-auto px-4 py-12" />;
}