"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [offset, setOffset] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);

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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setOffset(e.touches[0].clientX - touchStartX.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    const atStart = index === 0;
    const atEnd = index === images.length - 1;

    if (Math.abs(delta) > 50 && !(delta > 0 && atStart) && !(delta < 0 && atEnd)) {
      const direction = delta < 0 ? -1 : 1;
      const targetIndex = index + (direction < 0 ? 1 : -1);
      setIncomingIndex(targetIndex);
      setTransitioning(true);
      setOffset(direction * window.innerWidth);
      setTimeout(() => {
        if (direction < 0) onNext(); else onPrev();
        setTransitioning(false);
        setOffset(0);
        setIncomingIndex(null);
      }, 200);
    } else {
      setTransitioning(true);
      setOffset(0);
      setTimeout(() => setTransitioning(false), 200);
    }
  };

  const incomingImg = incomingIndex !== null ? images[incomingIndex] : null;

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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

        {/* Incoming image placeholder shown behind the outgoing image */}
        {incomingImg?.blurDataURL && (
          <div
            className="lightbox-img-wrapper"
            style={{
              position: "absolute",
              backgroundImage: `url(${incomingImg.blurDataURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        <div
          className="lightbox-img-wrapper"
          style={{
            transform: `translateX(${offset}px)`,
            transition: transitioning ? "transform 200ms ease" : "none",
          }}
        >
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
