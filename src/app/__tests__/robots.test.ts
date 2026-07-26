import robots from "../robots";
import { SITE_CONFIG } from "@/constants/config";

function disallowedPaths(): string[] {
  const { rules } = robots();
  const groups = Array.isArray(rules) ? rules : [rules];
  return groups.flatMap((r) => {
    const d = r.disallow ?? [];
    return Array.isArray(d) ? d : [d];
  });
}

describe("robots", () => {
  it("disallows the API routes", () => {
    expect(disallowedPaths()).toContain("/api/");
  });

  it("does not block /_next/, which holds render-critical CSS and JS", () => {
    expect(disallowedPaths()).not.toContain("/_next/");
    expect(disallowedPaths().some((p) => p.startsWith("/_next"))).toBe(false);
  });

  it("does not block /public/, which is not a served path", () => {
    expect(disallowedPaths()).not.toContain("/public/");
  });

  it("points at the sitemap on the canonical host", () => {
    expect(robots().sitemap).toBe(`${SITE_CONFIG.baseUrl}/sitemap.xml`);
  });

  it("uses a single wildcard group", () => {
    const { rules } = robots();
    const groups = Array.isArray(rules) ? rules : [rules];
    expect(groups).toHaveLength(1);
    expect(groups[0].userAgent).toBe("*");
  });
});
