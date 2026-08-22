import React from "react";
import { render, screen } from "@testing-library/react";
import { CategoryList } from "../CategoryList";

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

describe("CategoryList", () => {
  it("uses a second-level heading below the page heading", () => {
    render(<CategoryList categories={["Tech"]} />);

    expect(
      screen.getByRole("heading", { name: "Categories", level: 2 }),
    ).toBeInTheDocument();
  });
});
