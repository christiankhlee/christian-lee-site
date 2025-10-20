export type Post = { id: string; title: string; content: string; date: string };

export async function fetchBuilderPosts(limit = 10): Promise<Post[]> {
  const apiKey = import.meta.env.VITE_BUILDER_PUBLIC_API_KEY;
  if (!apiKey) return [];
  const url = `https://cdn.builder.io/api/v3/content/post?apiKey=${apiKey}&limit=${limit}&includeUnpublished=false&fields=title,data,createdDate,query,variationId`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    const items = (json?.results || []) as any[];
    return items.map((it) => ({
      id: it.id || it.variationId || crypto.randomUUID(),
      title: it.data?.title || it.name || "Untitled",
      content: it.data?.body || "",
      date: new Date(it.firstPublished || it.createdDate || Date.now()).toISOString(),
    }));
  } catch {
    return [];
  }
}
