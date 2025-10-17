import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { addImage, clearImages, deleteImage, getAllImages, MoodboardImage } from "@/lib/idb";

export default function Moodboard() {
  const [images, setImages] = useState<(MoodboardImage & { url: string })[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    const all = await getAllImages();
    const withUrl = all.map((img) => ({ ...img, url: URL.createObjectURL(img.blob) }));
    setImages(withUrl.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  };

  useEffect(() => {
    load();
    return () => { images.forEach((i) => URL.revokeObjectURL(i.url)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const f of Array.from(files)) {
      const blob = f.slice();
      const id = await addImage({ name: f.name, createdAt: Date.now(), blob });
      const url = URL.createObjectURL(blob);
      setImages((prev) => [{ id, name: f.name, createdAt: Date.now(), blob, url }, ...prev]);
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    await onFiles(e.dataTransfer.files);
  };

  const onDelete = async (id?: number) => {
    if (typeof id !== "number") return;
    await deleteImage(id);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const clearAll = async () => {
    await clearImages();
    setImages([]);
  };

  const summary = useMemo(() => `${images.length} image${images.length !== 1 ? "s" : ""}`,[images.length]);

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Gallery</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Moodboard</h1>
        <p className="mt-3 text-muted-foreground">Drop images or upload below. Stored locally in your browser.</p>
      </header>

      <section className="mt-8">
        <div
          onDrop={onDrop}
          onDragOver={(e)=>e.preventDefault()}
          className="rounded-xl border border-dashed p-8 text-center bg-gradient-to-br from-cyan-50/60 to-blue-50/40 dark:from-cyan-900/20 dark:to-blue-900/10"
        >
          <p className="text-sm text-muted-foreground">Drag & drop images here</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button onClick={()=>inputRef.current?.click()} className="px-4 h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Upload</button>
            <button onClick={clearAll} className="px-4 h-11 rounded-md border hover:bg-muted transition">Clear all</button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e)=>onFiles(e.target.files)} className="hidden" />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{summary}</p>

        <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((img, idx) => (
            <motion.figure key={img.id ?? idx} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.02 }} className="mb-4 break-inside-avoid rounded-lg overflow-hidden ring-1 ring-slate-200/60 dark:ring-white/10 group relative">
              <img src={img.url} alt={img.name} className="w-full h-auto" />
              <figcaption className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={()=>onDelete(img.id)} className="px-2 py-1 text-xs rounded-md bg-black/60 text-white">Remove</button>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </div>
  );
}
