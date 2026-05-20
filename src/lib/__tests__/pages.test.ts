type PageDoc = {
  slug: string;
  title: string;
  description: string;
  body: string;
};

const mockPages: PageDoc[] = [];

jest.mock(
  "content-collections",
  () => ({
    allTexts: [],
    allPages: mockPages,
  }),
  { virtual: true },
);

import {
  getStaticPageSlugs,
  getStaticPageBySlug,
  getAllStaticPages,
} from "../pages";

beforeEach(() => {
  mockPages.length = 0;
});

describe("getStaticPageSlugs", () => {
  it("returns slugs from the pages directory", () => {
    mockPages.push(
      { slug: "about", title: "About", description: "", body: "" },
      { slug: "contact", title: "Contact", description: "", body: "" },
    );
    expect(getStaticPageSlugs()).toEqual(["about", "contact"]);
  });

  it("returns empty array when no pages exist", () => {
    expect(getStaticPageSlugs()).toEqual([]);
  });
});

describe("getStaticPageBySlug", () => {
  it("returns the page for a valid slug", () => {
    mockPages.push({
      slug: "about",
      title: "About",
      description: "About me",
      body: "About content",
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
    mockPages.push(
      { slug: "about", title: "About", description: "About me", body: "" },
      { slug: "contact", title: "Contact", description: "Contact me", body: "" },
    );
    const pages = getAllStaticPages();
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.slug)).toEqual(["about", "contact"]);
  });

  it("returns empty array when no pages exist", () => {
    expect(getAllStaticPages()).toEqual([]);
  });
});
