import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mdx-a px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
