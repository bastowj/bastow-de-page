import { categorySlug, formatDate, isValidSlug } from "../utils";

describe("formatDate", () => {
  it("formats a date string to a human-readable format", () => {
    expect(formatDate("2024-06-01")).toBe("June 1, 2024");
  });

  it("formats a date at the start of the year", () => {
    expect(formatDate("2023-01-15")).toBe("January 15, 2023");
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase letters", () => {
    expect(isValidSlug("hello")).toBe(true);
  });

  it("accepts hyphens and underscores", () => {
    expect(isValidSlug("hello-world_foo")).toBe(true);
  });

  it("accepts alphanumeric characters", () => {
    expect(isValidSlug("post123")).toBe(true);
  });

  it("rejects strings containing a colon", () => {
    expect(isValidSlug("hello:world")).toBe(false);
  });

  it("rejects strings with spaces", () => {
    expect(isValidSlug("hello world")).toBe(false);
  });

  it("rejects strings with special characters", () => {
    expect(isValidSlug("hello/world")).toBe(false);
    expect(isValidSlug("hello.world")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });
});

describe("categorySlug", () => {
  it("leaves an already-safe name unchanged", () => {
    expect(categorySlug("linux")).toBe("linux");
    expect(categorySlug("cryptsetup")).toBe("cryptsetup");
  });

  it("lowercases", () => {
    expect(categorySlug("Tech")).toBe("tech");
  });

  it("replaces spaces with a single hyphen", () => {
    expect(categorySlug("web dev")).toBe("web-dev");
    expect(categorySlug("a   b")).toBe("a-b");
  });

  it("transliterates German umlauts and eszett", () => {
    expect(categorySlug("münchen")).toBe("muenchen");
    expect(categorySlug("Größe")).toBe("groesse");
  });

  it("strips other diacritics", () => {
    expect(categorySlug("café")).toBe("cafe");
  });

  it("collapses punctuation and trims leading and trailing hyphens", () => {
    expect(categorySlug("c++")).toBe("c");
    expect(categorySlug("100% pure")).toBe("100-pure");
    expect(categorySlug("--edge--")).toBe("edge");
  });

  it("returns a slug containing only lowercase alphanumerics and hyphens", () => {
    for (const name of ["web dev", "c++", "münchen", "100% pure", "Größe"]) {
      expect(categorySlug(name)).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("returns an empty string when nothing URL-safe remains", () => {
    expect(categorySlug("+++")).toBe("");
    expect(categorySlug("")).toBe("");
  });

  it("is idempotent", () => {
    for (const name of ["web dev", "c++", "münchen", "100% pure"]) {
      const once = categorySlug(name);
      expect(categorySlug(once)).toBe(once);
    }
  });
});
