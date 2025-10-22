import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import VinylRecord from "@/components/music/VinylRecord";
import TrackRow from "@/components/music/TrackRow";

export type Track = {
  id: string;
  url: string;
  title: string;
};

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
    { id: "curated1", url: "https://open.spotify.com/track/7qjZnBKE73H4Oxkopwulqe", title: "back to friends" },
    { id: "curated2", url: "https://open.spotify.com/track/5eO04wLeM487N9qhPHPPoB", title: "Gift" },
    { id: "curated3", url: "https://open.spotify.com/track/3aQ9MHkMeL7Yu7jpyF62xn", title: "Neverender" },
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
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F7b49f57f8a1f40329ddc44ba62656ee3?format=webp&width=1600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="container py-16 max-w-6xl relative z-10">
        <header className="max-w-3xl">
          <p className="uppercase tracking-widest text-xs text-white/70">Playlist</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">Music</h1>
          <p className="mt-3 text-white/80 drop-shadow">A living shelf of songs. Pick a track below.</p>
        </header>

        <section className="mt-10 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
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
          <div ref={playerRef} className="mt-8 rounded-xl bg-white/10 backdrop-blur-xl p-6 ring-1 ring-white/20 shadow-2xl border border-white/20">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-white/70">Now Playing</p>
              <h2 className="mt-1 text-2xl font-bold text-white drop-shadow">{activeTrack?.title || "Select a track"}</h2>
            </div>
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
    </div>
  );
}
