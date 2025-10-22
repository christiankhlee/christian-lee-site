import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import Turntable from "@/components/music/Turntable";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  externalUrl: string;
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Extract track ID from URI (format: spotify:track:ID)
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

        {/* Track Info and Embed */}
        {!loading && track && trackId && (
          <div className="mt-12 w-full max-w-2xl px-4 text-center">
            {/* Now Playing Header */}
            <p className="text-white/80 text-sm uppercase tracking-wider font-medium mb-4">Now Playing</p>

            {/* Album Cover - Centered */}
            {track.imageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={track.imageUrl}
                  alt={track.album}
                  className="w-24 h-24 rounded-lg shadow-lg object-cover border-2 border-white/20"
                />
              </div>
            )}

            {/* Track Info */}
            <h2 className="text-3xl font-bold text-white mb-2">{track.name}</h2>
            <p className="text-white/70 text-lg mb-1">{track.artist}</p>
            <p className="text-white/50 text-base mb-6">{track.album}</p>

            {/* Play Button */}
            <button
              onClick={() => setPlaying(true)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 mb-8 ${
                playing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-white/20 hover:bg-white/30"
              } text-white shadow-lg font-medium`}
              title={playing ? "Playing..." : "Play"}
            >
              <Play size={20} fill="currentColor" />
              {playing ? "Playing..." : "Play"}
            </button>

            {/* Spotify Embed */}
            <div className="flex justify-center">
              <div style={{ width: "100%", maxWidth: "600px" }}>
                <iframe
                  title="Spotify Player"
                  style={{ borderRadius: "12px" }}
                  src={`https://open.spotify.com/embed/track/${trackId}`}
                  width="100%"
                  height={352}
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-white/80 drop-shadow text-lg font-medium">Loading track...</p>
          </div>
        )}
      </div>
    </div>
  );
}
