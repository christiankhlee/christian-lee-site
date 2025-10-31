import { useEffect, useMemo, useRef, useState } from "react";

export type UseVideoFramesOptions = {
  count?: number; // number of frames to extract
  targetWidth?: number; // scale frames to this width
  quality?: number; // jpeg quality 0-1
};

export function useVideoFrames(src: string, { count = 180, targetWidth = 1440, quality = 0.85 }: UseVideoFramesOptions = {}) {
  const [frames, setFrames] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const abortRef = useRef(new AbortController());

  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.src = src;
    video.muted = true;
    video.playsInline = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const extract = async () => {
      await video.play().catch(() => video.pause()); // touch decode pipeline
      video.pause();

      const dur = video.duration || 0;
      setDuration(dur);
      const times = new Array(count).fill(0).map((_, i) => (dur * i) / Math.max(count - 1, 1));

      const vw = video.videoWidth || 1920;
      const vh = video.videoHeight || 1080;
      const scale = targetWidth / vw;
      canvas.width = Math.round(vw * scale);
      canvas.height = Math.round(vh * scale);

      for (let i = 0; i < times.length; i++) {
        if (cancelled || controller.signal.aborted) break;
        const t = times[i];
        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                urlsRef.current.push(url);
                setFrames((prev) => [...prev, url]);
              }
              setProgress((i + 1) / times.length);
              resolve();
            }, "image/jpeg", quality);
            video.removeEventListener("seeked", onSeeked);
          };
          video.addEventListener("seeked", onSeeked, { once: true });
          video.currentTime = Math.min(Math.max(t, 0), dur || t);
        });
      }
    };

    const onLoaded = () => extract();
    video.addEventListener("loadedmetadata", onLoaded, { once: true });

    return () => {
      cancelled = true;
      controller.abort();
      video.removeEventListener("loadedmetadata", onLoaded);
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlsRef.current = [];
    };
  }, [src, count, targetWidth, quality]);

  return useMemo(() => ({ frames, progress, duration }), [frames, progress, duration]);
}
