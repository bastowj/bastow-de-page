import Image from "next/image";
import { getPixelfedPosts, type PixelfedPost } from "@/lib/pixelfed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images",
  description: "Photos from my Pixelfed",
};

export default async function ImagesPage() {
  let posts: PixelfedPost[] = [];
  try {
    posts = await getPixelfedPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="main-content-wrapper">
      <h1 className="blog-h1">Images</h1>
      {posts.length === 0 ? (
        <p className="text-muted">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {posts.map((post) =>
            post.media_attachments
              .filter((m) => m.type === "image")
              .map((media) => (
                <a
                  key={media.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={media.preview_url}
                    alt={media.description ?? ""}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </a>
              )),
          )}
        </div>
      )}
    </div>
  );
}
