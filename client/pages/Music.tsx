import { useEffect, useRef, useState } from "react";
import VinylRecord from "@/components/music/VinylRecord";

export default function Music() {
  const [playing, setPlaying] = useState(false);

  const handleVinylClick = () => {
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
        <header className="text-center mb-16">
          <p className="uppercase tracking-widest text-xs text-white/70 mb-2">Playlist</p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">Music</h1>
        </header>

        {/* Vinyl */}
        <div className="mb-12">
          <VinylRecord
            url="https://open.spotify.com/track/7qjZnBKE73H4Oxkopwulqe"
            active={playing}
            lifting={!playing}
            onSelect={handleVinylClick}
          />
        </div>
      </div>
    </div>
  );
}
