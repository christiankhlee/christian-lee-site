import { useState, useEffect, useRef } from "react";
import Turntable from "@/components/music/Turntable";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  previewUrl: string | null;
  externalUrl: string;
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    if (!audioRef.current) return;

    if (playing && track?.previewUrl) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch((err) => {
        console.error("Playback error:", err);
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing, track]);

  const handlePlayToggle = () => {
    if (!track?.previewUrl) {
      console.warn("No preview available for this track");
      return;
    }
    setPlaying(!playing);
  };

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

        {/* Track Info */}
        {track && (
          <div className="text-center mb-8 max-w-md">
            {track.imageUrl && (
              <img
                src={track.imageUrl}
                alt={track.album}
                className="w-32 h-32 mx-auto rounded-lg shadow-lg mb-4 object-cover"
              />
            )}
            <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">
              Now Playing
            </p>
            <h2 className="text-2xl font-bold text-white mb-1">{track.name}</h2>
            <p className="text-white/70 text-lg">{track.artist}</p>
            <p className="text-white/50 text-sm mt-2">{track.album}</p>
            {!track.previewUrl && (
              <p className="text-yellow-300 text-sm mt-4">
                Preview not available - requires Spotify Premium
              </p>
            )}
          </div>
        )}

        {/* Turntable */}
        <Turntable 
          spinning={playing} 
          armDown={playing} 
          onPlay={handlePlayToggle}
        />

        {/* Status text */}
        <div className="mt-12 text-center">
          <p className="text-white/80 drop-shadow text-lg font-medium">
            {loading
              ? "Loading track..."
              : playing
              ? "Now Playing..."
              : track?.previewUrl
              ? "Click to Play"
              : "Preview Unavailable"}
          </p>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        crossOrigin="anonymous"
      />
    </div>
  );
}
