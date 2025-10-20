import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VinylRecord from "@/components/music/VinylRecord";

type Item = {
  id: string;
  type: string;
  ref: string;
  embedUrl: string;
  addedAt: string;
  note: string;
};
const STORAGE_KEY = "spotifyEmbeds";

function parseSpotifyUrl(input: string): Item | null {
  const trimmed = input.trim();
  const colon = trimmed.match(
    /^spotify:(track|album|playlist|episode|show):([A-Za-z0-9]+)$/,
  );
  const web = trimmed.match(
    /open\.spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
  );
  const embed = trimmed.match(
    /open\.spotify\.com\/embed\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
  );
  const m = colon || web || embed;
  if (!m) return null;
  const type = m[1];
  const id = m[2];
  const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
  return {
    id: crypto.randomUUID(),
    type,
    ref: `${type}:${id}`,
    embedUrl,
    addedAt: new Date().toISOString(),
    note: "",
  };
}

export default function Music() {
  const tracks = [
    { id: "curated1", url: "https://open.spotify.com/track/7qjZnBKE73H4Oxkopwulqe" },
    { id: "curated2", url: "https://open.spotify.com/track/5eO04wLeM487N9qhPHPPoB" },
    { id: "curated3", url: "https://open.spotify.com/track/3aQ9MHkMeL7Yu7jpyF62xn" },
  ];
  const [active, setActive] = useState<string | null>(tracks[0]?.id ?? null);

  const activeTrack = tracks.find((t) => t.id === active);
  const embedUrl = activeTrack ? `https://open.spotify.com/embed/track/${activeTrack.url.split('/track/')[1]}` : "";

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Playlist</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Music</h1>
        <p className="mt-3 text-muted-foreground">A living shelf of songs. Click a record to play.</p>
      </header>

      <section className="mt-10 rounded-2xl border bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-900/20 p-6 md:p-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <VinylRecord key={t.id} url={t.url} active={active === t.id} onSelect={() => setActive(t.id)} />
          ))}
        </div>

        {/* Player */}
        {embedUrl && (
          <div className="mt-10 rounded-xl bg-white/70 dark:bg-white/5 p-3 ring-1 ring-slate-200/70 dark:ring-white/10 shadow-sm">
            <iframe
              title={`player-${active}`}
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        )}
      </section>
    </div>
  );
}
