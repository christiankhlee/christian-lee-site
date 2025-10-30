import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameSequence from "@/components/scroll/FrameSequence";
import HomeThoughts from "@/components/thoughts/HomeThoughts";
import Collage from "@/components/about/Collage";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textOverlayRef.current) return;

    const handleScrollTriggerCreate = (scrollTrigger: ScrollTrigger.ScrollTrigger) => {
      // Animate text opacity based on scroll progress
      gsap.to(textOverlayRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: textOverlayRef.current?.parentElement,
          start: "top top",
          end: "center center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    };

    // Store reference for cleanup
    const currentOverlay = textOverlayRef.current;

    return () => {
      // Cleanup animations
      if (currentOverlay) {
        gsap.killTweensOf(currentOverlay);
      }
    };
  }, []);

  return (
    <div id="home" className="relative">
      <div className="relative">
        <FrameSequence
          videoUrl="https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fe7cdd66a333b4617920f0ec14dc19c0c?alt=media&token=b21127a3-9fc3-4788-aef9-f510364e91f1&apiKey=9a64d775673a4d3c908c6d11727a9c4b"
          frameCount={120}
        />

        {/* Welcome Text Overlay */}
        <div
          ref={textOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none"
          style={{ top: 0, zIndex: 10 }}
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
