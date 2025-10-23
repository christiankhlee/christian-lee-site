import { useState, useRef } from "react";

export default function Music() {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayToggle = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background video */}
      <video
        className="fixed inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{
          zIndex: 0
        }}
      >
        <source
          src="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F5a2d9ff3a1014694b54339ea69f23ed9?alt=media&token=5fb550cb-5a11-42bf-b615-e3a49f26733a&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content wrapper */}
      <div className="relative z-10" />

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
