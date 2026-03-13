import { getPixelfedPosts } from "../pixelfed";

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

describe("getPixelfedPosts", () => {
  it("fetches and returns posts with media", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses,
    });

    const posts = await getPixelfedPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("1");
    expect(posts[0].media_attachments[0].description).toBe("A nice photo");
  });

  it("filters out posts without media attachments", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStatuses,
    });

    const posts = await getPixelfedPosts();
    expect(posts.every((p) => p.media_attachments.length > 0)).toBe(true);
  });

  it("includes Authorization header when PIXELFED_TOKEN is set", async () => {
    process.env.PIXELFED_TOKEN = "test-token";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPosts();

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer test-token");
  });

  it("omits Authorization header when PIXELFED_TOKEN is not set", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await getPixelfedPosts();

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.headers["Authorization"]).toBeUndefined();
  });

  it("throws when statuses fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 401 });
    await expect(getPixelfedPosts()).rejects.toThrow("Failed to fetch Pixelfed posts");
  });
});
