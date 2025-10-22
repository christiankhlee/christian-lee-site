import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleNotionPosts } from "./routes/notion";
import { handleImportBuilder } from "./routes/import";
import { handleSpotifyOEmbed } from "./routes/spotify";
import { handleSpotifyToken } from "./routes/spotify-auth";
import { handleSpotifySearch } from "./routes/spotify-search";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Allow Spotify embed permissions
  app.use((req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "autoplay=(self https://open.spotify.com), encrypted-media=(self https://open.spotify.com), fullscreen=(self https://open.spotify.com), clipboard-write=(self https://open.spotify.com)"
    );
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/notion-posts", handleNotionPosts);
  app.get("/api/import-builder", (req, res) => handleImportBuilder(req, res));
  app.get("/api/spotify-oembed", (req, res) => handleSpotifyOEmbed(req, res));
  app.post("/api/spotify-token", (req, res) => handleSpotifyToken(req, res));
  app.get("/api/spotify-search", (req, res) => handleSpotifySearch(req, res));

  return app;
}
