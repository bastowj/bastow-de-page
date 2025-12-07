import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="main-content-wrapper">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl text-muted mb-8">
        The text or category you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/texts"
        className="blog-category-link"
      >
        Back to Texts
      </Link>
    </div>
  );
}
