export default function AnimatedBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="none"
        style={{ filter: "url(#turbulence)" }}
      >
        <defs>
          {/* Turbulence filter for organic morphing */}
          <filter id="turbulence">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003"
              numOctaves="4"
              result="noise"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="80"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradient definitions */}
          <linearGradient id="blobGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="25%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="75%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          <linearGradient id="blobGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Pattern for line texture */}
          <pattern id="linePattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Main animated blob */}
        <g>
          {/* Blob shape 1 */}
          <path
            d="M 400,200 Q 600,100 800,200 T 1000,500 Q 1100,700 800,900 T 400,1000 Q 200,900 100,600 T 200,300 Z"
            fill="url(#blobGradient1)"
            style={{
              animation: "blobMorph1 15s ease-in-out infinite",
              opacity: 0.95
            }}
          />

          {/* Blob shape 2 - for extra depth */}
          <path
            d="M 350,300 Q 550,150 900,250 T 1050,600 Q 1000,850 700,950 T 250,850 Q 50,700 100,400 T 250,250 Z"
            fill="url(#blobGradient2)"
            style={{
              animation: "blobMorph2 18s ease-in-out infinite 2s",
              opacity: 0.7,
              mixBlendMode: "screen"
            }}
          />

          {/* Line pattern overlay */}
          <rect
            width="1200"
            height="1200"
            fill="url(#linePattern)"
            style={{
              mixBlendMode: "multiply",
              opacity: 0.15
            }}
          />

          {/* Animated vertical lines for more dynamic texture */}
          <g style={{ animation: "lineFlow 20s linear infinite" }} opacity="0.2">
            {Array.from({ length: 60 }).map((_, i) => (
              <line
                key={i}
                x1={i * 20}
                y1="0"
                x2={i * 20}
                y2="1200"
                stroke="rgba(100,100,150,0.4)"
                strokeWidth="0.5"
              />
            ))}
          </g>
        </g>
      </svg>

      <style>{`
        @keyframes blobMorph1 {
          0% {
            d: path('M 400,200 Q 600,100 800,200 T 1000,500 Q 1100,700 800,900 T 400,1000 Q 200,900 100,600 T 200,300 Z');
          }
          25% {
            d: path('M 350,250 Q 550,80 850,150 T 1050,550 Q 1150,750 750,950 T 300,1000 Q 150,850 80,500 T 180,280 Z');
          }
          50% {
            d: path('M 420,180 Q 620,120 820,220 T 980,480 Q 1080,680 820,880 T 420,1020 Q 220,920 120,620 T 220,320 Z');
          }
          75% {
            d: path('M 380,210 Q 580,110 800,180 T 1020,520 Q 1120,720 800,920 T 380,980 Q 180,880 80,580 T 200,310 Z');
          }
          100% {
            d: path('M 400,200 Q 600,100 800,200 T 1000,500 Q 1100,700 800,900 T 400,1000 Q 200,900 100,600 T 200,300 Z');
          }
        }

        @keyframes blobMorph2 {
          0% {
            d: path('M 350,300 Q 550,150 900,250 T 1050,600 Q 1000,850 700,950 T 250,850 Q 50,700 100,400 T 250,250 Z');
          }
          25% {
            d: path('M 300,280 Q 520,140 880,220 T 1080,620 Q 1050,880 680,980 T 220,880 Q 40,720 70,380 T 240,260 Z');
          }
          50% {
            d: path('M 380,320 Q 580,160 920,270 T 1070,580 Q 1020,820 720,920 T 280,820 Q 60,680 110,420 T 280,300 Z');
          }
          75% {
            d: path('M 340,290 Q 540,155 900,235 T 1060,595 Q 1010,845 710,955 T 260,860 Q 50,710 90,405 T 260,270 Z');
          }
          100% {
            d: path('M 350,300 Q 550,150 900,250 T 1050,600 Q 1000,850 700,950 T 250,850 Q 50,700 100,400 T 250,250 Z');
          }
        }

        @keyframes lineFlow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(1200px);
          }
        }
      `}</style>
    </div>
  );
}
