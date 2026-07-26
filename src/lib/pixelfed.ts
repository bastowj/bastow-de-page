import { blurhashToDataURL } from "@/lib/blurhash";

const PIXELFED_INSTANCE = "https://pixelfed.de";
const PAGE_LIMIT = 24;
const PIXELFED_USERNAME = "jbastow";
const PIXELFED_ACCOUNT_ID = "938013709751862754";

export interface PixelfedMediaAttachment {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  description: string | null;
  blurhash: string | null;
}

export interface PixelfedPost {
  id: string;
  created_at: string;
  url: string;
  content: string;
  media_attachments: PixelfedMediaAttachment[];
}

export interface ImagePost {
  postId: string;
  postUrl: string;
  content: string;
  mediaId: string;
  preview_url: string;
  description: string | null;
  blurDataURL: string | null;
}

/**
 * Flatten Pixelfed statuses into one entry per image attachment.
 *
 * @param posts - The statuses to flatten
 * @returns One ImagePost per image attachment, in status order
 */
export function postsToImagePosts(posts: PixelfedPost[]): ImagePost[] {
  return posts.flatMap((post) =>
    post.media_attachments
      .filter((m) => m.type === "image")
      .map((media) => ({
        postId: post.id,
        postUrl: post.url,
        content: post.content,
        mediaId: media.id,
        preview_url: media.preview_url,
        description: media.description,
        blurDataURL: media.blurhash ? blurhashToDataURL(media.blurhash) : null,
      })),
  );
}

export interface PixelfedPage {
  /** Statuses on this page that actually carry media. */
  posts: PixelfedPost[];
  /** `maxId` for the next page, or null when this is the last one. */
  nextMaxId: string | null;
}

/**
 * Fetch one page of media statuses.
 *
 * @param maxId - Return statuses older than this id
 * @returns The page's media-bearing statuses and the cursor for the next page
 */
export async function getPixelfedPage(maxId?: string): Promise<PixelfedPage> {
  const headers: HeadersInit = {};
  if (process.env.PIXELFED_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.PIXELFED_TOKEN}`;
  }

  const params = new URLSearchParams({
    only_media: "true",
    limit: String(PAGE_LIMIT),
  });
  if (maxId) params.set("max_id", maxId);

  const res = await fetch(
    `${PIXELFED_INSTANCE}/api/v1/accounts/${PIXELFED_ACCOUNT_ID}/statuses?${params}`,
    { headers, next: { revalidate: 900 } },
  );

  if (!res.ok) throw new Error(`Failed to fetch Pixelfed posts: ${res.status}`);
  const statuses: PixelfedPage["posts"] = await res.json();

  // Pixelfed sends no Link rel="next" header, so a full page is the only
  // available signal that more may follow. The cursor comes from the raw last
  // status rather than the filtered list, so statuses without media still
  // advance it instead of being re-fetched forever.
  const isFullPage = statuses.length === PAGE_LIMIT;

  return {
    posts: statuses.filter((p) => p.media_attachments.length > 0),
    nextMaxId: isFullPage ? statuses[statuses.length - 1].id : null,
  };
}

// Keep for reference
export { PIXELFED_USERNAME };
