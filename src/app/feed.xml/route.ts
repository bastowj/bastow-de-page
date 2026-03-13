import { getAllBlogPosts } from "@/lib/blog";
import { SITE_CONFIG } from "@/constants/config";

export async function GET() {
  const posts = getAllBlogPosts();
  const baseUrl = SITE_CONFIG.baseUrl;

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${baseUrl}/texts/${post.slug}</link>
      <guid>${baseUrl}/texts/${post.slug}</guid>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.frontmatter.excerpt}]]></description>
      ${post.frontmatter.author ? `<author>${post.frontmatter.author}</author>` : ""}
      ${post.frontmatter.categories.map((c) => `<category>${c}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.defaultTitle}</title>
    <link>${baseUrl}</link>
    <description>${SITE_CONFIG.description}</description>
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
