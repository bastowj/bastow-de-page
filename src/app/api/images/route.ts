import { getPixelfedPosts, type PixelfedPost } from "@/lib/pixelfed";
import { blurhashToDataURL } from "@/lib/blurhash";
import { NextRequest } from "next/server";

export interface ImagePost {
  postId: string;
  postUrl: string;
  content: string;
  mediaId: string;
  preview_url: string;
  description: string | null;
  blurDataURL: string | null;
}

function postsToImagePosts(posts: PixelfedPost[]): ImagePost[] {
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

export async function GET(req: NextRequest) {
  const maxId = req.nextUrl.searchParams.get("maxId") ?? undefined;
  try {
    const posts = await getPixelfedPosts(maxId);
    const images = postsToImagePosts(posts);
    const nextMaxId = posts.length > 0 ? posts[posts.length - 1].id : null;
    return Response.json({ images, nextMaxId });
  } catch {
    return Response.json({ images: [], nextMaxId: null }, { status: 500 });
  }
}

export { postsToImagePosts };
