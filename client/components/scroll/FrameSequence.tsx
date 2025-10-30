import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const baseUrl = "https://www.adaline.ai/sequence/16x9_281/high/graded_4K_100_gm_85_1440_3-";

function pad(num: number, size = 3) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}

export default function FrameSequence() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef({ frame: 0 });
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate frame URLs (1-280)
    const imageUrls = Array.from({ length: 280 }, (_, i) =>
      `${baseUrl}${pad(i + 1, 3)}.jpg`
    );

    // Preload all images
    const loadImages = async () => {
      const images = await Promise.all(
        imageUrls.map(
          (url) =>
            new Promise<HTMLImageElement | null>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              img.src = url;
            })
        )
      );
      return images.filter(Boolean) as HTMLImageElement[];
    };

    // Draw frame to canvas with device pixel ratio
    const drawFrame = (i: number) => {
      const img = imagesRef.current[i];
      if (!img) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw image to fill canvas while preserving aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = rect.width / rect.height;

      let drawWidth = rect.width;
      let drawHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        // Image is wider, fit to height
        drawWidth = rect.height * imgAspect;
        offsetX = (rect.width - drawWidth) / 2;
      } else {
        // Image is taller, fit to width
        drawHeight = rect.width / imgAspect;
        offsetY = (rect.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Initialize animation
    (async () => {
      imagesRef.current = await loadImages();

      if (imagesRef.current.length === 0) {
        console.error("No images loaded");
        return;
      }

      // Draw first frame
      drawFrame(0);

      // Create GSAP timeline tied to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(frameRef.current, {
        frame: Math.max(0, imagesRef.current.length - 1),
        ease: "none",
        onUpdate: () => {
          const i = Math.round(frameRef.current.frame);
          if (i >= 0 && i < imagesRef.current.length) {
            drawFrame(i);
          }
        },
      });

      // Handle resize
      const handleResize = () => {
        const i = Math.round(frameRef.current.frame);
        drawFrame(i);
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    })();
  }, []);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <canvas
        ref={canvasRef}
        className="sticky top-0 w-full h-screen bg-black block"
      />
    </div>
  );
}
