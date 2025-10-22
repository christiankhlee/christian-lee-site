import { useState, useEffect } from "react";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
}

export default function Music() {
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

  const trackId = track?.uri.split(":").pop();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Spotify Embed Test</h1>
        
        {!loading && track && trackId && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Now Playing</p>
              <h2 className="text-2xl font-bold text-white">{track.name}</h2>
              <p className="text-white/50">{track.artist}</p>
            </div>

            {/* Simple Spotify Embed */}
            <div className="flex justify-center">
              <iframe
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%"
                height={352}
                frameBorder={0}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div className="text-center text-white/50 text-sm">
              <p>Click the play button in the Spotify player above to hear the audio.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center text-white/70">Loading...</div>
        )}
      </div>
    </div>
  );
}
