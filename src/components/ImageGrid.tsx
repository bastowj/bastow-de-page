"use client";

import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import type { ImagePost } from "@/app/api/images/route";

interface ImageGridProps {
  initialImages: ImagePost[];
  initialNextMaxId: string | null;
}

export function ImageGrid({ initialImages, initialNextMaxId }: ImageGridProps) {
  const [images, setImages] = useState<ImagePost[]>(initialImages);
  const [nextMaxId, setNextMaxId] = useState<string | null>(initialNextMaxId);
  const [loading, setLoading] = useState(false);
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
        {images.map((img) => (
          <a
            key={img.mediaId}
            href={img.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="image-card"
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
          </a>
        ))}
      </div>
      <div ref={sentinelRef} className="image-grid-sentinel">
        {loading && <p className="text-muted">Loading…</p>}
      </div>
    </>
  );
}
