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

  it("returns different citations over multiple calls when more than one exists", () => {
    if (Citations.length > 1) {
      const results = new Set(
        Array.from({ length: 50 }, () => getRandomCitation().text),
      );
      expect(results.size).toBeGreaterThan(1);
    } else {
      const result = getRandomCitation();
      expect(result).toEqual(Citations[0]);
    }
  });
});
