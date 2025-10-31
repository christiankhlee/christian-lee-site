import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameSequence from "@/components/scroll/FrameSequence";
import HomeThoughts from "@/components/thoughts/HomeThoughts";
import Collage from "@/components/about/Collage";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textOverlayRef.current || !homeRef.current) return;

    // Set initial opacity to 1
    gsap.set(textOverlayRef.current, { opacity: 1 });

    // Animate text opacity based on scroll progress
    gsap.to(textOverlayRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: homeRef.current,
        start: "top top",
        end: "30% top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      gsap.killTweensOf(textOverlayRef.current);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === homeRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div id="home" ref={homeRef} className="relative">
      <div className="relative">
        <FrameSequence
          videoUrl="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Ff336bae09f8a43599dfb14b58dd7a992?alt=media&token=20691e2c-4a61-4cbb-b0f4-45f50a0d4957&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          frameCount={60}
          onLoadingProgress={(progress) => {
            setLoadingProgress(progress);
            if (progress >= 100) {
              setTimeout(() => setIsLoading(false), 300);
            }
          }}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-100 transition-opacity duration-300">
          <div className="max-w-xs w-full px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Loading</h2>
            <div className="w-full bg-sky-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-center text-slate-700 mt-4 text-sm font-medium">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}

      {/* Welcome Text Overlay */}
      <div
        ref={textOverlayRef}
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-4 z-20"
      >
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white drop-shadow-lg">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-lg mb-8">
            Exploring ideas through design, code, and creativity
          </p>
          <div className="flex flex-wrap justify-center gap-4 pointer-events-auto">
            <a
              href="#about"
              className="px-6 py-3 rounded-md border border-white text-white hover:bg-white hover:text-black transition"
            >
              About me
            </a>
            <a
              href="#thoughts"
              className="px-6 py-3 rounded-md bg-white text-black hover:opacity-90 transition"
            >
              Explore
            </a>
          </div>
        </div>
      </div>

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
