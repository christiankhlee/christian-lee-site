import { useState } from "react";

interface TurntableProps {
  spinning?: boolean;
  armDown?: boolean;
  onPlay?: () => void;
}

export default function Turntable({
  spinning = false,
  armDown = false,
  onPlay,
}: TurntableProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-96 h-96 flex items-center justify-center perspective cursor-pointer"
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Turntable base - refined design */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-2xl border-8 border-white">
        {/* Vinyl record */}
        <div
          className={`absolute inset-4 rounded-full bg-black shadow-inner ${spinning ? "animate-spin" : ""}`}
          style={{
            animationDuration: spinning ? "3s" : "0s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {/* Vinyl grooves effect */}
          <div className="absolute inset-0 rounded-full opacity-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-gray-700/40"
                style={{
                  width: `${100 - i * 7}%`,
                  height: `${100 - i * 7}%`,
                  top: `${i * 3.5}%`,
                  left: `${i * 3.5}%`,
                }}
              />
            ))}
          </div>

          {/* Center label - amber/gold */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg border-4 border-amber-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-black/60" />
            <div className="absolute inset-8 rounded-full border-2 border-amber-600/40" />
          </div>
        </div>

        {/* Turntable top rim detail */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300/50" />
      </div>

      {/* Tonearm - positioned to the right */}
      <div
        className="absolute right-0 top-6 z-10 transition-transform duration-1000 ease-out"
        style={{
          transform: armDown ? "rotate(55deg)" : "rotate(-35deg)",
          transformOrigin: "0 12px",
        }}
      >
        {/* Arm base */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-xl border-3 border-gray-300 absolute -left-6 -top-6" />

        {/* Arm shaft */}
        <div className="w-1.5 h-36 bg-gradient-to-b from-white via-gray-200 to-gray-400 shadow-lg rounded-full" />

        {/* Cartridge/stylus head */}
        <div className="absolute top-36 -left-2 w-5 h-4 bg-gradient-to-b from-white to-gray-200 rounded-sm shadow-md border border-gray-400" />
      </div>

      {/* Hover effect */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${isHovered ? "opacity-20" : "opacity-0"} bg-black`}
      />

      {/* Glow effect when spinning */}
      {spinning && (
        <div
          className="absolute inset-0 rounded-full animate-pulse shadow-lg"
          style={{
            boxShadow:
              "0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 40px rgba(251, 191, 36, 0.1)",
          }}
        />
      )}
    </div>
  );
}
