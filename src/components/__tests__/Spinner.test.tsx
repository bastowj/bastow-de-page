import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../Spinner";

jest.mock("@heroicons/react/24/outline", () => ({
  ArrowPathIcon: ({
    className,
    "aria-hidden": ariaHidden,
  }: {
    className: string;
    "aria-hidden": boolean | "true" | "false";
  }) => (
    <svg
      data-testid="arrow-path-icon"
      className={className}
      aria-hidden={ariaHidden}
    />
  ),
}));

describe("Spinner", () => {
  it("renders with default size class", () => {
    render(<Spinner />);
    const icon = screen.getByTestId("arrow-path-icon");
    expect(icon).toHaveClass("w-6", "h-6", "animate-spin");
  });

  it("accepts a custom className", () => {
    render(<Spinner className="w-4 h-4" />);
    const icon = screen.getByTestId("arrow-path-icon");
    expect(icon).toHaveClass("w-4", "h-4", "animate-spin");
  });

  it("announces loading as a live status", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Loading");
    expect(screen.getByTestId("arrow-path-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
