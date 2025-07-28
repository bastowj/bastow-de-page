'use client';

import { useState, useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Image from 'next/image';
import Link from 'next/link';

// Custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mdx-h1" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mdx-h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mdx-h3" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mdx-p" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mdx-ul" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="mdx-ol" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="mdx-li" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Ensure href is a string and not undefined
    const href = props.href || '#';
    return (
      <Link
        href={href}
        className="mdx-a"
        {...props}
      />
    );
  },
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Ensure src is a string and not undefined
    const src = props.src?.toString() || '';
    return (
      <div className="my-6">
        <Image
          src={src}
          alt={props.alt || ''}
          width={800}
          height={450}
          className="mdx-img"
        />
        {props.alt && <p className="mdx-img-alt">{props.alt}</p>}
      </div>
    );
  },
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mdx-blockquote" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="mdx-code" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mdx-pre" {...props} />
  ),
};

interface ClientMDXContentProps {
  content: string;
}

export function ClientMDXContent({ content }: ClientMDXContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const serializeMdx = async () => {
      const serialized = await serialize(content);
      setMdxSource(serialized as MDXRemoteSerializeResult);
    };
    
    serializeMdx();
  }, [content]);

  if (!mdxSource) {
    return <div>Loading...</div>;
  }

  return <MDXRemote {...mdxSource} components={components} />;
}