import StaticPage, {
  generateStaticPageMetadata,
} from "@/components/StaticPage";

export function generateMetadata() {
  return generateStaticPageMetadata({ slug: "impressum" });
}

export default function ImpressumPage() {
  return (
    <StaticPage slug="impressum" className="main-content-wrapper" />
  );
}
