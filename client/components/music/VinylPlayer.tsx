import { useState, useEffect } from "react";

interface VinylPlayerProps {
  spinning?: boolean;
  armDown?: boolean;
  onPlay?: () => void;
}

export default function VinylPlayer({
  spinning = false,
  armDown = false,
  onPlay,
}: VinylPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-96 h-96 flex items-center justify-center"
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: "1200px" }}
    >
      {/* Turntable platter base */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 shadow-2xl border-8 border-amber-300">
        {/* Platter rim detail */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-400/40 shadow-inner" />

        {/* Center spindle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full shadow-lg" />
      </div>

      {/* Vinyl record - realistic 3D effect */}
      <div
        className={`absolute inset-6 rounded-full ${spinning ? "animate-spin" : ""}`}
        style={{
          animationDuration: spinning ? "3s" : "0s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 30%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 30%),
            radial-gradient(circle, #0a0a0a 0%, #1a1a1a 100%)
          `,
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.8), inset 0 -10px 30px rgba(0,0,0,0.5), inset 0 10px 30px rgba(255,255,255,0.1)",
        }}
      >
        {/* Vinyl grooves */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.05))" }}
        >
          <defs>
            <pattern
              id="grooves"
              x="0"
              y="0"
              width="100%"
              height="100%"
              patternUnits="objectBoundingBox"
            >
              <circle
                cx="50%"
                cy="50%"
                r="15%"
                fill="none"
                stroke="rgba(100,100,100,0.3)"
                strokeWidth="0.5%"
              />
              <circle
                cx="50%"
                cy="50%"
                r="25%"
                fill="none"
                stroke="rgba(80,80,80,0.2)"
                strokeWidth="0.5%"
              />
              <circle
                cx="50%"
                cy="50%"
                r="35%"
                fill="none"
                stroke="rgba(60,60,60,0.15)"
                strokeWidth="0.5%"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(40,40,40,0.1)"
                strokeWidth="0.5%"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grooves)" rx="50%" />
        </svg>

        {/* Center label */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-amber-500"
          style={{
            background: `
              radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, transparent 50%),
              linear-gradient(135deg, #f59e0b 0%, #d97706 100%)
            `,
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.2)",
          }}
        >
          {/* Label details */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white text-xs font-bold mix-blend-lighten">
              <div className="text-amber-900">MUSIC</div>
              <div className="text-amber-900/70 text-xs mt-1">♫</div>
            </div>
          </div>
          {/* Label shine effect */}
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/20 blur-sm" />
        </div>

        {/* Center spindle hole */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full shadow-lg" />
      </div>

      {/* Tonearm pivot base */}
      <div className="absolute right-2 top-4 w-14 h-14 rounded-full bg-gradient-to-b from-white to-gray-200 shadow-xl border-4 border-gray-300 flex items-center justify-center z-20">
        <div className="w-2 h-2 bg-gray-600 rounded-full" />
      </div>

      {/* Tonearm */}
      <div
        className="absolute right-2 top-4 z-10 transition-transform duration-1000 ease-out"
        style={{
          transform: armDown ? "rotate(50deg)" : "rotate(-40deg)",
          transformOrigin: "28px 28px",
        }}
      >
        {/* Arm shaft with gradient */}
        <div
          className="w-1.5 h-40 rounded-full shadow-lg"
          style={{
            background: `
              linear-gradient(90deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.8) 25%, 
                rgba(255,255,255,0.8) 75%, 
                rgba(0,0,0,0.3) 100%),
              linear-gradient(180deg, 
                rgb(240,240,240) 0%, 
                rgb(200,200,200) 50%, 
                rgb(100,100,100) 100%)`,
            boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
          }}
        />

        {/* Headshell */}
        <div
          className="absolute top-40 -left-2.5 w-6 h-5 bg-gradient-to-b from-white to-gray-300 rounded-sm shadow-md border-2 border-gray-400"
          style={{
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.6)",
          }}
        />

        {/* Stylus/needle tip */}
        <div className="absolute top-44 -left-0.5 w-1 h-2 bg-gradient-to-b from-gray-300 to-black rounded-full" />
      </div>

      {/* Glow effect when spinning */}
      {spinning && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow:
              "0 0 60px rgba(251, 191, 36, 0.4), inset 0 0 60px rgba(251, 191, 36, 0.1)",
          }}
        />
      )}

      {/* Hover shine effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
