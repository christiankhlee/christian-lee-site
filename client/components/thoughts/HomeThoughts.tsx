import { useEffect, useMemo, useState } from "react";

import { curatedPosts, type Post } from "@/components/thoughts/data";
import { fetchBuilderPosts } from "@/components/thoughts/api";

export default function HomeThoughts() {
  const [posts, setPosts] = useState<Post[]>(curatedPosts);
  useEffect(() => {
    fetchBuilderPosts(3).then((fromCms) => {
      if (fromCms.length) setPosts(fromCms);
    });
  }, []);
  const recent = posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

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
