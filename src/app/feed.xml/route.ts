import { getAllBlogPosts } from "@/lib/blog";
import { SITE_CONFIG } from "@/constants/config";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cdata = (s: string) =>
  `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export async function GET() {
  const posts = getAllBlogPosts();
  const baseUrl = SITE_CONFIG.baseUrl;

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${baseUrl}/texts/${encodeURIComponent(post.slug)}</link>
      <guid>${baseUrl}/texts/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${cdata(post.excerpt)}</description>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
      ${post.categories.map((c) => `<category>${escapeXml(c)}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.defaultTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
