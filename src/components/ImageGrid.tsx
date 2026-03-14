"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import type { ImagePost } from "@/app/api/images/route";
import { Lightbox } from "@/components/Lightbox";
import { Spinner } from "@/components/Spinner";

interface ImageGridProps {
  initialImages: ImagePost[];
  initialNextMaxId: string | null;
}

export function ImageGrid({ initialImages, initialNextMaxId }: ImageGridProps) {
  const [images, setImages] = useState<ImagePost[]>(initialImages);
  const [nextMaxId, setNextMaxId] = useState<string | null>(initialNextMaxId);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!nextMaxId || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/images?maxId=${nextMaxId}`);
      if (!res.ok) return;
      const data = await res.json();
      setImages((prev) => [...prev, ...data.images]);
      setNextMaxId(data.nextMaxId);
    } finally {
      setLoading(false);
    }
  }, [nextMaxId, loading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="image-grid">
        {images.map((img, i) => (
          <button
            key={img.mediaId}
            className="image-card"
            onClick={() => setLightboxIndex(i)}
            aria-label={img.description ?? img.content ?? "Open image"}
          >
            <Image
              src={img.preview_url}
              alt={img.description ?? img.content ?? ""}
              width={300}
              height={300}
              className="image-card-img"
              {...(img.blurDataURL ? { placeholder: "blur", blurDataURL: img.blurDataURL } : {})}
            />
            {img.content && <span className="image-card-caption">{img.content}</span>}
          </button>
        ))}
      </div>
      <div ref={sentinelRef} className="image-grid-sentinel">
        {loading && <Spinner />}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(images.length - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  );
}
