import { getPixelfedPosts } from "@/lib/pixelfed";
import { blurhashToDataURL } from "@/lib/blurhash";
import { ImageGrid } from "@/components/ImageGrid";
import type { ImagePost } from "@/app/api/images/route";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images",
  description: "Photos from my Pixelfed",
};

const PIXELFED_PROFILE = "https://pixelfed.de/jbastow";

export default async function ImagesPage() {
  let initialImages: ImagePost[] = [];
  let initialNextMaxId: string | null = null;

  try {
    const posts = await getPixelfedPosts();
    initialImages = posts.flatMap((post) =>
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
    if (posts.length > 0) {
      initialNextMaxId = posts[posts.length - 1].id;
    }
  } catch {
    initialImages = [];
  }

  return (
    <div className="main-content-wrapper">
      <div className="images-page-header">
        <h1 className="blog-h1">Images</h1>
        <a href={PIXELFED_PROFILE} target="_blank" rel="noopener noreferrer" className="link images-profile-link">
          Follow on Pixelfed
        </a>
      </div>
      {initialImages.length === 0 ? (
        <p className="text-muted">No images yet.</p>
      ) : (
        <ImageGrid initialImages={initialImages} initialNextMaxId={initialNextMaxId} />
      )}
    </div>
  );
}
