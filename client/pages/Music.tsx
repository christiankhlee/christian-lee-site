import { useState, useEffect, useRef } from "react";
import Turntable from "@/components/music/Turntable";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const embedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Search for "Undressed" by Sombr
    const searchTrack = async () => {
      try {
        const response = await fetch(
          `/api/spotify-search?q=${encodeURIComponent("Undressed Sombr")}`
        );
        const data = await response.json();

        if (data.tracks && data.tracks.length > 0) {
          setTrack(data.tracks[0]);
        }
      } catch (error) {
        console.error("Failed to search track:", error);
      } finally {
        setLoading(false);
      }
    };

    searchTrack();
  }, []);

  const handlePlayToggle = () => {
    setPlaying(!playing);
  };

  const trackId = track?.uri.split(":").pop();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F7b49f57f8a1f40329ddc44ba62656ee3?format=webp&width=1600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto py-20 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <header className="text-center mb-12">
          <p className="uppercase tracking-widest text-xs text-white/70 mb-2">Playlist</p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">Music</h1>
        </header>

        {/* Turntable */}
        <Turntable 
          spinning={playing} 
          armDown={playing} 
          onPlay={handlePlayToggle}
        />

        {/* Spotify Embed */}
        {!loading && track && trackId && (
          <div
            ref={embedContainerRef}
            className="mt-12 w-full max-w-2xl px-4 flex flex-col items-center"
          >
            <div className="text-center mb-8 w-full">
              <h2 className="text-2xl font-bold text-white mb-1">{track.name}</h2>
              <p className="text-white/70">{track.artist}</p>
            </div>

            <div className="w-full bg-black/30 rounded-lg overflow-hidden">
              <iframe
                title={`Spotify: ${track.name}`}
                style={{
                  borderRadius: "12px",
                  display: "block",
                  width: "100%",
                  height: "380px",
                  border: "none",
                  background: "transparent"
                }}
                src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-white/80">Loading track...</p>
          </div>
        )}
      </div>
    </div>
  );
}
