import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import FrameSequence from "@/components/scroll/FrameSequence";
import { useVideoFrames } from "@/hooks/use-video-frames";
import HomeThoughts from "@/components/thoughts/HomeThoughts";
import Collage from "@/components/about/Collage";

export default function Index() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), { stiffness: 100, damping: 30 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), { stiffness: 100, damping: 30 });
  const opacityHero = useTransform(scrollYProgress, [0, 0.25], [1, 0.2]);

  const { frames, progress } = useVideoFrames(
    "https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fb86f89911b6541dab8288933641cfa21?alt=media&token=ba408b13-79e9-49bc-82da-60fbedc1b47f&apiKey=9a64d775673a4d3c908c6d11727a9c4b",
    { count: 280, targetWidth: 1440, quality: 0.85 }
  );

  return (
    <div ref={containerRef} id="home" className="relative">
      <FrameSequence sources={frames} height="100vh">
        {frames.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            Preparing frames… {Math.round(progress * 100)}%
          </div>
        )}
        <div className="h-full w-full grid place-items-center px-4">
          <div
            className="max-w-3xl w-full rounded-2xl border border-white/20 bg-white/10 supports-[backdrop-filter]:bg-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-6 md:p-10"
            style={{ opacity: "calc(0.95 - var(--progress) * 0.6)", transform: "translate3d(0, calc(var(--progress) * -40px), 0)" }}
          >
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold leading-[1.05]">
              <span className="gradient-text">Christian Lee</span>
              <p>A place for what I’m working on and thinking about.</p>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              Projects, notes, and ideas in progress.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#about" className="px-5 py-3 rounded-md border hover:bg-muted transition">About me</a>
              <a href="#thoughts" className="px-5 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Thoughts</a>
            </div>
          </div>
        </div>
      </FrameSequence>

      {/* Decorative gradients */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed -z-10 inset-0"
        style={{ opacity: 0.6 }}
      >
        <motion.div
          className="absolute top-[-10%] left-[-10%] h-[50vmax] w-[50vmax] rounded-full blur-3xl"
          style={{ y: y1, background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--primary) / 0.25) 0%, transparent 60%)" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] h-[55vmax] w-[55vmax] rounded-full blur-3xl"
          style={{ y: y2, background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--secondary) / 0.25) 0%, transparent 60%)" }}
        />
      </motion.div>


      {/* About */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="container grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-12">
            <h2 className="text-3xl md:text-4xl font-bold">About</h2>
            <p className="mt-4 text-muted-foreground">
              I like expressing ideas through things I make. Always learning, curating, and creating along the way.
            </p>
            <Collage />
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>• Frontend: React, TypeScript, Tailwind, Framer Motion</li>
              <li>• Backend: Node, Express</li>
              <li>• Tools: Vite, Vitest</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Thoughts preview */}
      <section id="thoughts" className="relative py-24 md:py-32">
        <div className="container">
          <header className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="uppercase tracking-widest text-xs text-muted-foreground">Journal</p>
              <h2 className="mt-1 text-3xl md:text-4xl font-bold">Latest Thoughts</h2>
            </div>
            <a href="/thoughts" className="text-sm text-muted-foreground hover:text-primary transition-colors">View all →</a>
          </header>
          <HomeThoughts />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24 md:py-32">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Let’s build something great</h2>
            <p className="mt-4 text-muted-foreground">Have a project in mind or want to say hello? I’m always open to collaborating.</p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <form className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm">Name</label>
                <input id="name" name="name" className="h-11 rounded-md border px-3 bg-background" placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm">Email</label>
                <input id="email" name="email" type="email" className="h-11 rounded-md border px-3 bg-background" placeholder="you@example.com" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm">Message</label>
                <textarea id="message" name="message" className="min-h-[120px] rounded-md border p-3 bg-background" placeholder="Tell me about your project" />
              </div>
              <button className="mt-2 h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">Send</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
