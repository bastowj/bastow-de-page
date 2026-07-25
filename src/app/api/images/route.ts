import {
  getPixelfedPosts,
  nextMaxId,
  postsToImagePosts,
} from "@/lib/pixelfed";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const maxId = req.nextUrl.searchParams.get("maxId") ?? undefined;
  try {
    const posts = await getPixelfedPosts(maxId);
    return Response.json({
      images: postsToImagePosts(posts),
      nextMaxId: nextMaxId(posts),
    });
  } catch {
    return Response.json({ images: [], nextMaxId: null }, { status: 500 });
  }
}
