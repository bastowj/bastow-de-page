import nextConfig from "../../../next.config";

type Header = { key: string; value: string };

async function getCsp(): Promise<string> {
  if (typeof nextConfig.headers !== "function") {
    throw new Error("next.config headers() function missing");
  }
  const groups = await nextConfig.headers();
  const headers = groups[0].headers as Header[];
  const csp = headers.find((h) => h.key === "Content-Security-Policy");
  if (!csp) throw new Error("Content-Security-Policy header missing");
  return csp.value;
}

describe("next.config CSP", () => {
  // Regression: next-mdx-remote's <MDXRemote> compiles MDX on the client via
  // `new Function(...)`. If 'unsafe-eval' is removed from script-src, every
  // blog post body renders as an empty <div>.
  it("script-src allows 'unsafe-eval' so MDX content can render on the client", async () => {
    const csp = await getCsp();
    const scriptSrc = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("script-src"));
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).toContain("'unsafe-eval'");
  });
});
