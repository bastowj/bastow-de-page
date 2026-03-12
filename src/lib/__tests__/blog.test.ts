import {
  getAllBlogPosts,
  getAllCategories,
  getBlogPostsByCategory,
  type BlogPost,
} from "../blog";
import * as mdxLib from "../mdx";

jest.mock("../mdx");

function makePost(slug: string, date: string, categories: string[]): BlogPost {
  return {
    slug,
    content: "",
    frontmatter: { title: slug, date, excerpt: "", categories },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(mdxLib, "getMdxSlugs").mockReturnValue([]);
  jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([]);
});

describe("getAllBlogPosts", () => {
  it("returns posts sorted newest first", () => {
    jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([
      makePost("old", "2023-01-01", []),
      makePost("new", "2024-06-01", []),
      makePost("mid", "2023-12-01", []),
    ] as any);

    const posts = getAllBlogPosts();
    expect(posts.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });
});

describe("getAllCategories", () => {
  it("returns a sorted, deduplicated list of categories", () => {
    jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([
      makePost("a", "2024-01-01", ["Tech", "Language"]),
      makePost("b", "2024-02-01", ["Tech", "Product"]),
    ] as any);

    expect(getAllCategories()).toEqual(["Language", "Product", "Tech"]);
  });

  it("returns empty array when there are no posts", () => {
    expect(getAllCategories()).toEqual([]);
  });
});

describe("getBlogPostsByCategory", () => {
  it("returns only posts matching the given category", () => {
    jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([
      makePost("a", "2024-01-01", ["Tech"]),
      makePost("b", "2024-02-01", ["Language"]),
      makePost("c", "2024-03-01", ["Tech", "Infra"]),
    ] as any);

    const result = getBlogPostsByCategory("Tech");
    expect(result.map((p) => p.slug)).toEqual(["c", "a"]);
  });

  it("returns empty array when no posts match", () => {
    jest.spyOn(mdxLib, "getAllMdxContent").mockReturnValue([
      makePost("a", "2024-01-01", ["Tech"]),
    ] as any);

    expect(getBlogPostsByCategory("Language")).toEqual([]);
  });
});
