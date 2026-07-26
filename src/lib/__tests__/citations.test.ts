import { getRandomCitation } from "../citations";
import { Citations } from "@/constants/citations";

describe("getRandomCitation", () => {
  it("returns a citation from the list", () => {
    const result = getRandomCitation();
    expect(Citations).toContainEqual(result);
  });

  it("returns an object with text", () => {
    const result = getRandomCitation();
    expect(typeof result.text).toBe("string");
    expect(result.text.length).toBeGreaterThan(0);
  });

  // Indexing is asserted against Math.random directly rather than by sampling,
  // so these hold whatever the list currently contains.
  it("returns the first citation at the bottom of the range", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(getRandomCitation()).toEqual(Citations[0]);
  });

  it("returns the last citation at the top of the range", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(getRandomCitation()).toEqual(Citations[Citations.length - 1]);
  });

  it("never indexes past the end of the list", () => {
    for (const r of [0, 0.25, 0.5, 0.75, 0.999999]) {
      jest.spyOn(Math, "random").mockReturnValue(r);
      expect(getRandomCitation()).toBeDefined();
    }
  });

  it("reaches every citation across the range", () => {
    const seen = new Set<string>();
    for (let i = 0; i < Citations.length; i++) {
      jest.spyOn(Math, "random").mockReturnValue(i / Citations.length);
      seen.add(getRandomCitation().text);
    }
    expect(seen.size).toBe(Citations.length);
  });
});
