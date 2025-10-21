import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VinylRecord from "@/components/music/VinylRecord";
import TrackRow from "@/components/music/TrackRow";
import { Button } from "@/components/ui/button";

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
  const [lifting, setLifting] = useState(true);
  const [playing, setPlaying] = useState(false);

  const activeTrack = tracks.find((t) => t.id === active);
  const embedUrl = activeTrack ? `https://open.spotify.com/embed/track/${activeTrack.url.split('/track/')[1]}` : "";

  const selectTrack = (id: string) => {
    if (id === active) return;
    setLifting(true);
    setTimeout(() => {
      setActive(id);
      setLifting(false);
      setPlaying(true);
    }, 500);
  };

  const togglePlay = () => {
    if (playing) {
      // park the arm
      setLifting(true);
      setPlaying(false);
    } else {
      // drop the arm
      setLifting(false);
      setPlaying(true);
    }
  };

  const goNext = () => {
    const idx = tracks.findIndex((t) => t.id === active);
    const next = tracks[(idx + 1) % tracks.length];
    selectTrack(next.id);
  };
  const goPrev = () => {
    const idx = tracks.findIndex((t) => t.id === active);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    selectTrack(prev.id);
  };

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Playlist</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Music</h1>
        <p className="mt-3 text-muted-foreground">A living shelf of songs. Pick a track below.</p>
      </header>

      <section className="mt-10 rounded-2xl border bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-900/20 p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <VinylRecord url={activeTrack?.url || tracks[0].url} active={playing && !lifting} lifting={lifting} onSelect={togglePlay} />
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button size="icon" variant="outline" onClick={goPrev} aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6v12H5V6h2zm2 6l10 6V6L9 12z"/></svg>
              </Button>
              <Button size="icon" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </Button>
              <Button size="icon" variant="outline" onClick={goNext} aria-label="Next">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 6v12h2V6h-2zM5 18l10-6L5 6v12z"/></svg>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {tracks.map((t) => (
              <TrackRow key={t.id} url={t.url} active={t.id === active && playing && !lifting} onClick={() => selectTrack(t.id)} />
            ))}
          </div>
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
            <p className="mt-2 text-xs text-muted-foreground">Note: Spotify embed controls the actual audio. The above buttons control visuals. To sync controls and waveform with audio, we must switch to the Spotify Web Playback SDK or use audio files we can access.</p>
          </div>
        )}
      </section>
    </div>
  );
}
