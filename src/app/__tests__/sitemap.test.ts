import sitemap from "../sitemap";
import * as blog from "@/lib/blog";
import { SITE_CONFIG } from "@/constants/config";
import type { BlogPost } from "@/lib/blog";

jest.mock("@/lib/blog");

function makePost(slug: string, date: string, categories: string[]): BlogPost {
  return {
    slug,
    content: "",
    frontmatter: { title: slug, date, excerpt: "", categories },
  };
}

beforeEach(() => {
  jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([]);
  jest.spyOn(blog, "getAllCategories").mockReturnValue([]);
});

describe("sitemap", () => {
  it("includes all static routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain(SITE_CONFIG.baseUrl);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/about`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/contact`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/impressum`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/privacy`);
  });

  it("gives the root route priority 1", async () => {
    const entries = await sitemap();
    const root = entries.find((e) => e.url === SITE_CONFIG.baseUrl);
    expect(root?.priority).toBe(1);
  });

  it("includes blog post URLs", async () => {
    jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([
      makePost("hello-world", "2024-01-01", []),
    ]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/hello-world`);
  });

  it("uses post date as lastModified for blog posts", async () => {
    jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([
      makePost("hello-world", "2024-06-15", []),
    ]);
    const entries = await sitemap();
    const post = entries.find((e) => e.url.endsWith("/texts/hello-world"));
    expect(post?.lastModified).toEqual(new Date("2024-06-15"));
  });

  it("includes category URLs", async () => {
    jest.spyOn(blog, "getAllCategories").mockReturnValue(["Tech", "Linux"]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/Tech`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/Linux`);
  });
});
