import { blurhashToDataURL } from "@/lib/blurhash";

const PIXELFED_INSTANCE = "https://pixelfed.de";
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

/**
 * The id to pass as `maxId` to fetch the page after these posts.
 *
 * @param posts - The current page of statuses
 * @returns The last status id, or null if there is no further page
 */
export function nextMaxId(posts: PixelfedPost[]): string | null {
  return posts.length > 0 ? posts[posts.length - 1].id : null;
}

export async function getPixelfedPosts(maxId?: string): Promise<PixelfedPost[]> {
  const headers: HeadersInit = {};
  if (process.env.PIXELFED_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.PIXELFED_TOKEN}`;
  }

  const params = new URLSearchParams({ only_media: "true", limit: "24" });
  if (maxId) params.set("max_id", maxId);

  const res = await fetch(
    `${PIXELFED_INSTANCE}/api/v1/accounts/${PIXELFED_ACCOUNT_ID}/statuses?${params}`,
    { headers, next: { revalidate: 900 } },
  );

  if (!res.ok) throw new Error(`Failed to fetch Pixelfed posts: ${res.status}`);
  const posts: PixelfedPost[] = await res.json();
  return posts.filter((p) => p.media_attachments.length > 0);
}

// Keep for reference
export { PIXELFED_USERNAME };
