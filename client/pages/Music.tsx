import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function Music() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (audioRef.current && videoRef.current) {
      if (playing) {
        audioRef.current.pause();
        videoRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        onPause={() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setPlaying(false);
          }
        }}
        style={{
          zIndex: 0,
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
        }}
      >
        <source
          src="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fc6f97183f3084f84a5566dc80d539b87?alt=media&token=0b3472ce-5a70-4ed7-8bdd-c4d34b121a29&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Music info card */}
        <div className="max-w-2xl text-center">
          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Undressed
          </h1>

          {/* Artist */}
          <p className="text-2xl md:text-3xl text-white/90 mb-8 drop-shadow-lg">
            by Sombr
          </p>

          {/* Caption/Blurb */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
            <p className="text-lg text-white/80 leading-relaxed">
              A captivating track that blends emotive vocals with ambient
              production. This song captures the essence of vulnerability and
              raw emotion, inviting listeners into an intimate musical
              experience.
            </p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6 border border-white/30 transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause size={40} className="text-white" />
            ) : (
              <Play size={40} className="text-white fill-white" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        muted={false}
        loop
        onPause={() => {
          if (videoRef.current) {
            videoRef.current.pause();
            setPlaying(false);
          }
        }}
      >
        <source
          src="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F7023a6d659b64e85be1a264a917a06e8?alt=media&token=473a7609-5445-4020-8d0f-5806a0a6c230&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}
