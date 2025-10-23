import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    SC: any;
  }
}

export default function Music() {
  const [playing, setPlaying] = useState(false);
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
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-400 to-orange-300">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage: `url('https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F5a2d9ff3a1014694b54339ea69f23ed9?alt=media&token=5fb550cb-5a11-42bf-b615-e3a49f26733a&apiKey=9a64d775673a4d3c908c6d11727a9c4b')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
        onLoad={() => {
          console.log("Background image loaded");
        }}
      />

      {/* Hidden SoundCloud iframe for audio control */}
      <div className="hidden">
        <iframe
          ref={iframeRef}
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff6b35&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false`}
          width="100%"
          height="120"
          frameBorder="no"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
