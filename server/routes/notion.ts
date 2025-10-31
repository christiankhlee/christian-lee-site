import type { Request, Response } from "express";

export async function handleNotionPosts(_req: Request, res: Response) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    return res.status(200).json({ results: [] });
  }
  try {
    const queryBody = {
      filter: {
        and: [{ property: "Published", checkbox: { equals: true } }],
      },
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 20,
    } as any;
    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryBody),
      },
    );
    if (!queryRes.ok) {
      const txt = await queryRes.text();
      return res.status(200).json({ results: [], error: txt });
    }
    const data = await queryRes.json();
    const results = (data.results || []).map((p: any) => {
      const title = p.properties?.Title?.title?.[0]?.plain_text ?? "Untitled";
      const date = p.properties?.Date?.date?.start ?? p.created_time;
      const excerpt = p.properties?.Excerpt?.rich_text?.[0]?.plain_text ?? "";
      const slug = p.properties?.Slug?.rich_text?.[0]?.plain_text ?? "";
      return {
        id: p.id,
        title,
        content: excerpt,
        date,
        slug,
      };
    });
    res.json({ results });
  } catch (err: any) {
    res.status(200).json({ results: [], error: err?.message || String(err) });
  }
}
