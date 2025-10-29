import { useEffect, useMemo, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function pad(num: number, size = 3) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

export default function FrameSequence({
  sources: externalSources,
  base,
  start = 1,
  end,
  padSize = 3,
  height = "100vh",
  className = "",
  children,
}: {
  sources?: string[];
  base?: string;
  start?: number;
  end?: number;
  padSize?: number;
  height?: string | number;
  className?: string;
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadingRef = useRef<Set<number>>(new Set());
  const loadedRef = useRef<Set<number>>(new Set());
  const frameRef = useRef(0);
  const contextRef = useRef<gsap.Context | null>(null);

  const sources = useMemo(() => {
    if (externalSources && externalSources.length) return externalSources;
    if (!base || !end) return [] as string[];
    const srcs: string[] = [];
    for (let i = start; i <= end; i++) srcs.push(`${base}${pad(i, padSize)}.jpg`);
    return srcs;
  }, [externalSources && externalSources.join("|"), base, start, end, padSize]);

  useEffect(() => {
    if (!sources.length) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    imagesRef.current = new Array(sources.length).fill(null);
    loadedRef.current = new Set();
    loadingRef.current = new Set();

    const loadIndex = (idx: number) => {
      if (idx < 0 || idx >= sources.length) return;
      if (loadedRef.current.has(idx) || loadingRef.current.has(idx)) return;
      loadingRef.current.add(idx);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imagesRef.current[idx] = img;
        loadedRef.current.add(idx);
        loadingRef.current.delete(idx);
        if (loadedRef.current.size === 1) setCanvasSize();
        render();
      };
      img.src = sources[idx];
    };

    const ensureAhead = (idx: number, ahead = 12) => {
      for (let i = idx; i <= Math.min(idx + ahead, sources.length - 1); i++) {
        loadIndex(i);
      }
    };

    ensureAhead(0, 16);

    const render = () => {
      const clamped = Math.min(Math.max(frameRef.current, 0), sources.length - 1);
      const image = imagesRef.current[clamped];
      ensureAhead(clamped);
      if (!image) return;
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = Math.max(width / iw, height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (width - dw) / 2;
      const dy = (height - dh) / 2;
      context.drawImage(image, dx, dy, dw, dh);
    };

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      frameRef.current = 0;
      render();
      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);
      return () => window.removeEventListener("resize", setCanvasSize);
    }

    const frameCount = sources.length;
    const ctx = gsap.context(() => {
      gsap.to(container, {
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${frameCount * 8}px`,
          scrub: 1,
          markers: false,
          onUpdate: (self) => {
            const progress = self.getProgress();
            const targetFrame = progress * (frameCount - 1);
            frameRef.current = targetFrame;
            container.style.setProperty("--progress", String(progress));
            render();
          },
        },
        onUpdate: () => {
          render();
        },
      });
    }, container);

    contextRef.current = ctx;
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      try {
        ctx.revert();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === container) {
            trigger.kill(true);
          }
        });
      } catch (e) {
        // Ignore cleanup errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join("|")]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
}
