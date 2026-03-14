"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ImagePost } from "@/app/api/images/route";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";

interface LightboxProps {
  images: ImagePost[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[index];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) onNext(); else onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button className="lightbox-close nav-button" onClick={onClose} aria-label="Close">
          <XMarkIcon className="nav-theme-icon" />
        </button>

        <button
          className="lightbox-prev nav-button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="nav-theme-icon" />
        </button>

        <div className="lightbox-img-wrapper">
          <Image
            src={img.preview_url}
            alt={img.description ?? img.content ?? ""}
            fill
            className="lightbox-img"
            {...(img.blurDataURL ? { placeholder: "blur", blurDataURL: img.blurDataURL } : {})}
          />
        </div>

        <button
          className="lightbox-next nav-button"
          onClick={onNext}
          disabled={index === images.length - 1}
          aria-label="Next image"
        >
          <ChevronRightIcon className="nav-theme-icon" />
        </button>

        {(img.content || img.description) && (
          <div className="lightbox-caption">
            <p>{img.description ?? img.content}</p>
            <a
              href={img.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lightbox-caption-link link"
            >
              View on Pixelfed ↗
            </a>
          </div>
        )}
        {!img.content && !img.description && (
          <div className="lightbox-caption">
            <a
              href={img.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lightbox-caption-link link"
            >
              View on Pixelfed ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
