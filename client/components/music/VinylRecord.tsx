import { useEffect, useMemo, useState } from "react";

export type VinylProps = {
  url: string; // Spotify track URL like https://open.spotify.com/track/...
  active: boolean;
  lifting?: boolean;
  onSelect: () => void;
};

export default function VinylRecord({ url, active, lifting = false, onSelect }: VinylProps) {
  const [thumb, setThumb] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/spotify-oembed?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error("oembed failed");
        const data = await res.json();
        if (!cancelled) {
          setThumb(data.thumbnail_url || "");
          setTitle(data.title || "Track");
          setAuthor(data.author_name || "");
        }
      } catch {
        if (!cancelled) {
          setThumb("");
          setTitle("Track");
          setAuthor("");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  const discStyle = useMemo(() => ({
    background:
      [
        "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.16) 0, rgba(0,0,0,0.22) 22%, rgba(8,13,20,0.92) 64%, #0a0d12 100%)",
        "conic-gradient(from 200deg at 60% 40%, rgba(255,255,255,0.12) 0 6%, transparent 6% 100%)",
        "radial-gradient(closest-side, rgba(120,170,220,0.15), rgba(0,0,0,0) 60%)"
      ].join(","),
  }), []);

  const ringStyle = useMemo(() => ({
    background:
      [
        "repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        "radial-gradient(circle, rgba(120,180,255,0.06), rgba(255,180,120,0.04) 40%, transparent 70%)"
      ].join(","),
  }), []);

  const spinClass = active && !lifting ? "spin-fast" : "spin-slow";

  return (
    <div className="group" onClick={onSelect} role="button" aria-label={`Play ${title}`}>
      {/* A fixed-size wrapper ensures the arm positions relative to the disc, not the grid column */}
      <div className="relative mx-auto h-64 w-64">
        {/* pulsing visualization */}
        {active && (
          <div className="absolute inset-0 rounded-full scale-110 bg-cyan-200/20 blur-xl animate-pulse" />
        )}
        {/* disc */}
        <div
          className={`relative h-full w-full rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.25)] ${spinClass} group-hover:spin-medium ${active ? "ring-2 ring-cyan-300/70" : "ring-0"}`}
          style={discStyle as any}
        >
          <div className="absolute inset-0 rounded-full" style={ringStyle as any} />
          {/* center label with album art */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full overflow-hidden ring-2 ring-white/70 shadow-md">
            {thumb ? (
              <img src={thumb} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
            )}
          </div>
          {/* spindle hole */}
          <span className="absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white/80" />
        </div>

        {/* needle arm: pivoted from a fixed point near the disc's upper-right */}
        {(() => {
          // parked off -> onto record when active
          const angle = lifting ? 42 : active ? -30 : 42;
          return (
            <div
              className="pointer-events-none absolute z-10"
              style={{ right: "8px", top: "-6px", transformOrigin: "18px 18px", transform: `rotate(${angle}deg)`, transition: "transform 700ms ease-in-out" }}
              aria-hidden
            >
              <div className="h-9 w-9 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.25)]" />
              <div className="h-28 w-1.5 bg-gradient-to-b from-slate-300 to-slate-600 mx-auto" />
              {/* stylus aligned to sit on black disc when active */}
              <div className="-mt-1.5 h-5 w-3 rounded-md bg-white shadow mx-auto" />
            </div>
          );
        })()}
      </div>

      {/* meta */}
      <div className="mt-4 text-center">
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        {author && <p className="text-sm text-muted-foreground">{author}</p>}
      </div>

    </div>
  );
}
