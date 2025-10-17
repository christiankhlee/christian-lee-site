import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Post = { id: string; title: string; content: string; date: string };
const STORAGE_KEY = "thoughtsPosts";

export default function Thoughts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPosts(JSON.parse(saved) as Post[]);
  }, []);

  const save = (list: Post[]) => {
    setPosts(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const post: Post = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), date: new Date().toISOString() };
    const list = [post, ...posts];
    save(list);
    setTitle("");
    setContent("");
  };

  const sorted = useMemo(() => posts.sort((a, b) => (a.date < b.date ? 1 : -1)), [posts]);

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Journal</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Thoughts</h1>
        <p className="mt-3 text-muted-foreground">Write and publish lightweight notes. Stored locally in your browser.</p>
      </header>

      <section className="mt-10 grid md:grid-cols-12 gap-8 items-start">
        <form onSubmit={addPost} className="md:col-span-5 rounded-xl border p-5 bg-card/60 backdrop-blur">
          <h2 className="font-semibold">New post</h2>
          <div className="mt-3 grid gap-3">
            <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="h-11 rounded-md border px-3 bg-background" />
            <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Write your thoughts..." className="min-h-[140px] rounded-md border p-3 bg-background" />
            <button className="h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Publish</button>
          </div>
        </form>

        <div className="md:col-span-7">
          {sorted.length === 0 ? (
            <p className="text-muted-foreground">No posts yet. Add your first thought.</p>
          ) : (
            <ul className="space-y-6">
              {sorted.map((post, idx) => (
                <motion.li key={post.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="rounded-xl border p-6 bg-card">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{new Date(post.date).toLocaleString()}</p>
                  <p className="mt-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
