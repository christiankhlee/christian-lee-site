import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import FrameSequence from "@/components/scroll/FrameSequence";
import { useVideoFrames } from "@/hooks/use-video-frames";

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
            <p className="text-sm uppercase tracking-widest text-white/80">Christian Lee — Personal Site</p>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold leading-[1.05]">
              <span className="gradient-text">Creative Developer</span> crafting dynamic, scroll-driven web experiences.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80">
              I build fast, beautiful interfaces that tell stories as you scroll. Explore my work and get in touch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="px-5 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">See my work</a>
              <a href="#about" className="px-5 py-3 rounded-md border hover:bg-muted transition">About me</a>
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
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-bold">About</h2>
            <p className="mt-4 text-muted-foreground">
              I’m a software engineer focused on delightful product experiences. My work blends motion, performance, and accessibility.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>• Frontend: React, TypeScript, Tailwind, Framer Motion</li>
              <li>�� Backend: Node, Express</li>
              <li>• Tools: Vite, Vitest</li>
            </ul>
          </div>
          <div className="md:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Performance", desc: "Ship fast sites that feel instant." },
                { title: "Motion", desc: "Use motion to guide and delight." },
                { title: "Accessibility", desc: "Inclusive by default." },
                { title: "Craft", desc: "Pixel-perfect, production-ready." },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl border bg-card p-6 hover:shadow-lg/40 shadow-sm transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="relative py-24 md:py-32">
        <div className="container">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Selected Work</h2>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Available for new projects →</a>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map((i) => (
              <motion.article
                key={i}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/15 to-secondary/15" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Project {i}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">A dynamic, scroll-driven experience showcasing interaction and motion.</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-muted">React</span>
                    <span className="px-2 py-0.5 rounded bg-muted">TypeScript</span>
                    <span className="px-2 py-0.5 rounded bg-muted">Framer Motion</span>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(60% 50% at 50% 50%, hsl(var(--primary)/0.15), transparent 70%)" }} />
              </motion.article>
            ))}
          </div>
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
