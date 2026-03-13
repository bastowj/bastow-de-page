import { formatDate, isValidSlug } from "../utils";

describe("formatDate", () => {
  it("formats a date string to a human-readable format", () => {
    expect(formatDate("2024-06-01")).toBe("June 1, 2024");
  });

  it("formats a date at the start of the year", () => {
    expect(formatDate("2023-01-15")).toBe("January 15, 2023");
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase letters", () => {
    expect(isValidSlug("hello")).toBe(true);
  });

  it("accepts hyphens and underscores", () => {
    expect(isValidSlug("hello-world_foo")).toBe(true);
  });

  it("accepts alphanumeric characters", () => {
    expect(isValidSlug("post123")).toBe(true);
  });

  it("rejects strings containing a colon", () => {
    expect(isValidSlug("hello:world")).toBe(false);
  });

  it("rejects strings with spaces", () => {
    expect(isValidSlug("hello world")).toBe(false);
  });

  it("rejects strings with special characters", () => {
    expect(isValidSlug("hello/world")).toBe(false);
    expect(isValidSlug("hello.world")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });
});
