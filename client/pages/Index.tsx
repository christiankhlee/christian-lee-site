import { motion } from "framer-motion";
import FrameSequence from "@/components/scroll/FrameSequence";
import HomeThoughts from "@/components/thoughts/HomeThoughts";
import Collage from "@/components/about/Collage";

export default function Index() {
  return (
    <div id="home" className="relative">
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Exploring ideas through design, code, and creativity
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="px-6 py-3 rounded-md border hover:bg-muted transition"
            >
              About me
            </a>
            <a
              href="#thoughts"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Explore
            </a>
          </div>
        </div>
      </section>

      <FrameSequence height="100vh">
        <div className="h-full w-full grid place-items-center px-4">
          <div
            className="max-w-3xl w-full p-6 md:p-10"
            style={{
              opacity: "calc(0.95 - var(--progress) * 0.6)",
              transform: "translate3d(0, calc(var(--progress) * -40px), 0)",
            }}
          >
            <h1 className="hero-serif mt-4 text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-[-0.03em] text-shadow-soft">
              <span className="italic font-sans text-[#F5F7FA] inline-block mr-7">
                Christian Lee
              </span>
              <span className="block font-sans italic font-extrabold opacity-95 text-[50px] leading-[1.05]">
                A place for what I'm working on and thinking about.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 italic">
              Projects, notes, and ideas in progress.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#about"
                className="px-5 py-3 rounded-md border hover:bg-muted transition"
              >
                About me
              </a>
              <a
                href="#thoughts"
                className="px-5 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Thoughts
              </a>
            </div>
          </div>
        </div>
      </FrameSequence>

      {/* About */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="container grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-12">
            <h2 className="text-3xl md:text-4xl font-bold">About</h2>
            <p className="mt-4 text-muted-foreground">
              I like expressing ideas through things I make. Always learning,
              curating, and creating along the way.
            </p>
            <Collage />
          </div>
        </div>
      </section>

      {/* Thoughts preview */}
      <section id="thoughts" className="relative py-24 md:py-32">
        <div className="container">
          <header className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="uppercase tracking-widest text-xs text-muted-foreground">
                Journal
              </p>
              <h2 className="mt-1 text-3xl md:text-4xl font-bold">
                Latest Thoughts
              </h2>
            </div>
            <a
              href="/thoughts"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              View all →
            </a>
          </header>
          <HomeThoughts />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative py-24 md:py-32">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Let's build something great
            </h2>
            <p className="mt-4 text-muted-foreground">
              Have a project in mind or want to say hello? I'm always open to
              collaborating.
            </p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <form className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="h-11 rounded-md border px-3 bg-background"
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="h-11 rounded-md border px-3 bg-background"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="min-h-[120px] rounded-md border p-3 bg-background"
                  placeholder="Tell me about your project"
                />
              </div>
              <button className="mt-2 h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
