import {
  getPixelfedPosts,
  nextMaxId,
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

describe("nextMaxId", () => {
  it("returns the last post's id", () => {
    expect(nextMaxId([makePost("1", []), makePost("2", [])])).toBe("2");
  });

  it("returns null when there are no posts", () => {
    expect(nextMaxId([])).toBeNull();
  });
});
