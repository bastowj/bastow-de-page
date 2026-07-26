import React from "react";
import { render } from "@testing-library/react";
import { mdxComponents } from "../MDXContent";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a data-next-link="true" href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderEl(el: React.ReactElement) {
  const { container } = render(el);
  return container.firstElementChild as HTMLElement;
}

describe("mdxComponents class merging", () => {
  const Code = mdxComponents.code;
  const Pre = mdxComponents.pre;
  const P = mdxComponents.p;

  it("keeps the base class when MDX adds none", () => {
    expect(renderEl(<Code>x</Code>).className).toBe("mdx-code");
  });

  it("keeps both when MDX adds a language class to a fenced block", () => {
    const el = renderEl(<Code className="language-bash">x</Code>);
    expect(el.className).toBe("mdx-code language-bash");
  });

  it("does not let an MDX class replace the base class", () => {
    // The previous spread order dropped mdx-code entirely for fenced blocks.
    for (const el of [
      renderEl(<Pre className="language-ts">x</Pre>),
      renderEl(<P className="whatever">x</P>),
    ]) {
      expect(el.className.split(" ")).toContain(
        el.tagName === "PRE" ? "mdx-pre" : "mdx-p",
      );
    }
  });
});

describe("mdxComponents links", () => {
  const A = mdxComponents.a;

  it("routes a relative link through next/link", () => {
    const el = renderEl(<A href="/texts">t</A>);
    expect(el.dataset.nextLink).toBe("true");
    expect(el).not.toHaveAttribute("target");
  });

  it("routes an http link through a plain anchor with rel hardening", () => {
    const el = renderEl(<A href="https://example.com">t</A>);
    expect(el.dataset.nextLink).toBeUndefined();
    expect(el).toHaveAttribute("target", "_blank");
    expect(el).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("treats protocol-relative and mailto and tel as external", () => {
    for (const href of ["//example.com", "mailto:a@b.de", "tel:+49123"]) {
      const el = renderEl(<A href={href}>t</A>);
      expect(el.dataset.nextLink).toBeUndefined();
      expect(el).toHaveAttribute("href", href);
    }
  });

  it("keeps the base class alongside an MDX class", () => {
    expect(renderEl(<A href="/x" className="extra" />).className).toBe(
      "mdx-a extra",
    );
  });

  it("falls back to # when href is missing", () => {
    expect(renderEl(<A>t</A>)).toHaveAttribute("href", "#");
  });
});
