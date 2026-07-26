import React from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { RandomCitation } from "../RandomCitation";

// The real list holds a single entry, which cannot show variation. Mock a
// multi-entry list so these assertions mean something. `@/lib/citations` reads
// the same module, so getRandomCitation picks from this list too.
jest.mock("@/constants/citations", () => ({
  Citations: [
    { text: "first" },
    { text: "second" },
    { text: "third" },
    { text: "fourth" },
  ],
}));

const texts = ["first", "second", "third", "fourth"];

afterEach(() => {
  jest.restoreAllMocks();
});

describe("RandomCitation", () => {
  it("renders a citation from the list", () => {
    render(<RandomCitation />);
    expect(texts).toContain(
      screen.getByRole("blockquote").textContent?.replaceAll('"', ""),
    );
  });

  it("picks the entry Math.random points at", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    render(<RandomCitation />);
    expect(screen.getByRole("blockquote")).toHaveTextContent("third");
  });

  it("picks the last entry at the top of the range", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.999999);
    render(<RandomCitation />);
    expect(screen.getByRole("blockquote")).toHaveTextContent("fourth");
  });

  it("swaps away from the first entry once mounted", () => {
    // 0.5 maps to "third", so a mounted render must not still show "first".
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    render(<RandomCitation />);
    expect(screen.getByRole("blockquote")).not.toHaveTextContent("first");
  });

  it("varies across independent mounts", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const { unmount } = render(<RandomCitation />);
      seen.add(screen.getByRole("blockquote").textContent ?? "");
      unmount();
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("server-renders the first entry so no-JS visitors still get a quote", () => {
    const html = renderToString(<RandomCitation />);
    expect(html).toContain("first");
  });
});
