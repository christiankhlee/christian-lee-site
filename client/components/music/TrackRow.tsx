import { useEffect, useState } from "react";

export default function TrackRow({
  url,
  active,
  onClick,
}: {
  url: string;
  active: boolean;
  onClick: () => void;
}) {
  const [meta, setMeta] = useState<{
    title: string;
    author: string;
    thumb: string;
  }>({ title: "Track", author: "", thumb: "" });
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/spotify-oembed?url=${encodeURIComponent(url)}`,
        );
        if (!res.ok) throw new Error("oembed failed");
        const data = await res.json();
        if (!cancel)
          setMeta({
            title: data.title || "Track",
            author: data.author_name || "",
            thumb: data.thumbnail_url || "",
          });
      } catch {
        if (!cancel) setMeta({ title: "Track", author: "", thumb: "" });
      }
    })();
    return () => {
      cancel = true;
    };
  }, [url]);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md border transition ${active ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200" : "hover:bg-muted"}`}
    >
      {meta.thumb ? (
        <img
          src={meta.thumb}
          alt=""
          className="h-10 w-10 rounded-sm object-cover"
        />
      ) : (
        <span className="h-10 w-10 rounded-sm bg-gradient-to-br from-slate-200 to-slate-300" />
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium">{meta.title}</p>
        {meta.author && (
          <p className="truncate text-xs text-muted-foreground">
            {meta.author}
          </p>
        )}
      </div>
      {active && (
        <span className="flex items-end gap-0.5 h-5" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <i
              key={i}
              className={`w-0.5 animate-wave ${i % 2 ? "bg-blue-500/80" : "bg-cyan-500/80"}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
