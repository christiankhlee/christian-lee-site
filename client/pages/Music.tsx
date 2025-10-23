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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fireplace background */}
      <div className="absolute inset-0">
        {/* Base warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-orange-900 to-red-950" />
        
        {/* Fireplace glow base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 bg-gradient-to-t from-orange-700 via-red-800 to-transparent opacity-60" />

        {/* Animated flame #1 */}
        <div className="absolute bottom-0 left-1/4 w-64 h-96 opacity-40"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,100,0,0.8) 0%, rgba(255,150,0,0.4) 25%, transparent 70%)",
            animation: "flame1 4s ease-in-out infinite"
          }}
        />

        {/* Animated flame #2 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 opacity-35"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,60,0,0.7) 0%, rgba(255,120,0,0.3) 30%, transparent 75%)",
            animation: "flame2 5s ease-in-out infinite 0.5s"
          }}
        />

        {/* Animated flame #3 */}
        <div className="absolute bottom-0 right-1/4 w-72 h-80 opacity-35"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,150,0,0.6) 0%, rgba(255,100,0,0.25) 35%, transparent 70%)",
            animation: "flame3 4.5s ease-in-out infinite 1s"
          }}
        />

        {/* Floating embers - small particles */}
        <div className="absolute w-1 h-1 bg-yellow-300 rounded-full bottom-1/3 left-1/3 opacity-60"
          style={{
            animation: "ember 3s ease-out infinite"
          }}
        />
        <div className="absolute w-1.5 h-1.5 bg-orange-300 rounded-full bottom-1/4 left-2/3 opacity-50"
          style={{
            animation: "ember 3.5s ease-out infinite 0.7s"
          }}
        />
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full bottom-2/5 right-1/4 opacity-70"
          style={{
            animation: "ember 2.8s ease-out infinite 1.4s"
          }}
        />
        <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full bottom-1/3 left-1/2 opacity-55"
          style={{
            animation: "ember 3.2s ease-out infinite 2.1s"
          }}
        />

        {/* Warm light rays */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl" />
        </div>

        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)"
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        {/* Main player container - horizontal layout */}
        <div className="w-full max-w-5xl">
          {!loading && track ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-amber-600/30 transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(251,146,60,0.04) 100%)"
              }}
            >
              {/* Horizontal layout: Vinyl left, Info right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left side - Vinyl Player */}
                <div className="flex justify-center">
                  <div className="drop-shadow-2xl transition-all duration-300 hover:drop-shadow-orange-600/40">
                    <VinylPlayer 
                      spinning={playing} 
                      armDown={playing} 
                      onPlay={handlePlayToggle}
                    />
                  </div>
                </div>

                {/* Right side - Track Info */}
                <div className="flex flex-col justify-center space-y-6">
                  {/* Track info section */}
                  <div className="space-y-3">
                    <p className="text-orange-400/80 text-sm font-semibold uppercase tracking-widest">
                      Now Playing
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                      {track.name}
                    </h2>
                    <p className="text-slate-300 text-xl">
                      {track.artist}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {track.album}
                    </p>
                  </div>

                  {/* Album art display */}
                  {track.imageUrl && (
                    <div className="flex justify-start">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                        <img
                          src={track.imageUrl}
                          alt={track.name}
                          className="relative w-40 h-40 rounded-xl shadow-2xl object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Play button */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handlePlayToggle}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                      <div className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center gap-3 font-semibold text-white hover:gap-4 transition-all duration-200 shadow-lg">
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
                  <div className="pt-4 border-t border-white/10">
                    <div className="w-full">
                      <iframe
                        ref={iframeRef}
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff6b35&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false`}
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
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-96">
              <div className="w-12 h-12 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-lg font-light">Loading your music...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes flame1 {
          0%, 100% { 
            transform: translateY(0) scaleY(1);
            filter: brightness(1);
          }
          25% { 
            transform: translateY(-20px) scaleY(1.1);
            filter: brightness(1.2);
          }
          50% { 
            transform: translateY(-10px) scaleY(0.95);
            filter: brightness(0.95);
          }
          75% { 
            transform: translateY(-25px) scaleY(1.05);
            filter: brightness(1.15);
          }
        }

        @keyframes flame2 {
          0%, 100% { 
            transform: translateY(0) scaleY(1) scaleX(1);
            filter: brightness(0.9);
          }
          20% { 
            transform: translateY(-15px) scaleY(1.15) scaleX(0.95);
            filter: brightness(1.1);
          }
          40% { 
            transform: translateY(-5px) scaleY(0.9) scaleX(1.05);
            filter: brightness(1.05);
          }
          60% { 
            transform: translateY(-30px) scaleY(1.2) scaleX(0.9);
            filter: brightness(1.2);
          }
          80% { 
            transform: translateY(-10px) scaleY(1) scaleX(1);
            filter: brightness(0.95);
          }
        }

        @keyframes flame3 {
          0%, 100% { 
            transform: translateY(0) scaleY(1) scaleX(1);
            filter: brightness(1);
          }
          30% { 
            transform: translateY(-25px) scaleY(1.1) scaleX(0.95);
            filter: brightness(1.15);
          }
          50% { 
            transform: translateY(-5px) scaleY(0.95) scaleX(1.1);
            filter: brightness(0.9);
          }
          70% { 
            transform: translateY(-20px) scaleY(1.15) scaleX(1);
            filter: brightness(1.1);
          }
        }

        @keyframes ember {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) translateX(var(--tx, 20px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
