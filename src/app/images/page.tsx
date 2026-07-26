import {
  getPixelfedPage,
  postsToImagePosts,
  type ImagePost,
} from "@/lib/pixelfed";
import { ImageGrid } from "@/components/ImageGrid";
import { PIXELFED_PROFILE } from "@/constants/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images",
  description: "Images from my Pixelfed",
};

export default async function ImagesPage() {
  let initialImages: ImagePost[] = [];
  let initialNextMaxId: string | null = null;

  try {
    const page = await getPixelfedPage();
    initialImages = postsToImagePosts(page.posts);
    initialNextMaxId = page.nextMaxId;
  } catch {
    initialImages = [];
  }

  return (
    <div className="main-content-wrapper">
      <div className="images-page-header">
        <h1 className="blog-h1">Images</h1>
        <a href={PIXELFED_PROFILE} target="_blank" rel="noopener noreferrer" className="link images-profile-link">
          View on Pixelfed
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
