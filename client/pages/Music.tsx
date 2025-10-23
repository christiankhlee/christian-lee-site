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

declare global {
  interface Window {
    SC: any;
  }
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const soundcloudUrl = "https://soundcloud.com/sombrsongs/undressed";

  useEffect(() => {
    // Load SoundCloud Widget API
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
    // Setup SoundCloud widget listener
    if (iframeRef.current && window.SC) {
      const widget = window.SC.Widget(iframeRef.current);

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setPlaying(true);
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          setPlaying(false);
        });
      });
    }
  }, []);

  useEffect(() => {
    // Sync turntable with player state
    if (iframeRef.current && window.SC) {
      const widget = window.SC.Widget(iframeRef.current);

      if (playing) {
        widget.play();
      } else {
        widget.pause();
      }
    }
  }, [playing]);


  const handlePlayToggle = () => {
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

        {/* Turntable */}
        <Turntable 
          spinning={playing} 
          armDown={playing} 
          onPlay={handlePlayToggle}
        />

        {/* SoundCloud Embed */}
        {!loading && track && (
          <div
            ref={embedContainerRef}
            className="mt-12 w-full max-w-2xl px-4 flex flex-col items-center"
          >
            <div className="text-center mb-8 w-full">
              <h2 className="text-2xl font-bold text-white mb-1">{track.name}</h2>
              <p className="text-white/70">{track.artist}</p>
            </div>

            <iframe
              ref={iframeRef}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              width="100%"
              height="166"
              frameBorder="no"
              allow="autoplay"
              style={{
                borderRadius: "12px",
                display: "block"
              }}
            />
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
