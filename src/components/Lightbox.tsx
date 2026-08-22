"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImagePost } from "@/lib/pixelfed";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";

interface LightboxProps {
  images: ImagePost[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const img = images[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    closeButtonRef.current?.focus();

    return () => previouslyFocused?.focus();
  }, []);

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

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focusIsOutside = !dialogRef.current?.contains(document.activeElement);

    if (e.shiftKey && (document.activeElement === first || focusIsOutside)) {
      e.preventDefault();
      last.focus();
    } else if (
      !e.shiftKey &&
      (document.activeElement === last || focusIsOutside)
    ) {
      e.preventDefault();
      first.focus();
    }
  };

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

    if (
      Math.abs(delta) > 50 &&
      !(delta > 0 && atStart) &&
      !(delta < 0 && atEnd)
    ) {
      const direction = delta < 0 ? -1 : 1;
      const targetIndex = index + (direction < 0 ? 1 : -1);
      setIncomingIndex(targetIndex);
      setTransitioning(true);
      setOffset(direction * window.innerWidth);
      setTimeout(() => {
        if (direction < 0) onNext();
        else onPrev();
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
    <div
      ref={dialogRef}
      className="lightbox-backdrop"
      onClick={onClose}
      onKeyDown={handleDialogKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer, image ${index + 1} of ${images.length}`}
    >
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          ref={closeButtonRef}
          className="lightbox-close nav-button"
          onClick={onClose}
          aria-label="Close"
        >
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

        <div
          className="lightbox-img-wrapper"
          style={{
            transform: `translateX(${offset}px)`,
            transition: transitioning ? "transform 200ms ease" : "none",
            backgroundImage: incomingImg?.blurDataURL
              ? `url(${incomingImg.blurDataURL})`
              : img.blurDataURL
                ? `url(${img.blurDataURL})`
                : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Image
            src={img.preview_url}
            alt={img.description ?? img.content ?? ""}
            fill
            className="lightbox-img"
            {...(img.blurDataURL
              ? { placeholder: "blur", blurDataURL: img.blurDataURL }
              : {})}
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
              View on Pixelfed
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
              View on Pixelfed
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
