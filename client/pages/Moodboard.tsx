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

        <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-0">
          {(images.length ? images : [
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F9e30fe9c38e24e489c7e51e7909a61fe",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fe270b54c3daa4c3fa2d0e2a5b94eede1",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Ffd307f7fb87e46dea122c2c8e63ad1e3",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F596e1630048f418bbd5184ff2a292d7b",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F22cc2b4e2bcc4e459643f7e1098255cc",
          ]).map((it, idx) => {
            // Create overlapping effect with random transforms and z-index
            const transforms = [
              'rotate-1 -translate-x-2',
              '-rotate-1 translate-x-1',
              'rotate-2 -translate-y-1',
              '-rotate-2 translate-y-1',
              'rotate-1 translate-x-2',
              '-rotate-1 -translate-x-1'
            ];
            const zIndexes = ['z-10', 'z-20', 'z-30', 'z-40'];
            const margins = ['-mb-8', '-mb-6', '-mb-4', '-mb-10', '-mb-2'];

            const transform = transforms[idx % transforms.length];
            const zIndex = zIndexes[idx % zIndexes.length];
            const margin = margins[idx % margins.length];

            return typeof it === 'string' ? (
              <motion.figure
                key={`demo-${idx}`}
                initial={{ opacity: 0, y: 14, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                className={`${margin} break-inside-avoid rounded-lg overflow-hidden ring-1 ring-slate-200/60 dark:ring-white/10 ${transform} ${zIndex} relative cursor-pointer hover:shadow-xl transition-shadow duration-200 aspect-square`}
              >
                <img src={it} alt="sample" className="w-full h-full object-cover" />
              </motion.figure>
            ) : (
              <motion.figure
                key={it.id ?? idx}
                initial={{ opacity: 0, y: 14, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{
                  scale: 1.05,
                  rotate: 0,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                className={`${margin} break-inside-avoid rounded-lg overflow-hidden ring-1 ring-slate-200/60 dark:ring-white/10 group relative ${transform} ${zIndex} cursor-pointer hover:shadow-xl transition-shadow duration-200`}
              >
                <img src={it.url} alt={it.name} className="w-full h-auto" />
                <figcaption className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={()=>onDelete(it.id)} className="px-2 py-1 text-xs rounded-md bg-black/60 text-white">Remove</button>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
