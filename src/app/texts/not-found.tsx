import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="main-content-wrapper">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl text-muted mb-8">
        The blog post or category you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/texts"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  );
}
