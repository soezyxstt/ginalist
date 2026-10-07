"use client";

import { useEffect, useRef, useState } from "react";

type Player = { playVideo(): void; pauseVideo(): void; mute(): void; destroy(): void; getIframe(): HTMLIFrameElement };
type YouTubeAPI = { Player: new (element: HTMLElement, options: { videoId: string; playerVars: Record<string, string | number>; events: { onReady(): void; onStateChange(event: { data: number }): void; onError(): void } }) => Player };
declare global {
  interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void }
}
let apiReady: Promise<YouTubeAPI> | undefined;

function loadAPI() {
  return apiReady ??= new Promise<YouTubeAPI>((resolve, reject) => {
    if (window.YT?.Player) { resolve(window.YT); return; }
    window.onYouTubeIframeAPIReady = () => { if (window.YT) resolve(window.YT); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => reject(new Error("YouTube player unavailable"));
    document.head.append(script);
  });
}

export function YouTubeBackground({ id, active, onPlayingChange }: { id: string; active: boolean; onPlayingChange: (playing: boolean) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    void loadAPI().then(api => {
      if (disposed || !container.current) return;
      const mount = document.createElement("div");
      container.current.append(mount);
      player.current = new api.Player(mount, {
        videoId: id,
        playerVars: { autoplay: 0, mute: 1, controls: 0, loop: 1, playlist: id, start: 20, end: 85, playsinline: 1, rel: 0, disablekb: 1, cc_load_policy: 0, origin: window.location.origin },
        events: {
          onReady: () => {
            player.current?.mute();
            const iframe = player.current?.getIframe();
            if (iframe) { iframe.title = "Gina’s fashion video"; iframe.tabIndex = -1; }
            setReady(true);
          },
          onStateChange: event => onPlayingChange(event.data === 1),
          onError: () => setFailed(true),
        },
      });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; player.current?.destroy(); player.current = null; };
  }, [id, onPlayingChange]);

  useEffect(() => {
    const element = container.current;
    if (!ready || !element) return;
    if (!active) { player.current?.pauseVideo(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) player.current?.playVideo();
      else player.current?.pauseVideo();
    }, { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, ready]);

  return <><div ref={container} className="youtube-background" />{failed && <a className="video-fallback" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>}</>;
}
