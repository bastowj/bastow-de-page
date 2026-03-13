const PIXELFED_INSTANCE = "https://pixelfed.de";
const PIXELFED_USERNAME = "jbastow";

export interface PixelfedMediaAttachment {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  description: string | null;
}

export interface PixelfedPost {
  id: string;
  created_at: string;
  url: string;
  content: string;
  media_attachments: PixelfedMediaAttachment[];
}

async function getAccountId(): Promise<string> {
  const res = await fetch(
    `${PIXELFED_INSTANCE}/api/v1/accounts/lookup?acct=${PIXELFED_USERNAME}`,
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) throw new Error(`Failed to look up Pixelfed account: ${res.status}`);
  const account = await res.json();
  return account.id;
}

export async function getPixelfedPosts(): Promise<PixelfedPost[]> {
  const headers: HeadersInit = {};
  if (process.env.PIXELFED_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.PIXELFED_TOKEN}`;
  }

  const accountId = await getAccountId();
  const res = await fetch(
    `${PIXELFED_INSTANCE}/api/v1/accounts/${accountId}/statuses?only_media=true&limit=24`,
    { headers, next: { revalidate: 3600 } },
  );

  if (!res.ok) throw new Error(`Failed to fetch Pixelfed posts: ${res.status}`);
  const posts: PixelfedPost[] = await res.json();
  return posts.filter((p) => p.media_attachments.length > 0);
}
