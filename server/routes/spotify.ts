import type { Request, Response } from "express";

export async function handleSpotifyOEmbed(req: Request, res: Response) {
  const url = String(req.query.url || "");
  if (!url || !/^https:\/\/open\.spotify\.com\//.test(url)) {
    return res.status(400).json({ error: "Invalid Spotify URL" });
  }
  try {
    const target = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    const r = await fetch(target, { headers: { Accept: "application/json" } });
    if (!r.ok) {
      return res.status(502).json({ error: `Upstream error ${r.status}` });
    }
    const json = await r.json();
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.json(json);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "fetch failed" });
  }
}
