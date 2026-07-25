import sitemap from "../sitemap";
import * as blog from "@/lib/blog";
import { SITE_CONFIG } from "@/constants/config";
import { legalNavItems, navItems } from "@/constants/navigation";
import type { BlogPost } from "@/lib/blog";

jest.mock("@/lib/blog", () => ({
  getAllBlogPosts: jest.fn(),
  getCategorySlugs: jest.fn(),
}));

function makePost(slug: string, date: string, categories: string[]): BlogPost {
  return {
    slug,
    body: "",
    frontmatter: { title: slug, date, excerpt: "", categories },
  };
}

beforeEach(() => {
  jest.spyOn(blog, "getAllBlogPosts").mockReturnValue([]);
  jest.spyOn(blog, "getCategorySlugs").mockReturnValue([]);
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
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/images`);
  });

  it("covers every nav and legal page", async () => {
    const urls = (await sitemap()).map((e) => e.url);

    for (const item of [...navItems, ...legalNavItems]) {
      const expected =
        item.href === "/" ? SITE_CONFIG.baseUrl : `${SITE_CONFIG.baseUrl}${item.href}`;
      expect(urls).toContain(expected);
    }
  });

  it("does not emit a trailing slash for the root route", async () => {
    const urls = (await sitemap()).map((e) => e.url);

    expect(urls).toContain(SITE_CONFIG.baseUrl);
    expect(urls).not.toContain(`${SITE_CONFIG.baseUrl}/`);
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
    jest.spyOn(blog, "getCategorySlugs").mockReturnValue(["tech", "linux"]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/tech`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/linux`);
  });

  it("emits URL-safe category URLs for names needing a slug", async () => {
    jest
      .spyOn(blog, "getCategorySlugs")
      .mockReturnValue(["web-dev", "100-pure", "muenchen"]);
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/web-dev`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/100-pure`);
    expect(urls).toContain(`${SITE_CONFIG.baseUrl}/texts/category/muenchen`);
    for (const url of urls) {
      expect(url).toBe(encodeURI(url));
      expect(url).not.toMatch(/[ %]/);
    }
  });
});
