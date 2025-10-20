export type Post = { id: string; title: string; content: string; date: string };

export const curatedPosts: Post[] = [
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
