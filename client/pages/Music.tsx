import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Item = { id: string; type: string; ref: string; embedUrl: string; addedAt: string; note: string };
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
  return { id: crypto.randomUUID(), type, ref: `${type}:${id}`, embedUrl, addedAt: new Date().toISOString(), note: "" };
}

export default function Music() {
  const [items, setItems] = useState<Item[]>([]);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

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
    const list = [{ ...parsed, note: note.trim() }, ...items];
    save(list);
    setUrl("");
    setNote("");
  };

  const remove = (id: string) => {
    save(items.filter((i) => i.id !== id));
  };

  const updateNote = (id: string, value: string) => {
    const list = items.map((i) => (i.id === id ? { ...i, note: value } : i));
    save(list);
  };

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Playlist</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Music</h1>
        <p className="mt-3 text-muted-foreground">Add any Spotify track, album, or playlist URL. Links are stored locally.</p>
      </header>

      <form onSubmit={add} className="mt-8 rounded-xl border p-5 bg-card/60 backdrop-blur">
        <div className="grid gap-3">
          <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Paste Spotify link (e.g. https://open.spotify.com/track/...)" className="h-11 rounded-md border px-3 bg-background" />
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Write a short note about this song..." className="min-h-[80px] rounded-md border p-3 bg-background" />
          <div>
            <button className="h-11 px-5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Add</button>
          </div>
        </div>
      </form>

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No tracks yet. Paste a Spotify link above.</p>
        ) : (
          items.map((item, idx) => (
            <motion.article key={item.id} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="group relative overflow-hidden rounded-xl border bg-card">
              <div className="p-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-white/60 dark:bg-white/10 backdrop-blur">{item.type}</span>
                <button type="button" onClick={() => remove(item.id)} className="opacity-60 hover:opacity-100">Remove</button>
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-[10px] bg-white p-2 shadow-sm ring-1 ring-slate-200/60 dark:ring-white/10">
                  <div className="bg-zinc-100 rounded-[6px] overflow-hidden">
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
                  <textarea
                    value={item.note}
                    onChange={(e)=>updateNote(item.id, e.target.value)}
                    onBlur={(e)=>updateNote(item.id, e.target.value.trim())}
                    placeholder="Write a note…"
                    className="mt-2 w-full resize-none border-none outline-none bg-transparent text-[12px] text-muted-foreground"
                    rows={3}
                  />
                </div>
              </div>
              <span aria-hidden className="pointer-events-none absolute -top-3 left-6 h-8 w-16 bg-[rgba(243,244,246,0.8)] shadow-sm rounded-[2px] rotate-[-8deg] mix-blend-multiply" style={{backgroundImage:"linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 60%), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px)"}} />
            </motion.article>
          ))
        )}
      </section>
    </div>
  );
}
