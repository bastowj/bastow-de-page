import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata("privacy");
}

export default function ImpressumPage() {
  return <StaticPage slug="privacy" className="main-content-wrapper" />;
}
