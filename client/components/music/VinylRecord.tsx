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
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.85) 60%, #0b0e12 100%)",
  }), []);

  const ringStyle = useMemo(() => ({
    background:
      "repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
  }), []);

  const spinClass = active && !lifting ? "spin-fast" : "spin-slow";

  return (
    <div className="relative group" onClick={onSelect} role="button" aria-label={`Play ${title}`}>
      {/* pulsing visualization */}
      {active && (
        <div className="absolute inset-0 rounded-full scale-110 bg-cyan-200/20 blur-xl animate-pulse" />
      )}
      {/* disc */}
      <div
        className={`relative mx-auto h-64 w-64 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.25)] ${spinClass} group-hover:spin-medium ${active ? "ring-2 ring-cyan-300/70" : "ring-0"}`}
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

      {/* needle arm */}
      <div
        className={`pointer-events-none absolute -right-6 top-6 origin-top transition-transform duration-500 ${lifting ? "rotate-12" : active ? "-rotate-2" : "rotate-12"}`}
      >
        <div className="h-3 w-3 rounded-full bg-slate-500 shadow" />
        <div className="h-24 w-2 bg-gradient-to-b from-slate-400 to-slate-600" />
        <div className="h-3 w-3 rounded-full bg-slate-500" />
      </div>

      {/* meta */}
      <div className="mt-4 text-center">
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        {author && <p className="text-sm text-muted-foreground">{author}</p>}
      </div>

      {/* subtle waveform under active record */}
      {active && !lifting && (
        <div className="mt-4 flex items-end justify-center gap-1 h-10" aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className={`w-1 rounded-full bg-cyan-400/70 dark:bg-cyan-300/70 animate-wave`} style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
}
