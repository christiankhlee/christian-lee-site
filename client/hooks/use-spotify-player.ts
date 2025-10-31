import { useEffect, useRef, useState } from "react";

interface SpotifyPlayer {
  addListener: (event: string, callback: Function) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<any>;
  getVolume: () => Promise<number>;
  pause: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: { Player: any };
  }
}

export function useSpotifyPlayer() {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;

    // Load Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify!.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      player.addListener("player_state_changed", (state) => {
        if (state) {
          setIsPlaying(!state.paused);
        }
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
      playerRef.current = player;
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, []);

  const playTrack = async (trackUri: string) => {
    if (!playerRef.current || !deviceId) return;

    try {
      const token = localStorage.getItem("spotify_access_token");
      if (!token) return;

      // Play track using Spotify API
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [trackUri] }),
        },
      );
    } catch (err) {
      console.error("Play error:", err);
    }
  };

  const pause = async () => {
    if (!playerRef.current) return;
    try {
      await playerRef.current.pause();
    } catch (err) {
      console.error("Pause error:", err);
    }
  };

  const resume = async () => {
    if (!playerRef.current) return;
    try {
      await playerRef.current.togglePlay();
    } catch (err) {
      console.error("Resume error:", err);
    }
  };

  return {
    isReady,
    isPlaying,
    deviceId,
    playTrack,
    pause,
    resume,
  };
}
