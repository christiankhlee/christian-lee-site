import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      console.error("Spotify auth error:", error);
      navigate("/music");
      return;
    }

    if (!code) {
      navigate("/music");
      return;
    }

    // Exchange code for access token
    (async () => {
      try {
        const response = await fetch("/api/spotify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) throw new Error("Token exchange failed");
        const { access_token, refresh_token, expires_in } = await response.json();

        // Store tokens
        localStorage.setItem("spotify_access_token", access_token);
        if (refresh_token) localStorage.setItem("spotify_refresh_token", refresh_token);
        localStorage.setItem("spotify_token_expiry", String(Date.now() + expires_in * 1000));

        navigate("/music");
      } catch (err) {
        console.error("Token exchange error:", err);
        navigate("/music");
      }
    })();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Connecting to Spotify...</p>
    </div>
  );
}
