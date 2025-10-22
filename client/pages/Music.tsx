import { useState, useEffect, useRef } from "react";
import Turntable from "@/components/music/Turntable";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  externalUrl: string;
  previewUrl: string | null;
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load Spotify embed script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/oembed";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.play().catch(err => console.error("Audio play error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

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

        {/* Spotify Embed Card */}
        {!loading && track && trackId && (
          <div className="mt-12 w-full max-w-md">
            <div className="rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: "rgb(220, 38, 38)" }}>
              <div className="flex gap-4">
                {/* Album Art */}
                <div className="flex-shrink-0">
                  {track.imageUrl && (
                    <img
                      src={track.imageUrl}
                      alt={track.album}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl leading-tight">{track.name.toUpperCase()}</h3>
                    <p className="text-white/80 text-sm mt-1">{track.artist}</p>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <div className="bg-white/20 h-1 rounded-full">
                        <div className="bg-white h-1 rounded-full w-1/4"></div>
                      </div>
                    </div>
                    <button
                      onClick={() => setPlaying(!playing)}
                      className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      {playing ? (
                        <svg className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden audio player for direct playback */}
            {track.previewUrl && (
              <audio
                ref={(el) => {
                  if (el && playing && !el.src) {
                    el.src = track.previewUrl;
                    el.play().catch(err => console.error("Play error:", err));
                  }
                }}
                style={{ display: "none" }}
              />
            )}

            {/* Actual Spotify Embed below the card */}
            <div className="mt-6 flex justify-center">
              <iframe
                style={{ borderRadius: "12px" }}
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%"
                height={352}
                frameBorder="0"
                allowFullScreen
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
