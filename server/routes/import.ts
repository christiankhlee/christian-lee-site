import type { Request, Response } from "express";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function handleImportBuilder(_req: Request, res: Response) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const builderKey = process.env.BUILDER_PUBLIC_API_KEY || process.env.VITE_BUILDER_PUBLIC_API_KEY;

  if (!notionToken || !databaseId || !builderKey) {
    return res.status(200).json({ imported: 0, error: "Missing NOTION_TOKEN / NOTION_DATABASE_ID / BUILDER_PUBLIC_API_KEY" });
  }

  try {
    // 1) Fetch posts from Builder
    const builderRes = await fetch(
      `https://cdn.builder.io/api/v3/content/post?apiKey=${builderKey}&limit=50&includeUnpublished=false&fields=title,data,createdDate,name,id`
    );
    const builderJson = await builderRes.json();
    const posts = (builderJson.results || []).map((it: any) => ({
      id: it.id,
      title: it.data?.title || it.name || "Untitled",
      body: it.data?.body || "",
      date: new Date(it.createdDate || Date.now()).toISOString(),
      slug: slugify(it.data?.title || it.name || `post-${it.id}`),
    }));

    // 2) Read existing Notion pages (first 100)
    const existingRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100 }),
    });
    const existingJson = await existingRes.json();
    const existing = new Set<string>(
      (existingJson.results || []).map((p: any) => p.properties?.Slug?.rich_text?.[0]?.plain_text || p.properties?.Title?.title?.[0]?.plain_text)
    );

    // 3) Create missing pages
    let created = 0;
    for (const p of posts) {
      const key = p.slug || p.title;
      if (existing.has(key)) continue;
      const createRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionToken}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            Title: { title: [{ text: { content: p.title } }] },
            Slug: { rich_text: [{ text: { content: p.slug } }] },
            Published: { checkbox: true },
            Excerpt: { rich_text: [{ text: { content: p.body?.slice(0, 180) || "" } }] },
            Date: { date: { start: p.date } },
          },
        }),
      });
      if (createRes.ok) created++;
    }

    return res.json({ imported: created });
  } catch (e: any) {
    return res.status(200).json({ imported: 0, error: e?.message || String(e) });
  }
}
