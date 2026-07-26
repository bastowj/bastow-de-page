import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata({ slug: "privacy" });
}

export default function PrivacyPage() {
  return <StaticPage slug="privacy" className="main-content-wrapper" />;
}
