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

import { getStaticPageBySlug, getStaticPageSlugs } from "../pages";

beforeEach(() => {
  mockPages.length = 0;
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
    expect(page?.title).toBe("About");
    expect(page?.description).toBe("About me");
    expect(page?.body).toBe("About content");
  });

  it("returns null for a missing slug", () => {
    expect(getStaticPageBySlug("nonexistent")).toBeNull();
  });

  it("returns null when there are no pages at all", () => {
    expect(getStaticPageBySlug("about")).toBeNull();
  });

  it("leaves description undefined when the frontmatter omits it", () => {
    mockPages.push({
      slug: "contact",
      title: "Contact",
      description: undefined as unknown as string,
      body: "",
    });
    expect(getStaticPageBySlug("contact")?.description).toBeUndefined();
  });

  it("picks the matching page out of several", () => {
    mockPages.push(
      { slug: "about", title: "About", description: "", body: "a" },
      { slug: "privacy", title: "Privacy", description: "", body: "p" },
    );
    expect(getStaticPageBySlug("privacy")?.title).toBe("Privacy");
  });
});

describe("getStaticPageSlugs", () => {
  it("returns all page slugs in a stable order", () => {
    mockPages.push(
      { slug: "privacy", title: "Privacy", description: "", body: "" },
      { slug: "about", title: "About", description: "", body: "" },
    );

    expect(getStaticPageSlugs()).toEqual(["about", "privacy"]);
  });

  it("returns an empty array when there are no pages", () => {
    expect(getStaticPageSlugs()).toEqual([]);
  });
});
