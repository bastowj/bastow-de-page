import {
  getPixelfedPage,
  postsToImagePosts,
  type PixelfedPost,
} from "../pixelfed";

jest.mock("@/lib/blurhash", () => ({
  blurhashToDataURL: (hash: string) => `data:image/png;base64,${hash}`,
}));

const mockStatuses = [
  {
    id: "1",
    created_at: "2024-06-01T10:00:00Z",
    url: "https://pixelfed.de/p/jbastow/1",
    content: "A photo",
    media_attachments: [
      {
        id: "m1",
        type: "image",
        url: "https://pixelfed.de/storage/photo.jpg",
        preview_url: "https://pixelfed.de/storage/photo_thumb.jpg",
        description: "A nice photo",
      },
    ],
  },
  {
    id: "2",
    created_at: "2024-06-02T10:00:00Z",
    url: "https://pixelfed.de/p/jbastow/2",
    content: "No media",
    media_attachments: [],
  },
];

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
  delete process.env.PIXELFED_TOKEN;
});

/** A page exactly as full as the request limit, so more may follow. */
function fullPage(): PixelfedPost[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: String(i + 1),
    created_at: "2024-06-01T10:00:00Z",
    url: `https://pixelfed.de/p/jbastow/${i + 1}`,
    content: `Post ${i + 1}`,
    media_attachments: [
      {
        id: `m${i + 1}`,
        type: "image",
        url: "https://pixelfed.de/storage/photo.jpg",
        preview_url: "https://pixelfed.de/storage/photo_thumb.jpg",
        description: null,
        blurhash: null,
      },
    ],
  }));
}

describe("getPixelfedPage", () => {
  it("fetches and returns posts with media", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses,
    });

    const { posts } = await getPixelfedPage();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("1");
    expect(posts[0].media_attachments[0].description).toBe("A nice photo");
  });

  it("filters out posts without media attachments", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses,
    });

    const { posts } = await getPixelfedPage();
    expect(posts.every((p) => p.media_attachments.length > 0)).toBe(true);
  });

  it("reports no next page when the response is shorter than the limit", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses,
    });

    const { nextMaxId } = await getPixelfedPage();
    expect(nextMaxId).toBeNull();
  });

  it("reports no next page for an empty response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { posts, nextMaxId } = await getPixelfedPage();
    expect(posts).toEqual([]);
    expect(nextMaxId).toBeNull();
  });

  it("returns a cursor when the response fills the limit", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fullPage(),
    });

    const { nextMaxId } = await getPixelfedPage();
    expect(nextMaxId).toBe("24");
  });

  it("takes the cursor from the raw last status, not the filtered list", async () => {
    const page = fullPage();
    page[page.length - 1].media_attachments = [];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => page,
    });

    const { posts, nextMaxId } = await getPixelfedPage();
    expect(posts).toHaveLength(23);
    expect(nextMaxId).toBe("24");
  });

  it("passes max_id through when given", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPage("abc123");

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("max_id=abc123");
  });

  it("requests the page limit it checks against", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPage();

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("limit=24");
  });

  it("includes Authorization header when PIXELFED_TOKEN is set", async () => {
    process.env.PIXELFED_TOKEN = "test-token";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPage();

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer test-token");
  });

  it("omits Authorization header when PIXELFED_TOKEN is not set", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPage();

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers["Authorization"]).toBeUndefined();
  });

  it("throws when statuses fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 401 });
    await expect(getPixelfedPage()).rejects.toThrow("Failed to fetch Pixelfed posts");
  });
});

function makePost(
  id: string,
  attachments: Array<Partial<PixelfedPost["media_attachments"][number]>>,
): PixelfedPost {
  return {
    id,
    created_at: "2024-06-01T10:00:00Z",
    url: `https://pixelfed.de/p/jbastow/${id}`,
    content: `Post ${id}`,
    media_attachments: attachments.map((a, i) => ({
      id: `${id}-m${i}`,
      type: "image",
      url: "https://pixelfed.de/storage/photo.jpg",
      preview_url: "https://pixelfed.de/storage/photo_thumb.jpg",
      description: null,
      blurhash: null,
      ...a,
    })),
  };
}

describe("postsToImagePosts", () => {
  it("returns one entry per image attachment", () => {
    const images = postsToImagePosts([makePost("1", [{}, {}]), makePost("2", [{}])]);

    expect(images).toHaveLength(3);
    expect(images.map((i) => i.mediaId)).toEqual(["1-m0", "1-m1", "2-m0"]);
  });

  it("carries the parent post's id, url and content onto each image", () => {
    const [image] = postsToImagePosts([makePost("7", [{}])]);

    expect(image.postId).toBe("7");
    expect(image.postUrl).toBe("https://pixelfed.de/p/jbastow/7");
    expect(image.content).toBe("Post 7");
  });

  it("drops attachments that are not images", () => {
    const images = postsToImagePosts([
      makePost("1", [{ type: "video" }, { type: "image" }]),
    ]);

    expect(images).toHaveLength(1);
    expect(images[0].mediaId).toBe("1-m1");
  });

  it("derives blurDataURL from the blurhash when present", () => {
    const [image] = postsToImagePosts([makePost("1", [{ blurhash: "abc" }])]);

    expect(image.blurDataURL).toBe("data:image/png;base64,abc");
  });

  it("leaves blurDataURL null when there is no blurhash", () => {
    const [image] = postsToImagePosts([makePost("1", [{ blurhash: null }])]);

    expect(image.blurDataURL).toBeNull();
  });

  it("returns an empty array for no posts", () => {
    expect(postsToImagePosts([])).toEqual([]);
  });
});

