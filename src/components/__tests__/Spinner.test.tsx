import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../Spinner";

jest.mock("@heroicons/react/24/outline", () => ({
  ArrowPathIcon: ({ className, "aria-label": ariaLabel }: { className: string; "aria-label": string }) => (
    <svg data-testid="arrow-path-icon" className={className} aria-label={ariaLabel} />
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

  it("has an accessible label", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });
});
