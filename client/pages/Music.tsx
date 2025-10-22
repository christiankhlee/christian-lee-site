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
          <div className="mt-12 w-full max-w-3xl px-4">
            <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
              {/* Album Cover */}
              {track.imageUrl && (
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={track.imageUrl}
                    alt={track.album}
                    className="w-48 h-48 rounded-lg shadow-2xl object-cover border-4 border-white/20"
                  />
                </div>
              )}

              {/* Track Info */}
              <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                <p className="text-white/80 text-sm uppercase tracking-wider font-medium mb-2">Now Playing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{track.name}</h2>
                <p className="text-white/70 text-xl mb-1">{track.artist}</p>
                <p className="text-white/50 text-base">{track.album}</p>
              </div>
            </div>

            {/* Spotify Embed */}
            <div className="flex justify-center">
              <iframe
                style={{ borderRadius: "12px" }}
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
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
