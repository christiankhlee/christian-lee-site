import { useEffect, useState } from "react";

export default function TrackRow({ url, active, onClick }: { url: string; active: boolean; onClick: () => void }) {
  const [meta, setMeta] = useState<{ title: string; author: string; thumb: string }>({ title: "Track", author: "", thumb: "" });
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (!cancel) setMeta({ title: data.title || "Track", author: data.author_name || "", thumb: data.thumbnail_url || "" });
      } catch {}
    })();
    return () => { cancel = true; };
  }, [url]);

  return (
    <button onClick={onClick} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md border transition ${active ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200" : "hover:bg-muted"}`}>
      <img src={meta.thumb} alt="" className="h-10 w-10 rounded-sm object-cover" />
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{meta.title}</p>
        {meta.author && <p className="truncate text-xs text-muted-foreground">{meta.author}</p>}
      </div>
      {active && (
        <span className="flex items-end gap-0.5 h-5" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <i key={i} className="w-0.5 bg-cyan-500/80 animate-wave" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </span>
      )}
    </button>
  );
}
