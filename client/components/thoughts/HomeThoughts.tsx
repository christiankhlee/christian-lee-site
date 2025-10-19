import { useEffect, useMemo, useState } from "react";

export type Post = { id: string; title: string; content: string; date: string };
const STORAGE_KEY = "thoughtsPosts";

export default function HomeThoughts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPosts(JSON.parse(saved) as Post[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const recent = useMemo(() => posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3), [posts]);

  if (recent.length === 0) {
    return (
      <p className="mt-6 text-muted-foreground">
        No posts yet. <a className="underline hover:text-primary" href="/thoughts">Write your first thought →</a>
      </p>
    );
  }

  return (
    <ul className="mt-8 grid md:grid-cols-3 gap-6">
      {recent.map((post) => (
        <li key={post.id} className="rounded-xl border p-6 bg-card">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</p>
          <p className="mt-3 text-sm text-muted-foreground">{post.content.length > 220 ? post.content.slice(0, 220) + "…" : post.content}</p>
        </li>
      ))}
    </ul>
  );
}
