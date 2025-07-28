// MDXContent.tsx - Server Component
import { ClientMDXContent } from "./ClientMDXContent";

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ClientMDXContent content={content} />
    </div>
  );
}
