import { GET } from "../route";
import * as blog from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

jest.mock("@/lib/blog");

function makePost(overrides: Partial<BlogPost["frontmatter"]> = {}): BlogPost {
  return {
    slug: "test-post",
    content: "",
    frontmatter: {
      title: "Test Post",
      date: "2024-06-01",
      excerpt: "A test excerpt.",
      categories: ["Tech"],
      author: "Julian Bastow",
      ...overrides,
    },
  };
}

beforeEach(() => {
  jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([]);
});

describe("GET /feed.xml", () => {
  it("returns 200 with correct content type", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
  });

  it("returns valid RSS envelope", async () => {
    const res = await GET();
    const xml = await res.text();
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("</rss>");
    expect(xml).toContain("<channel>");
  });

  it("includes post title, link, date, and excerpt", async () => {
    jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([makePost()]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<![CDATA[Test Post]]>");
    expect(xml).toContain("/texts/test-post");
    expect(xml).toContain("<![CDATA[A test excerpt.]]>");
    expect(xml).toContain(new Date("2024-06-01").toUTCString());
  });

  it("includes author when present", async () => {
    jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([makePost()]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<author>Julian Bastow</author>");
  });

  it("omits author tag when not present", async () => {
    jest
      .spyOn(blog, "getAllBlogPosts")
      .mockReturnValue([makePost({ author: undefined })]);
    const xml = await (await GET()).text();
    expect(xml).not.toContain("<author>");
  });

  it("includes categories", async () => {
    jest
      .spyOn(blog, "getAllBlogPosts")
      .mockReturnValue([makePost({ categories: ["Tech", "Linux"] })]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<category>Tech</category>");
    expect(xml).toContain("<category>Linux</category>");
  });

  it("renders one item per post", async () => {
    jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([
      makePost({ title: "Post A" }),
      makePost({ title: "Post B" }),
    ]);
    const xml = await (await GET()).text();
    expect(xml).toContain("<![CDATA[Post A]]>");
    expect(xml).toContain("<![CDATA[Post B]]>");
  });
});
