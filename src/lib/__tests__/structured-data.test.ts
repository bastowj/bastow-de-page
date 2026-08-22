import { SITE_CONFIG } from "@/constants/config";
import type { BlogPost } from "@/lib/blog";
import {
  getBlogPostingJsonLd,
  getBlogPostUrl,
  serializeJsonLd,
} from "@/lib/structured-data";

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "example-post",
    title: "Example post",
    date: "2026-08-23",
    excerpt: "An example description.",
    categories: ["Tech", "Web"],
    author: "Example Author",
    body: "",
    ...overrides,
  };
}

describe("getBlogPostingJsonLd", () => {
  it("builds BlogPosting data from a post", () => {
    const data = getBlogPostingJsonLd(
      makePost({ coverImage: "/images/cover.jpg" }),
    );

    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Example post",
      description: "An example description.",
      datePublished: "2026-08-23",
      url: `${SITE_CONFIG.baseUrl}/texts/example-post`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_CONFIG.baseUrl}/texts/example-post`,
      },
      author: { "@type": "Person", name: "Example Author" },
      articleSection: ["Tech", "Web"],
      keywords: "Tech, Web",
      image: `${SITE_CONFIG.baseUrl}/images/cover.jpg`,
    });
  });

  it("uses the site author and omits a missing image", () => {
    const data = getBlogPostingJsonLd(
      makePost({ author: undefined, coverImage: undefined }),
    );

    expect(data.author.name).toBe(SITE_CONFIG.author);
    expect(data).not.toHaveProperty("image");
  });
});

describe("getBlogPostUrl", () => {
  it("returns the canonical post URL", () => {
    expect(getBlogPostUrl("example-post")).toBe(
      `${SITE_CONFIG.baseUrl}/texts/example-post`,
    );
  });
});

describe("serializeJsonLd", () => {
  it("escapes markup that could close the script element", () => {
    const serialized = serializeJsonLd({ title: "</script><script>" });

    expect(serialized).toContain("\\u003c/script>");
    expect(serialized).not.toContain("</script>");
  });
});
