import nextConfigExport from "../../../next.config";

type Header = { key: string; value: string };

async function getCsp(): Promise<string> {
  const nextConfig = await nextConfigExport;
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
  it("script-src does not allow 'unsafe-eval' (MDX is compiled at build time)", async () => {
    const csp = await getCsp();
    const scriptSrc = csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("script-src"));
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });
});
