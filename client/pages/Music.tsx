import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import VinylRecord from "@/components/music/VinylRecord";
import TrackRow from "@/components/music/TrackRow";

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
  const [lifting, setLifting] = useState(true); // parked off record initially
  const playerRef = useRef<HTMLDivElement>(null);

  const activeTrack = tracks.find((t) => t.id === active);
  const embedUrl = activeTrack ? `https://open.spotify.com/embed/track/${activeTrack.url.split('/track/')[1]}` : "";

  const selectTrack = (id: string) => {
    // If the same track is clicked while the arm is down, keep it down
    if (!lifting && id === active) return;

    if (lifting) {
      // already parked: just select and drop onto the outer groove
      setActive(id);
      setTimeout(() => {
        setLifting(false);
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    } else {
      // currently on record: lift, switch, then drop
      setLifting(true);
      setTimeout(() => setActive(id), 150);
      setTimeout(() => {
        setLifting(false);
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 650);
    }
  };

  return (
    <div className="container py-16 max-w-6xl">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Playlist</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Music</h1>
        <p className="mt-3 text-muted-foreground">A living shelf of songs. Pick a track below.</p>
      </header>

      <section className="mt-10 rounded-2xl border bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-900/20 p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <VinylRecord url={activeTrack?.url || tracks[0].url} active={!lifting && !!active} lifting={lifting} onSelect={() => {}} />
          </div>

          <div className="space-y-2">
            {tracks.map((t) => (
              <TrackRow key={t.id} url={t.url} active={t.id === active && !lifting} onClick={() => selectTrack(t.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Spotify Player - Always visible */}
      {embedUrl && (
        <div ref={playerRef} className="mt-8 rounded-xl bg-white/70 dark:bg-white/5 p-4 ring-1 ring-slate-200/70 dark:ring-white/10 shadow-sm">
          <p className="mb-3 text-sm font-medium">Now Playing</p>
          <iframe
            key={`player-${active}`}
            title={`player-${active}`}
            src={embedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            loading="eager"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: 12, minHeight: "352px" }}
          />
        </div>
      )}
    </div>
  );
}
