import type { Request, Response } from "express";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getSpotifyToken(): Promise<string> {
  // Check if cached token is still valid
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify token");
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function handleSpotifySearch(req: Request, res: Response) {
  const query = String(req.query.q || "");

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const token = await getSpotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Spotify API error" });
    }

    const data = await response.json();
    
    // Extract relevant track data
    const tracks = data.tracks.items.map((track: any) => ({
      id: track.id,
      uri: track.uri,
      name: track.name,
      artist: track.artists[0]?.name || "Unknown",
      album: track.album?.name || "Unknown",
      imageUrl: track.album?.images?.[0]?.url || null,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls?.spotify,
    }));

    return res.json({ tracks });
  } catch (err: any) {
    console.error("Spotify search error:", err);
    return res.status(500).json({ error: err?.message || "Search failed" });
  }
}
