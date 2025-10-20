import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { curatedPosts } from "@/components/thoughts/data";
import { fetchBuilderPosts } from "@/components/thoughts/api";

export type Post = { id: string; title: string; content: string; date: string };

export default function Thoughts() {
  const [posts, setPosts] = useState<Post[]>(curatedPosts);
  useEffect(() => {
    fetchBuilderPosts(20).then((fromCms) => {
      if (fromCms.length) setPosts(fromCms);
    });
  }, []);
  const sorted = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="container py-16">
      <header className="max-w-3xl">
        <p className="uppercase tracking-widest text-xs text-muted-foreground">Journal</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Thoughts</h1>
        <p className="mt-3 text-muted-foreground">A small journal of short-form posts.</p>
      </header>

      <section className="mt-10">
        <div>
          <ul className="space-y-6">
            {sorted.map((post, idx) => (
              <motion.li key={post.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }} className="rounded-xl border p-6 bg-card">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{new Date(post.date).toLocaleString()}</p>
                <p className="mt-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
