import fs from "fs";
import path from "path";
import { getMdxSlugs, getMdxContentBySlug, getAllMdxContent } from "../mdx";

jest.mock("fs");
const mockFs = fs as jest.Mocked<typeof fs>;

const DIR = "/fake/content";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getMdxSlugs", () => {
  it("returns slugs stripped of .mdx extension", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue(["foo.mdx", "bar.mdx"] as unknown as string[]);
    expect(getMdxSlugs(DIR)).toEqual(["foo", "bar"]);
  });

  it("ignores non-.mdx files", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue(["foo.mdx", "readme.md", "image.png"] as unknown as string[]);
    expect(getMdxSlugs(DIR)).toEqual(["foo"]);
  });

  it("returns empty array when directory does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(getMdxSlugs("/nonexistent")).toEqual([]);
  });
});

describe("getMdxContentBySlug", () => {
  it("parses frontmatter and content from an MDX file", () => {
    mockFs.readFileSync.mockReturnValue(
      "---\ntitle: Hello\n---\n\nBody text." as unknown as Buffer,
    );
    const result = getMdxContentBySlug<{ title: string }>(DIR, "hello");
    expect(result).toEqual({
      slug: "hello",
      frontmatter: { title: "Hello" },
      content: "\nBody text.",
    });
    expect(mockFs.readFileSync).toHaveBeenCalledWith(
      path.join(DIR, "hello.mdx"),
      "utf8",
    );
  });

  it("returns null when the file does not exist", () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(getMdxContentBySlug(DIR, "missing")).toBeNull();
  });
});

describe("getAllMdxContent", () => {
  it("returns content for all MDX files in the directory", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue(["a.mdx", "b.mdx"] as unknown as string[]);
    mockFs.readFileSync
      .mockReturnValueOnce("---\ntitle: A\n---\n\nContent A." as unknown as Buffer)
      .mockReturnValueOnce("---\ntitle: B\n---\n\nContent B." as unknown as Buffer);

    const result = getAllMdxContent<{ title: string }>(DIR);
    expect(result).toHaveLength(2);
    expect(result[0].frontmatter.title).toBe("A");
    expect(result[1].frontmatter.title).toBe("B");
  });

  it("skips files that fail to parse", () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readdirSync.mockReturnValue(["good.mdx", "bad.mdx"] as unknown as string[]);
    mockFs.readFileSync
      .mockReturnValueOnce("---\ntitle: Good\n---\n\nOK." as unknown as Buffer)
      .mockImplementationOnce(() => {
        throw new Error("unreadable");
      });

    const result = getAllMdxContent<{ title: string }>(DIR);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("good");
  });
});
