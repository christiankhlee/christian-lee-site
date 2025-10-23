import { useState, useEffect, useRef } from "react";
import VinylPlayer from "@/components/music/VinylPlayer";

interface Track {
  id: string;
  uri: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string | null;
}

declare global {
  interface Window {
    SC: any;
  }
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);
  const soundcloudUrl = "https://soundcloud.com/sombrsongs/undressed";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => {
      console.log("SoundCloud Widget API loaded");
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const searchTrack = async () => {
      try {
        const url = `/api/spotify-search?q=${encodeURIComponent("Undressed Sombr")}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

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
    if (iframeRef.current && window.SC) {
      try {
        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(window.SC.Widget.Events.READY, () => {
          console.log("SoundCloud Widget ready");
          
          widget.bind(window.SC.Widget.Events.PLAY, () => {
            console.log("Track playing");
            setPlaying(true);
          });

          widget.bind(window.SC.Widget.Events.PAUSE, () => {
            console.log("Track paused");
            setPlaying(false);
          });

          widget.bind(window.SC.Widget.Events.FINISH, () => {
            console.log("Track finished");
            setPlaying(false);
          });

          widget.bind(window.SC.Widget.Events.ERROR, (error: any) => {
            console.error("SoundCloud Widget error:", error);
          });
        });
      } catch (error) {
        console.error("Failed to initialize SoundCloud widget:", error);
      }
    }
  }, []);

  const handlePlayToggle = () => {
    if (widgetRef.current) {
      try {
        if (playing) {
          widgetRef.current.pause();
        } else {
          widgetRef.current.play();
        }
      } catch (error) {
        console.error("Error toggling playback:", error);
        setPlaying(!playing);
      }
    } else {
      setPlaying(!playing);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        {/* Primary ambient blob */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse"
          style={{
            animation: "float 8s ease-in-out infinite"
          }}
        />
        
        {/* Secondary ambient blob */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            animation: "float 10s ease-in-out infinite 2s"
          }}
        />
        
        {/* Tertiary ambient blob */}
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl"
          style={{
            animation: "float 12s ease-in-out infinite 4s"
          }}
        />

        {/* Additional floating particles */}
        <div className="absolute w-2 h-2 bg-amber-400/40 rounded-full top-1/4 left-1/3 blur-sm"
          style={{
            animation: "float-slow 15s ease-in-out infinite"
          }}
        />
        <div className="absolute w-1.5 h-1.5 bg-amber-300/30 rounded-full top-1/3 right-1/4 blur-sm"
          style={{
            animation: "float-slow 20s ease-in-out infinite 3s"
          }}
        />
        <div className="absolute w-2 h-2 bg-amber-500/20 rounded-full bottom-1/3 left-1/2 blur-sm"
          style={{
            animation: "float-slow 18s ease-in-out infinite 6s"
          }}
        />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/5 to-amber-950/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header section */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-block">
            <p className="uppercase tracking-widest text-xs text-amber-400/70 font-semibold mb-4 animate-pulse">
              Now Playing
            </p>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
            Music
          </h1>
          <p className="text-slate-400 text-lg font-light">
            Discover the stories behind the tracks
          </p>
        </div>

        {/* Main player card */}
        <div className="w-full max-w-2xl">
          {!loading && track ? (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-amber-500/20 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(251,191,36,0.02) 100%)"
              }}
            >
              {/* Vinyl player section */}
              <div className="flex justify-center mb-8">
                <div className="drop-shadow-2xl transition-all duration-300 hover:drop-shadow-amber-500/50">
                  <VinylPlayer 
                    spinning={playing} 
                    armDown={playing} 
                    onPlay={handlePlayToggle}
                  />
                </div>
              </div>

              {/* Track info section */}
              <div className="text-center mb-8 space-y-2">
                <p className="text-amber-400/80 text-sm font-semibold uppercase tracking-widest">
                  {track.album}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {track.name}
                </h2>
                <p className="text-slate-300 text-lg">
                  {track.artist}
                </p>
              </div>

              {/* Album art display */}
              {track.imageUrl && (
                <div className="flex justify-center mb-10">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                    <img
                      src={track.imageUrl}
                      alt={track.name}
                      className="relative w-48 h-48 rounded-2xl shadow-2xl object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Play button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={handlePlayToggle}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                  <div className="relative px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center gap-3 font-semibold text-slate-950 hover:gap-4 transition-all duration-200 shadow-lg">
                    {playing ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Play</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* SoundCloud player */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <iframe
                      ref={iframeRef}
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23fbbf24&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false`}
                      width="100%"
                      height="120"
                      frameBorder="no"
                      allow="autoplay"
                      style={{
                        borderRadius: "12px"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-96">
              <div className="w-12 h-12 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-lg font-light">Loading your music...</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>🎵 Crafted with care • Powered by SoundCloud</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(10px); }
          66% { transform: translateY(20px) translateX(-10px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-50px) translateX(20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
