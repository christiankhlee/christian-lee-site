import { useState } from "react";

interface TurntableProps {
  spinning?: boolean;
  armDown?: boolean;
  onPlay?: () => void;
}

export default function Turntable({ spinning = false, armDown = false, onPlay }: TurntableProps) {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center perspective" onClick={onPlay}>
      {/* Turntable base - white */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl border-8 border-white">
        {/* Vinyl record */}
        <div
          className={`absolute inset-4 rounded-full bg-black shadow-inner ${spinning ? "animate-spin" : ""}`}
          style={{
            animationDuration: spinning ? "3s" : "0s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite"
          }}
        >
          {/* Vinyl grooves effect */}
          <div className="absolute inset-0 rounded-full opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-gray-800/30"
                style={{
                  width: `${100 - i * 10}%`,
                  height: `${100 - i * 10}%`,
                  top: `${i * 5}%`,
                  left: `${i * 5}%`
                }}
              />
            ))}
          </div>

          {/* Center label - yellow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-yellow-400 shadow-lg border-2 border-yellow-500 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black" />
          </div>
        </div>

        {/* Turntable top rim detail */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-300/50" />
      </div>

      {/* Tonearm - positioned to the right */}
      <div
        className="absolute right-0 top-12 z-10 origin-left transition-transform duration-1000"
        style={{
          transform: armDown ? "rotate(-25deg)" : "rotate(45deg)",
          transformOrigin: "2px 8px"
        }}
      >
        {/* Arm base */}
        <div className="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-gray-200 absolute -left-5 -top-5" />

        {/* Arm shaft */}
        <div className="w-1 h-32 bg-gradient-to-b from-white via-gray-300 to-gray-400 shadow-lg rounded-full" />

        {/* Cartridge/stylus head */}
        <div className="absolute top-32 -left-1.5 w-4 h-3 bg-white rounded shadow-md border border-gray-300" />
      </div>

      {/* Play button overlay */}
      <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-10 bg-black transition-opacity cursor-pointer" />
    </div>
  );
}
