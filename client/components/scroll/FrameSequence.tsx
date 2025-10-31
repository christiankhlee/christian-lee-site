import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FrameSequenceProps {
  videoUrl: string;
  frameCount?: number;
  onScrollTriggerCreate?: (trigger: ScrollTrigger.ScrollTrigger) => void;
  onLoadingProgress?: (progress: number) => void;
}

export default function FrameSequence({
  videoUrl = "https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fce5eb34491ca4386a46c5589c08835fb?alt=media&token=3db8a3c9-4918-455b-a29e-67f625cb36ea&apiKey=9a64d775673a4d3c908c6d11727a9c4b",
  frameCount = 180,
  onScrollTriggerCreate,
  onLoadingProgress,
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef({ frame: 0 });
  const framesRef = useRef<ImageData[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create hidden video element to extract frames
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.style.display = "none";
    document.body.appendChild(video);
    videoRef.current = video;

    // Extract frames from video
    const extractFrames = async () => {
      return new Promise<ImageData[]>((resolve, reject) => {
        video.onloadedmetadata = () => {
          const duration = video.duration;
          const frames: ImageData[] = [];
          let extracted = 0;

          // Set up temporary canvas for extraction
          const extractCanvas = document.createElement("canvas");
          const extractCtx = extractCanvas.getContext("2d");
          if (!extractCtx) {
            reject(new Error("Failed to get 2D context"));
            return;
          }

          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          extractCanvas.width = Math.round(rect.width * dpr);
          extractCanvas.height = Math.round(rect.height * dpr);
          extractCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

          const extractFrame = () => {
            if (extracted >= frameCount) {
              resolve(frames);
              return;
            }

            const time = (extracted / frameCount) * duration;
            video.currentTime = time;
          };

          video.onseeked = () => {
            // Draw video frame to extraction canvas
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const displayWidth = Math.round(rect.width * dpr);
            const displayHeight = Math.round(rect.height * dpr);

            extractCtx.clearRect(0, 0, rect.width, rect.height);

            const videoAspect = video.videoWidth / video.videoHeight;
            const canvasAspect = rect.width / rect.height;

            let drawWidth = rect.width;
            let drawHeight = rect.height;
            let offsetX = 0;
            let offsetY = 0;

            if (videoAspect > canvasAspect) {
              drawWidth = rect.height * videoAspect;
              offsetX = (rect.width - drawWidth) / 2;
            } else {
              drawHeight = rect.width / videoAspect;
              offsetY = (rect.height - drawHeight) / 2;
            }

            extractCtx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

            // Get full frame data and detect black bottom pixels
            const fullImageData = extractCtx.getImageData(0, 0, displayWidth, displayHeight);
            const data = fullImageData.data;

            // Find where the black pixels start from the bottom
            let blackRowsFromBottom = 0;
            const pixelsPerRow = displayWidth * 4;

            for (let row = displayHeight - 1; row >= 0; row--) {
              let isBlackRow = true;
              for (let i = 0; i < displayWidth; i++) {
                const pixelIndex = row * pixelsPerRow + i * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                // Check if pixel is mostly black (threshold: < 20)
                if (r > 20 || g > 20 || b > 20) {
                  isBlackRow = false;
                  break;
                }
              }
              if (isBlackRow) {
                blackRowsFromBottom++;
              } else {
                break;
              }
            }

            // Crop out the black rows
            const croppedHeight = Math.max(1, displayHeight - blackRowsFromBottom);
            const croppedImageData = extractCtx.createImageData(displayWidth, croppedHeight);
            croppedImageData.data.set(data.slice(0, displayWidth * croppedHeight * 4));

            frames.push(croppedImageData);

            extracted++;
            if (extracted < frameCount) {
              extractFrame();
            } else {
              resolve(frames);
            }
          };

          extractFrame();
        };

        video.onerror = () => {
          reject(new Error("Failed to load video"));
        };

        video.src = videoUrl;
      });
    };

    // Draw frame to canvas
    const drawFrame = (i: number) => {
      if (!framesRef.current[i]) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.putImageData(framesRef.current[i], 0, 0);
    };

    // Initialize animation
    (async () => {
      loadingRef.current = true;

      try {
        const frames = await extractFrames();
        framesRef.current = frames;
        loadingRef.current = false;

        if (frames.length === 0) {
          console.error("No frames extracted from video");
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

        // Call callback with the ScrollTrigger instance
        if (onScrollTriggerCreate && tl.scrollTrigger) {
          onScrollTriggerCreate(tl.scrollTrigger);
        }

        tl.to(frameRef.current, {
          frame: Math.max(0, frames.length - 1),
          ease: "none",
          onUpdate: () => {
            const i = Math.round(frameRef.current.frame);
            if (i >= 0 && i < frames.length) {
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
      } catch (error) {
        console.error("Frame extraction failed:", error);
      }
    })();

    return () => {
      if (videoRef.current?.parentNode) {
        videoRef.current.parentNode.removeChild(videoRef.current);
      }
    };
  }, [videoUrl, frameCount]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <canvas ref={canvasRef} className="sticky top-0 w-full h-screen bg-black block" />
    </div>
  );
}
