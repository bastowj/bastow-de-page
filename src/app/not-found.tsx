import Link from "next/link";

export default function NotFound() {
  return (
    <div className="main-content-wrapper text-center">
      <h1 className="not-found-title">404 - Page Not Found</h1>
      <p className="not-found-message text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
