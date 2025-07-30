import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata("about");
}

export default function AboutPage() {
  return <StaticPage slug="about" className="main-content-wrapper" />;
}
