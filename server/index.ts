import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleNotionPosts } from "./routes/notion";
import { handleImportBuilder } from "./routes/import";
import { handleSpotifyOEmbed } from "./routes/spotify";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/notion-posts", handleNotionPosts);
  app.get("/api/import-builder", (req, res) => handleImportBuilder(req, res));
  app.get("/api/spotify-oembed", (req, res) => handleSpotifyOEmbed(req, res));

  return app;
}
