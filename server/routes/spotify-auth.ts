import type { Request, Response } from "express";

export async function handleSpotifyToken(req: Request, res: Response) {
  const { code } = req.body;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/callback";

  if (!code || !clientId) {
    return res.status(400).json({ error: "Missing code or client ID" });
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET || "",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Spotify token error:", error);
      return res.status(400).json({ error: "Token exchange failed" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
