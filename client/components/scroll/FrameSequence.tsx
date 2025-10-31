import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FrameSequenceProps {
  videoUrl: string;
  frameCount?: number;
  onScrollTriggerCreate?: (trigger: ScrollTrigger.ScrollTrigger) => void;
  onLoadingProgress?: (progress: number) => void;
  onInitialFramesReady?: () => void;
}

// Load 25% of frames initially for quick interactivity
const INITIAL_BATCH_PERCENTAGE = 0.25;

export default function FrameSequence({
  videoUrl = "https://cdn.builder.io/o/assets%2F9a64d775673a4d3c908c6d11727a9c4b%2Fce5eb34491ca4386a46c5589c08835fb?alt=media&token=3db8a3c9-4918-455b-a29e-67f625cb36ea&apiKey=9a64d775673a4d3c908c6d11727a9c4b",
  frameCount = 180,
  onScrollTriggerCreate,
  onLoadingProgress,
  onInitialFramesReady,
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

    // Calculate initial batch size (25% of total frames)
    const initialBatchSize = Math.ceil(frameCount * INITIAL_BATCH_PERCENTAGE);
    let initialBatchReady = false;

    // Extract frames from video in two phases
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

            extractCtx.drawImage(
              video,
              offsetX,
              offsetY,
              drawWidth,
              drawHeight,
            );

            // Get frame data directly without black pixel detection
            const imageData = extractCtx.getImageData(
              0,
              0,
              displayWidth,
              displayHeight,
            );
            frames.push(imageData);

            extracted++;

            // Report progress
            if (onLoadingProgress) {
              const progress = Math.min((extracted / frameCount) * 100, 100);
              onLoadingProgress(progress);
            }

            // Call onInitialFramesReady after initial batch
            if (extracted === initialBatchSize && !initialBatchReady) {
              initialBatchReady = true;
              if (onInitialFramesReady) {
                onInitialFramesReady();
              }
            }

            if (extracted < frameCount) {
              // Defer extraction with requestAnimationFrame to keep UI responsive
              requestAnimationFrame(() => extractFrame());
            } else {
              resolve(frames);
            }
          };

          requestAnimationFrame(() => extractFrame());
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
    let timelineRef: gsap.core.Timeline | null = null;
    let resizeHandlerAdded = false;

    const setupAnimation = () => {
      if (timelineRef || framesRef.current.length === 0) return;

      // Draw first frame
      drawFrame(0);

      // Create GSAP timeline tied to scroll
      timelineRef = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Call callback with the ScrollTrigger instance
      if (onScrollTriggerCreate && timelineRef.scrollTrigger) {
        onScrollTriggerCreate(timelineRef.scrollTrigger);
      }

      timelineRef.to(frameRef.current, {
        frame: Math.max(0, frameCount - 1),
        ease: "none",
        onUpdate: () => {
          const i = Math.round(frameRef.current.frame);
          // Use the closest available frame if the exact frame isn't loaded yet
          if (i >= 0 && i < framesRef.current.length) {
            drawFrame(i);
          } else if (framesRef.current.length > 0) {
            // Use last available frame if we're trying to access beyond what's loaded
            drawFrame(Math.min(i, framesRef.current.length - 1));
          }
        },
      });

      // Handle resize
      if (!resizeHandlerAdded) {
        const handleResize = () => {
          const i = Math.round(frameRef.current.frame);
          const frameIndex = Math.min(i, framesRef.current.length - 1);
          if (frameIndex >= 0) {
            drawFrame(frameIndex);
          }
          ScrollTrigger.refresh();
        };

        window.addEventListener("resize", handleResize);
        resizeHandlerAdded = true;
      }
    };

    (async () => {
      loadingRef.current = true;

      try {
        // Start frame extraction (will call onInitialFramesReady after initial batch)
        const extractionPromise = extractFrames();

        // Wait for initial batch to be ready
        await new Promise<void>((resolve) => {
          const checkInitialBatch = setInterval(() => {
            if (framesRef.current.length >= initialBatchSize) {
              clearInterval(checkInitialBatch);
              resolve();
            }
          }, 50);
        });

        // Set up animation with initial frames
        setupAnimation();
        loadingRef.current = false;

        // Continue loading remaining frames in background
        await extractionPromise;

        // All frames loaded - animation will automatically use them
        console.log("All frames loaded:", framesRef.current.length);
      } catch (error) {
        console.error("Frame extraction failed:", error);
      }
    })();

    return () => {
      if (videoRef.current?.parentNode) {
        videoRef.current.parentNode.removeChild(videoRef.current);
      }
      if (timelineRef) {
        timelineRef.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [
    videoUrl,
    frameCount,
    onScrollTriggerCreate,
    onLoadingProgress,
    onInitialFramesReady,
  ]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <canvas
        ref={canvasRef}
        className="sticky top-0 w-full h-screen bg-black block"
      />
    </div>
  );
}
