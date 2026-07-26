import { getPixelfedPage, postsToImagePosts } from "@/lib/pixelfed";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const maxId = req.nextUrl.searchParams.get("maxId") ?? undefined;
  try {
    const { posts, nextMaxId } = await getPixelfedPage(maxId);
    return Response.json({ images: postsToImagePosts(posts), nextMaxId });
  } catch {
    return Response.json({ images: [], nextMaxId: null }, { status: 500 });
  }
}
