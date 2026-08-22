import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { ImageGrid } from "../ImageGrid";
import type { ImagePost } from "@/lib/pixelfed";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// Lightbox renders many icons — stub it to keep tests focused
jest.mock("../Lightbox", () => ({
  Lightbox: ({ index, onClose }: { index: number; onClose: () => void }) => (
    <div data-testid="lightbox" data-index={index}>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Stub IntersectionObserver (not available in jsdom)
beforeEach(() => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
});

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

describe("ImageGrid", () => {
  it("renders all initial images", () => {
    render(<ImageGrid initialImages={images} initialNextMaxId={null} />);
    expect(screen.getAllByRole("img")).toHaveLength(images.length);
    expect(
      screen.getByRole("region", { name: "Image gallery" }),
    ).toHaveAttribute("aria-busy", "false");
  });

  it("marks the gallery busy and exposes a loading status", async () => {
    let resolveFetch!: (value: Response) => void;
    global.fetch = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(<ImageGrid initialImages={images} initialNextMaxId="post-3" />);
    const gallery = screen.getByRole("region", { name: "Image gallery" });

    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    act(() => callback([{ isIntersecting: true }]));

    await waitFor(() => expect(gallery).toHaveAttribute("aria-busy", "true"));
    expect(screen.getByRole("status")).toHaveTextContent("Loading");

    await act(async () => {
      resolveFetch({
        ok: true,
        json: async () => ({ images: [], nextMaxId: null }),
      } as Response);
    });
    await waitFor(() => expect(gallery).toHaveAttribute("aria-busy", "false"));
  });

  it("opens lightbox when an image is clicked", () => {
    render(<ImageGrid initialImages={images} initialNextMaxId={null} />);
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByTestId("lightbox")).toBeInTheDocument();
    expect(screen.getByTestId("lightbox")).toHaveAttribute("data-index", "0");
  });

  it("opens lightbox for the correct image index", () => {
    render(<ImageGrid initialImages={images} initialNextMaxId={null} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    expect(screen.getByTestId("lightbox")).toHaveAttribute("data-index", "1");
  });

  it("closes lightbox when onClose is called", () => {
    render(<ImageGrid initialImages={images} initialNextMaxId={null} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByTestId("lightbox")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
  });

  it("loads more images when sentinel intersects", async () => {
    const newImages = [makeImage(4), makeImage(5)];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: newImages, nextMaxId: null }),
    });

    render(<ImageGrid initialImages={images} initialNextMaxId="post-3" />);
    expect(screen.getAllByRole("img")).toHaveLength(images.length);

    // Trigger the intersection observer callback
    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(
        images.length + newImages.length,
      );
    });
  });

  it("does not fetch more when nextMaxId is null", () => {
    global.fetch = jest.fn();
    render(<ImageGrid initialImages={images} initialNextMaxId={null} />);
    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // Each `loading` change re-runs the effect and observes the sentinel again,
  // and re-observing an element already in view fires the callback immediately.
  // So a retry uses the newest callback, not the one captured on first render.
  const intersectNewest = () => {
    const { calls } = (global.IntersectionObserver as jest.Mock).mock;
    calls[calls.length - 1][0]([{ isIntersecting: true }]);
  };

  // Let the in-flight response and its state updates settle.
  const settle = () => act(async () => {});

  it("stops paginating after a failed response", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    render(<ImageGrid initialImages={images} initialNextMaxId="post-3" />);

    intersectNewest();
    await settle();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // The sentinel is still in view; without clearing the cursor on failure
    // this would retry forever.
    intersectNewest();
    await settle();
    intersectNewest();
    await settle();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("stops paginating after a network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline"));

    render(<ImageGrid initialImages={images} initialNextMaxId="post-3" />);

    intersectNewest();
    await settle();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    intersectNewest();
    await settle();
    intersectNewest();
    await settle();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("encodes the cursor in the request URL", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: [], nextMaxId: null }),
    });

    render(<ImageGrid initialImages={images} initialNextMaxId="a b&c" />);
    const [[callback]] = (global.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
      "/api/images?maxId=a%20b%26c",
    );
  });
});
