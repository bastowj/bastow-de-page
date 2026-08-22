import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "w-6 h-6" }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex">
      <ArrowPathIcon
        className={`animate-spin ${className}`}
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </span>
  );
}
