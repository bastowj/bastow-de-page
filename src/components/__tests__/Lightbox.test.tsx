import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Lightbox } from "../Lightbox";
import type { ImagePost } from "@/lib/pixelfed";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/lib/icons", () => ({
  XMarkIcon: () => <svg data-testid="x-icon" />,
  ChevronLeftIcon: () => <svg data-testid="chevron-left" />,
  ChevronRightIcon: () => <svg data-testid="chevron-right" />,
}));

const makeImage = (i: number): ImagePost => ({
  postId: `post-${i}`,
  postUrl: `https://pixelfed.de/p/jbastow/${i}`,
  content: `Caption ${i}`,
  mediaId: `media-${i}`,
  preview_url: `https://pixelfed.de/storage/photo-${i}.jpg`,
  description: `Alt text ${i}`,
  blurDataURL: null,
});

const images = [makeImage(1), makeImage(2), makeImage(3)];
const noop = jest.fn();

describe("Lightbox", () => {
  beforeEach(() => noop.mockClear());

  it("renders the current image and caption", () => {
    render(
      <Lightbox
        images={images}
        index={0}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );
    expect(screen.getByAltText("Alt text 1")).toBeInTheDocument();
    expect(screen.getByText("Alt text 1")).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", {
        name: "Image viewer, image 1 of 3",
      }),
    ).toBeInTheDocument();
  });

  it("moves focus into the dialog and restores it on unmount", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(
      <Lightbox
        images={images}
        index={0}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );

    expect(screen.getByLabelText("Close")).toHaveFocus();
    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it("traps Tab focus within the dialog", () => {
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );

    const closeButton = screen.getByLabelText("Close");
    const lastLink = screen.getByRole("link", { name: /view on pixelfed/i });

    lastLink.focus();
    fireEvent.keyDown(lastLink, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(closeButton, { key: "Tab", shiftKey: true });
    expect(lastLink).toHaveFocus();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <Lightbox
        images={images}
        index={0}
        onClose={onClose}
        onPrev={noop}
        onNext={noop}
      />,
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = jest.fn();
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={onClose}
        onPrev={noop}
        onNext={noop}
      />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onPrev when ArrowLeft is pressed", () => {
    const onPrev = jest.fn();
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={noop}
        onPrev={onPrev}
        onNext={noop}
      />,
    );
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when ArrowRight is pressed", () => {
    const onNext = jest.fn();
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={noop}
        onPrev={noop}
        onNext={onNext}
      />,
    );
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("calls onPrev when prev button is clicked", () => {
    const onPrev = jest.fn();
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={noop}
        onPrev={onPrev}
        onNext={noop}
      />,
    );
    fireEvent.click(screen.getByLabelText("Previous image"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = jest.fn();
    render(
      <Lightbox
        images={images}
        index={1}
        onClose={noop}
        onPrev={noop}
        onNext={onNext}
      />,
    );
    fireEvent.click(screen.getByLabelText("Next image"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("changes images without a delayed transition when motion is reduced", () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });
    const onNext = jest.fn();

    try {
      render(
        <Lightbox
          images={images}
          index={1}
          onClose={noop}
          onPrev={noop}
          onNext={onNext}
        />,
      );
      const content = screen
        .getByRole("dialog")
        .querySelector(".lightbox-content");
      expect(content).not.toBeNull();

      fireEvent.touchStart(content!, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(content!, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(content!, { changedTouches: [{ clientX: 100 }] });

      expect(onNext).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("disables prev button on first image", () => {
    render(
      <Lightbox
        images={images}
        index={0}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );
    expect(screen.getByLabelText("Previous image")).toBeDisabled();
  });

  it("disables next button on last image", () => {
    render(
      <Lightbox
        images={images}
        index={images.length - 1}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );
    expect(screen.getByLabelText("Next image")).toBeDisabled();
  });

  it("renders View on Pixelfed link", () => {
    render(
      <Lightbox
        images={images}
        index={0}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );
    const link = screen.getByRole("link", { name: /view on pixelfed/i });
    expect(link).toHaveAttribute("href", images[0].postUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("closes when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(
      <Lightbox
        images={images}
        index={0}
        onClose={onClose}
        onPrev={noop}
        onNext={noop}
      />,
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("restores body overflow on unmount", () => {
    const { unmount } = render(
      <Lightbox
        images={images}
        index={0}
        onClose={noop}
        onPrev={noop}
        onNext={noop}
      />,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
