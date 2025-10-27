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
  base?: string; // e.g. https://.../3-
  start?: number;
  end?: number; // inclusive when using base
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

  const sources = useMemo(() => {
    if (externalSources && externalSources.length) return externalSources;
    if (!base || !end) return [] as string[];
    const srcs: string[] = [];
    for (let i = start; i <= end; i++) srcs.push(`${base}${pad(i, padSize)}.jpg`);
    return srcs;
  }, [externalSources && externalSources.join("|"), base, start, end, padSize]);

  useEffect(() => {
    if (!sources.length) return; // nothing to render until frames available
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      for (let i = idx; i <= Math.min(idx + ahead, sources.length - 1); i++) loadIndex(i);
    };

    ensureAhead(0, 16); // prime initial frames

    const render = () => {
      const clamped = Math.min(Math.max(frameRef.current, 0), sources.length - 1);
      const image = imagesRef.current[clamped];
      ensureAhead(clamped);
      if (!image) return;
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      // cover behavior
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = Math.max(width / iw, height / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (width - dw) / 2;
      const dy = (height - dh) / 2;
      context.drawImage(image, dx, dy, dw, dh);
    };


    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const state = { frame: 0, zoom: 1.12 };
      if (prefersReduced) {
        frameRef.current = 0;
        render();
        return;
      }
      const frameCount = sources.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${frameCount * 6}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Store reference to trigger for cleanup
            if (containerRef.current) {
              (containerRef.current as any).__scrollTrigger = self;
            }
          },
        },
        onUpdate: () => {
          frameRef.current = Math.round(state.frame);
          const progress = frameCount > 1 ? frameRef.current / (frameCount - 1) : 0;
          const el = containerRef.current as HTMLElement | null;
          if (el) el.style.setProperty("--progress", String(progress));
          render();
        },
      });

      tl.to(state, { frame: Math.max(frameCount - 1, 0), ease: "none" }, 0)
        .to(
          state,
          {
            zoom: 1,
            ease: "none",
            onUpdate: () => {
              const c = canvasRef.current;
              if (!c) return;
              const ctx2 = c.getContext("2d");
              if (!ctx2) return;
              const img = imagesRef.current[Math.min(Math.round(state.frame), imagesRef.current.length - 1)];
              if (!img) return;
              const { width, height } = c.getBoundingClientRect();
              ctx2.clearRect(0, 0, width, height);
              const iw = img.naturalWidth;
              const ih = img.naturalHeight;
              const scale = Math.max(width / iw, height / ih) * state.zoom;
              const dw = iw * scale;
              const dh = ih * scale;
              const dx = (width - dw) / 2;
              const dy = (height - dh) / 2;
              ctx2.drawImage(img, dx, dy, dw, dh);
            },
          },
          0
        );
    }, containerRef);

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      try {
        // Revert context first (this kills timelines and clears internal state)
        ctx.revert();
      } catch (e) {
        // Ignore errors during context revert
      }

      try {
        // Then kill all ScrollTrigger instances for this container
        ScrollTrigger.getAll().forEach(trigger => {
          try {
            if (trigger.trigger === containerRef.current) {
              trigger.kill(true);
            }
          } catch (e) {
            // Continue with next trigger
          }
        });
      } catch (e) {
        // Ignore errors during ScrollTrigger cleanup
      }

      // Clear any inline styles and references
      if (containerRef.current) {
        try {
          gsap.set(containerRef.current, { clearProps: "all" });
        } catch (e) {
          // Ignore
        }
        delete (containerRef.current as any).__scrollTrigger;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join("|")]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute inset-0 z-10">
        {children}
      </div>
    </div>
  );
}
