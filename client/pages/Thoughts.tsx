import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Post = { id: string; title: string; content: string; date: string };

export default function Thoughts() {
  const curated: Post[] = [
    {
      id: "sample-1",
      title: "On building playful web experiences",
      content:
        "Exploring motion, sound, and micro-interactions to make the web feel alive. Lately I’ve been leaning into scroll-driven timelines and small details that reward curiosity.",
      date: new Date().toISOString(),
    },
    {
      id: "sample-2",
      title: "Notes from a winter walk",
      content:
        "Cold air, quiet streets, and the kind of light that makes colors hum. A reminder to design with more space and patience.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: "sample-3",
      title: "Tools I’m enjoying right now",
      content:
        "Framer Motion for timing, Tailwind for speed, and a simple content pipeline to keep ideas flowing.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
  ];
  const sorted = curated.sort((a, b) => (a.date < b.date ? 1 : -1));

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
