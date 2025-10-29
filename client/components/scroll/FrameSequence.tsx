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
      const clamped = Math.min(Math.max(Math.round(frameRef.current), 0), sources.length - 1);
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
    const scrollState = { frame: 0 };

    const ctx = gsap.context(() => {
      // Single timeline with both animations
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${frameCount * 12}px`,
          scrub: 1,
          onUpdate(trigger) {
            const progress = trigger.progress;
            scrollState.frame = progress * (frameCount - 1);
            frameRef.current = scrollState.frame;
            container.style.setProperty("--progress", String(progress));

            // Apply zoom out effect directly via style
            const scaleValue = 1 - (0.15 * progress);
            container.style.transform = `scale(${scaleValue})`;

            render();
          },
        },
      })
      .to(scrollState, { frame: frameCount - 1, ease: "none" }, 0);
    }, container);

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      try {
        ctx.revert();
      } catch (e) {
        // Ignore cleanup errors
      }
      try {
        gsap.set(container, { clearProps: "all" });
      } catch (e) {
        // Ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join("|"), height]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, transformOrigin: "center center" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
}
