import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("marks the parent navigation item active on a nested route", () => {
    mockUsePathname.mockReturnValue("/texts/example-post");

    render(<Footer />);

    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Navigation", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Connect", level: 2 }),
    ).toBeInTheDocument();

    const textsLink = screen.getByRole("link", { name: "Texts" });
    expect(textsLink).toHaveClass("font-medium");
    expect(textsLink).toHaveAttribute("aria-current", "page");

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass("font-normal");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });
});
