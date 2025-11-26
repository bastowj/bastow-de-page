import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata({ slug: "contact" });
}

export default function ContactPage() {
  return <StaticPage slug="contact" className="main-content-wrapper" />;
}
