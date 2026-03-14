import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "w-6 h-6" }: SpinnerProps) {
  return <ArrowPathIcon className={`animate-spin ${className}`} aria-label="Loading" />;
}
