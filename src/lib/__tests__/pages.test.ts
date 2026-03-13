import { getStaticPageSlugs, getStaticPageBySlug, getAllStaticPages } from "../pages";
import * as mdxLib from "../mdx";

jest.mock("../mdx");

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(mdxLib, "getMdxSlugs").mockReturnValue([]);
  jest.spyOn(mdxLib, "getMdxContentBySlug").mockReturnValue(null);
  jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([]);
});

describe("getStaticPageSlugs", () => {
  it("returns slugs from the pages directory", () => {
    jest.spyOn(mdxLib, "getMdxSlugs").mockReturnValue(["about", "contact"]);
    expect(getStaticPageSlugs()).toEqual(["about", "contact"]);
  });

  it("returns empty array when no pages exist", () => {
    expect(getStaticPageSlugs()).toEqual([]);
  });
});

describe("getStaticPageBySlug", () => {
  it("returns the page for a valid slug", () => {
    jest.spyOn(mdxLib, "getMdxContentBySlug").mockReturnValue({
      slug: "about",
      content: "About content",
      frontmatter: { title: "About", description: "About me" },
    });
    const page = getStaticPageBySlug("about");
    expect(page?.slug).toBe("about");
    expect(page?.frontmatter.title).toBe("About");
    expect(page?.frontmatter.description).toBe("About me");
  });

  it("returns null for a missing slug", () => {
    expect(getStaticPageBySlug("nonexistent")).toBeNull();
  });
});

describe("getAllStaticPages", () => {
  it("returns all pages", () => {
    jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([
      { slug: "about", content: "", frontmatter: { title: "About", description: "About me" } },
      { slug: "contact", content: "", frontmatter: { title: "Contact", description: "Contact me" } },
    ]);
    const pages = getAllStaticPages();
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.slug)).toEqual(["about", "contact"]);
  });

  it("returns empty array when no pages exist", () => {
    expect(getAllStaticPages()).toEqual([]);
  });
});
