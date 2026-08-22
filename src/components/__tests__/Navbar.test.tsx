import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "../Navbar";

const mockUsePathname = jest.fn();
const mockSetTheme = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: mockSetTheme }),
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

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt ?? ""} {...props} />
  ),
}));

jest.mock("@/lib/icons", () => ({
  SunIcon: () => <svg />,
  MoonIcon: () => <svg />,
  GlobeAltIcon: () => <svg />,
  Bars3Icon: () => <svg />,
  XMarkIcon: () => <svg />,
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/texts/example-post");
    mockSetTheme.mockClear();
  });

  it("labels the primary navigation landmark", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
  });

  it("exposes and updates the mobile menu state", () => {
    render(<Navbar />);

    const openButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(openButton).toHaveAttribute(
      "aria-controls",
      "mobile-navigation-menu",
    );

    fireEvent.click(openButton);

    const closeButton = screen.getByRole("button", {
      name: "Close navigation menu",
    });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById("mobile-navigation-menu"),
    ).toBeInTheDocument();
  });
});
