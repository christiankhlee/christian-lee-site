import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = { id: string; type: string; ref: string; embedUrl: string; addedAt: string };
const STORAGE_KEY = "spotifyEmbeds";

function parseSpotifyUrl(input: string): Item | null {
  const trimmed = input.trim();
  const colon = trimmed.match(/^spotify:(track|album|playlist|episode|show):([A-Za-z0-9]+)$/);
  const web = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/);
  const embed = trimmed.match(/open\.spotify\.com\/embed\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/);
  const m = colon || web || embed;
  if (!m) return null;
  const type = m[1];
  const id = m[2];
  const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
  return { id: crypto.randomUUID(), type, ref: `${type}:${id}`, embedUrl, addedAt: new Date().toISOString() };
}

export default function Music() {
  const [items, setItems] = useState<Item[]>([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved) as Item[]);
  }, []);

  const save = (list: Item[]) => {
    setItems(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSpotifyUrl(url);
    if (!parsed) return;
    const list = [parsed, ...items];
    save(list);
    setUrl("");
  };

  const remove = (id: string) => {
    save(items.filter((i) => i.id !== id));
  };

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Playlist</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Music</h1>
        <p className="mt-3 text-muted-foreground">Add any Spotify track, album, or playlist URL. Links are stored locally.</p>
      </header>

      <form onSubmit={add} className="mt-8 rounded-xl border p-5 bg-card/60 backdrop-blur">
        <div className="grid md:grid-cols-[1fr_auto] gap-3">
          <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Paste Spotify link (e.g. https://open.spotify.com/track/...)" className="h-11 rounded-md border px-3 bg-background" />
          <button className="h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Add</button>
        </div>
      </form>

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No tracks yet. Paste a Spotify link above.</p>
        ) : (
          items.map((item, idx) => (
            <motion.article key={item.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-cyan-50/60 to-blue-50/40 dark:from-cyan-900/20 dark:to-blue-900/10">
              <div className="p-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-white/60 dark:bg-white/10 backdrop-blur">{item.type}</span>
                <button type="button" onClick={() => remove(item.id)} className="opacity-60 hover:opacity-100">Remove</button>
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-lg overflow-hidden shadow-sm ring-1 ring-slate-200/60 dark:ring-white/10">
                  <iframe
                    title={item.ref}
                    src={item.embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition" style={{background:"radial-gradient(60% 50% at 50% 50%, hsl(var(--secondary)/0.15), transparent 70%)"}} />
            </motion.article>
          ))
        )}
      </section>
    </div>
  );
}
