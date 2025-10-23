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

      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        autoPlay
        muted={false}
        loop
      >
        <source
          src="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F7023a6d659b64e85be1a264a917a06e8?alt=media&token=473a7609-5445-4020-8d0f-5806a0a6c230&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}
