import { useState, useEffect, useRef } from "react";
import VinylPlayer from "@/components/music/VinylPlayer";
import AnimatedBlob from "@/components/music/AnimatedBlob";

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

          const handlePlay = () => {
            console.log("Track playing");
            setPlaying(true);
          };

          const handlePause = () => {
            console.log("Track paused");
            setPlaying(false);
          };

          const handleFinish = () => {
            console.log("Track finished");
            setPlaying(false);
          };

          widget.bind(window.SC.Widget.Events.PLAY, handlePlay);
          widget.bind(window.SC.Widget.Events.PAUSE, handlePause);
          widget.bind(window.SC.Widget.Events.FINISH, handleFinish);

          widget.bind(window.SC.Widget.Events.ERROR, (error: any) => {
            console.error("SoundCloud Widget error:", error);
          });
        });
      } catch (error) {
        console.error("Failed to initialize SoundCloud widget:", error);
      }
    }

    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.unbind(window.SC.Widget.Events.PLAY);
          widgetRef.current.unbind(window.SC.Widget.Events.PAUSE);
          widgetRef.current.unbind(window.SC.Widget.Events.FINISH);
        } catch (e) {
          console.error("Error unbinding widget events:", e);
        }
      }
    };
  }, []);

  const handlePlayToggle = () => {
    console.log("Play toggle clicked, current state:", playing, "widget:", widgetRef.current);

    if (widgetRef.current) {
      try {
        if (playing) {
          console.log("Pausing track");
          widgetRef.current.pause();
          setPlaying(false);
        } else {
          console.log("Playing track");
          widgetRef.current.play();
          setPlaying(true);
        }
      } catch (error) {
        console.error("Error toggling playback:", error);
        setPlaying(!playing);
      }
    } else {
      console.log("Widget not available, just toggling state");
      setPlaying(!playing);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F5a2d9ff3a1014694b54339ea69f23ed9?alt=media&token=5fb550cb-5a11-42bf-b615-e3a49f26733a&apiKey=9a64d775673a4d3c908c6d11727a9c4b')"
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

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
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff6b35&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false`}
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

    </div>
  );
}
