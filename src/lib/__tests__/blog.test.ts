type TextDoc = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  categories: string[];
  coverImage?: string;
  author?: string;
  body: string;
};

const mockTexts: TextDoc[] = [];

jest.mock(
  "content-collections",
  () => ({
    allTexts: mockTexts,
    allPages: [],
  }),
  { virtual: true },
);

import {
  getAllBlogPosts,
  getAllCategories,
  getBlogPostsByCategory,
  getCategoryBySlug,
  getCategorySlugs,
} from "../blog";

function addDoc(slug: string, date: string, categories: string[]) {
  mockTexts.push({
    slug,
    title: slug,
    date,
    excerpt: "",
    categories,
    body: "",
  });
}

beforeEach(() => {
  mockTexts.length = 0;
});

describe("getAllBlogPosts", () => {
  it("returns posts sorted newest first", () => {
    addDoc("old", "2023-01-01", []);
    addDoc("new", "2024-06-01", []);
    addDoc("mid", "2023-12-01", []);

    const posts = getAllBlogPosts();
    expect(posts.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });
});

describe("getAllCategories", () => {
  it("returns a sorted, deduplicated list of categories", () => {
    addDoc("a", "2024-01-01", ["Tech", "Language"]);
    addDoc("b", "2024-02-01", ["Tech", "Product"]);

    expect(getAllCategories()).toEqual(["Language", "Product", "Tech"]);
  });

  it("returns empty array when there are no posts", () => {
    expect(getAllCategories()).toEqual([]);
  });
});

describe("getBlogPostsByCategory", () => {
  it("returns only posts matching the given category", () => {
    addDoc("a", "2024-01-01", ["Tech"]);
    addDoc("b", "2024-02-01", ["Language"]);
    addDoc("c", "2024-03-01", ["Tech", "Infra"]);

    const result = getBlogPostsByCategory("Tech");
    expect(result.map((p) => p.slug)).toEqual(["c", "a"]);
  });

  it("returns empty array when no posts match", () => {
    addDoc("a", "2024-01-01", ["Tech"]);

    expect(getBlogPostsByCategory("Language")).toEqual([]);
  });
});

describe("getCategorySlugs", () => {
  it("returns URL-safe slugs for names that need one", () => {
    addDoc("a", "2024-01-01", ["web dev", "münchen", "100% pure"]);

    expect(getCategorySlugs()).toEqual(["100-pure", "muenchen", "web-dev"]);
  });

  it("throws when two categories share a slug", () => {
    addDoc("a", "2024-01-01", ["web dev", "Web-Dev"]);

    expect(() => getCategorySlugs()).toThrow(/both slugify to "web-dev"/);
  });

  it("throws when a category has no URL-safe slug", () => {
    addDoc("a", "2024-01-01", ["+++"]);

    expect(() => getCategorySlugs()).toThrow(/no URL-safe slug/);
  });
});

describe("getCategoryBySlug", () => {
  it("resolves a slug back to the original category name", () => {
    addDoc("a", "2024-01-01", ["web dev", "münchen"]);

    expect(getCategoryBySlug("web-dev")).toBe("web dev");
    expect(getCategoryBySlug("muenchen")).toBe("münchen");
  });

  it("returns null for an unknown slug", () => {
    addDoc("a", "2024-01-01", ["Tech"]);

    expect(getCategoryBySlug("nope")).toBeNull();
  });

  it("does not resolve the unslugified name", () => {
    addDoc("a", "2024-01-01", ["web dev"]);

    expect(getCategoryBySlug("web dev")).toBeNull();
  });
});
