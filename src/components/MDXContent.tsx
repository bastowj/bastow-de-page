import { MDXContent as MDXContentBase } from "@content-collections/mdx/react";
import Image from "next/image";
import Link from "next/link";

/** Keeps our base class while preserving classes MDX adds (e.g. language-bash). */
const cx = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

const isExternalHref = (href: string) =>
  /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href);

export const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className={cx("mdx-h1", className)} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cx("mdx-h2", className)} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cx("mdx-h3", className)} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className={cx("mdx-p", className)} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className={cx("mdx-ul", className)} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className={cx("mdx-ol", className)} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className={cx("mdx-li", className)} />
  ),
  a: ({
    href = "#",
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // next/link applies client-side routing to off-site URLs and carries no rel
    // hardening, so send those through a plain anchor.
    if (isExternalHref(href)) {
      return (
        <a
          {...props}
          href={href}
          className={cx("mdx-a", className)}
          target="_blank"
          rel="noopener noreferrer"
        />
      );
    }
    return <Link {...props} href={href} className={cx("mdx-a", className)} />;
  },
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const src = props.src?.toString() || "";
    return (
      <div className="my-6">
        <Image
          src={src}
          alt={props.alt || ""}
          width={800}
          height={450}
          className="mdx-img"
        />
        {props.alt && <p className="mdx-img-alt">{props.alt}</p>}
      </div>
    );
  },
  blockquote: ({
    className,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} className={cx("mdx-blockquote", className)} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className={cx("mdx-code", className)} />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className={cx("mdx-pre", className)} />
  ),
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  return <MDXContentBase code={code} components={mdxComponents} />;
}
