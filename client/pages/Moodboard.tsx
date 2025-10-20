import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { addImage, clearImages, deleteImage, getAllImages, MoodboardImage } from "@/lib/idb";

export default function Moodboard() {
  const [images, setImages] = useState<(MoodboardImage & { url: string })[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    const all = await getAllImages();
    const withUrl = all.map((img) => ({ ...img, url: URL.createObjectURL(img.blob) }));
    const sorted = withUrl.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setImages(sorted);

    // Preload first 8 images for instant display
    sorted.slice(0, 8).forEach((img) => {
      const image = new Image();
      image.src = img.url;
    });
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
        <p className="mt-3 text-muted-foreground">A curated collection of visual inspiration.</p>
      </header>

      <section className="mt-8">
        {/* Upload section hidden for public viewing */}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e)=>onFiles(e.target.files)} className="hidden" />

        <div className="mt-6 columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3">
          {(images.length ? images : [
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F9e30fe9c38e24e489c7e51e7909a61fe",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fe270b54c3daa4c3fa2d0e2a5b94eede1",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Ffd307f7fb87e46dea122c2c8e63ad1e3",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F596e1630048f418bbd5184ff2a292d7b",
            "https://cdn.builder.io/api/v1/image/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2F22cc2b4e2bcc4e459643f7e1098255cc",
          ]).map((it, idx) => (
            typeof it === 'string' ? (
              <motion.figure
                key={`demo-${idx}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                className="mb-4 break-inside-avoid overflow-hidden"
              >
                <img src={it} alt="sample" className="w-full h-auto" />
              </motion.figure>
            ) : (
              <motion.figure
                key={it.id ?? idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
                className="mb-4 break-inside-avoid overflow-hidden group relative"
              >
                <img src={it.url} alt={it.name} className="w-full h-auto" />
                <figcaption className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={()=>onDelete(it.id)} className="px-2 py-1 text-xs bg-black/60 text-white">Remove</button>
                </figcaption>
              </motion.figure>
            )
          ))}
        </div>
      </section>
    </div>
  );
}
