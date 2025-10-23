import { PropsWithChildren, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Layout({ children }: PropsWithChildren) {
  const { scrollYProgress, scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 100);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-40 origin-left"
        style={{
          scaleX,
          background:
            "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
        }}
      />

      <motion.header
        className="fixed z-30 left-1/2"
        style={{
          top: headerTop,
          width: headerWidth,
          borderRadius: headerBorderRadius,
          x: headerX,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 group">
            <span className="relative grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary text-white font-bold">
              CL
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a
              href="/thoughts"
              className="hover:text-primary transition-colors"
            >
              Thoughts
            </a>
            <a href="/music" className="hover:text-primary transition-colors">
              Music
            </a>
            <a
              href="/moodboard"
              className="hover:text-primary transition-colors"
            >
              Moodboard
            </a>
            <a
              href="/#contact"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Get in touch
            </a>
          </nav>
        </div>
      </motion.header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="border-t">
        <div className="container py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Christian Lee. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hover:text-primary transition-colors">
              Email
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
