"use client";
import { useEffect, useRef, useState } from "react";
import { SpinEvent, SpinItem } from "../types";
export const SPIN_MS = 6000;
export function useRandomPoolOverlay(configId: string, key: string) {
  const activeAudio = useRef<HTMLAudioElement[]>([]);
  const [event, setEvent] = useState<SpinEvent | null>(null);
  const [current, setCurrent] = useState<SpinItem | null>(null);
  const [landed, setLanded] = useState(false);
  const [available, setAvailable] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const bodyBackground = document.body.style.background;
    const htmlBackground = document.documentElement.style.background;
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    return () => {
      document.body.style.background = bodyBackground;
      document.documentElement.style.background = htmlBackground;
    };
  }, []);
  useEffect(() => {
    const source = new EventSource(
      `/api/v1/random-pool/overlay/${configId}?key=${encodeURIComponent(key)}`,
    );
    const seen = new Set<string>();
    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false); // EventSource reconnects with its built-in retry.
    source.addEventListener("pool-state", (message) => {
      const state = JSON.parse((message as MessageEvent).data);
      const ready = state.enabled && state.pool_state === "READY";
      setAvailable(ready);
      if (!ready) {
        setEvent(null);
        setCurrent(null);
      }
    });
    source.addEventListener("pool-result", (message) => {
      const result = JSON.parse((message as MessageEvent).data) as SpinEvent;
      if (
        !result.jobId ||
        !result.item?.id ||
        !result.pool?.length ||
        seen.has(result.jobId)
      )
        return;
      seen.add(result.jobId);
      if (seen.size > 500) seen.delete(seen.values().next().value!);
      setAvailable(true);
      setStarted(false);
      setLanded(false);
      setCurrent(result.pool[0]);
      setEvent(result);
    });
    return () => source.close();
  }, [configId, key]);
  useEffect(() => {
    if (!event) return;
    let disposed = false;
    let frame = 0;
    let resultAudio: HTMLAudioElement | null = null;
    let soundTimer: ReturnType<typeof setTimeout> | undefined;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    const spinAudio = event.spin_sound_url
      ? new Audio(event.spin_sound_url)
      : null;
    if (spinAudio) spinAudio.loop = true;
    activeAudio.current = spinAudio ? [spinAudio] : [];
    const begin = performance.now();
    function play(audio: HTMLAudioElement | null) {
      if (audio)
        void audio.play().catch(() => {
          if (!disposed) setAudioBlocked(true);
        });
    }
    play(spinAudio);
    function animate(now: number) {
      if (disposed) return;
      setStarted(true);
      const progress = Math.min(1, (now - begin) / SPIN_MS);
      const step = Math.floor(60 * (1 - Math.pow(1 - progress, 3)));
      setCurrent(
        progress === 1 ? event!.item : event!.pool[step % event!.pool.length],
      );
      if (progress < 1) frame = requestAnimationFrame(animate);
      else {
        spinAudio?.pause();
        setLanded(true);
        const hold = new Promise<void>((resolve) => {
          holdTimer = setTimeout(resolve, 2000);
        });
        const sound = new Promise<void>((resolve) => {
          if (!event!.result_sound_url) return resolve();
          resultAudio = new Audio(event!.result_sound_url);
          activeAudio.current = [resultAudio];
          resultAudio.onended = () => resolve();
          resultAudio.onerror = () => resolve();
          soundTimer = setTimeout(() => {
            resultAudio?.pause();
            resolve();
          }, 15500);
          void resultAudio.play().catch(() => {
            if (!disposed) setAudioBlocked(true);
            resolve();
          });
        });
        void Promise.all([hold, sound]).then(async () => {
          if (disposed) return;
          // Retry the same idempotent ACK when a short network outage occurs.
          for (let attempt = 0; attempt < 3 && !disposed; attempt++) {
            try {
              const response = await fetch(
                `/api/v1/random-pool/overlay/${configId}/ack?key=${encodeURIComponent(key)}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ jobId: event!.jobId }),
                },
              );
              if (response.ok) break;
            } catch {
              /* Retry below; server timeout also releases a disconnected overlay. */
            }
          }
          if (!disposed) {
            setEvent(null);
            setCurrent(null);
          }
        });
      }
    }
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(animate);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(soundTimer);
      clearTimeout(holdTimer);
      spinAudio?.pause();
      resultAudio?.pause();
      activeAudio.current = [];
    };
  }, [event, configId, key]);
  return {
    event,
    current,
    landed,
    available,
    audioBlocked,
    connected,
    started,
    enableAudio: () => {
      void Promise.all(activeAudio.current.map((audio) => audio.play()))
        .then(() => setAudioBlocked(false))
        .catch(() => setAudioBlocked(true));
    },
  };
}
