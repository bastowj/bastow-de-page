import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "../Navbar";

const mockUsePathname = jest.fn();
const mockSetTheme = jest.fn();
const mockUseTheme = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
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
    mockUseTheme.mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
    });
  });

  it("labels the primary navigation landmark", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["light", "dark"],
    ["dark", "vaporwave"],
    ["vaporwave", "light"],
  ])(
    "announces and activates the theme after %s",
    (currentTheme, nextTheme) => {
      mockUseTheme.mockReturnValue({
        resolvedTheme: currentTheme,
        setTheme: mockSetTheme,
      });
      render(<Navbar />);

      const themeButtons = screen.getAllByRole("button", {
        name: `Switch to ${nextTheme} theme`,
      });
      expect(themeButtons).toHaveLength(2);

      fireEvent.click(themeButtons[0]);
      expect(mockSetTheme).toHaveBeenCalledWith(nextTheme);
    },
  );

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
