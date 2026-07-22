"use client"

import { useEffect, useRef, useState } from "react";
import { CanvasPlayElement, CanvasPlayEvent } from "@/features/canvas/types";
import { getTransitionClass } from "@/lib/canvas/transitions";

const PRELOAD_TIMEOUT_MS = 3000;

function preloadMedia(el: CanvasPlayElement): Promise<void> {
    const mediaUrl = el.media_url;
    if (!mediaUrl || el.type === "text") return Promise.resolve();

    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        const timeout = setTimeout(finish, PRELOAD_TIMEOUT_MS);

        if (el.type === "image") {
            const img = new window.Image();
            img.onload = () => { clearTimeout(timeout); finish(); };
            img.onerror = () => { clearTimeout(timeout); finish(); };
            img.src = mediaUrl;
        } else {
            const media = document.createElement(el.type === "video" ? "video" : "audio");
            media.preload = "auto";
            media.oncanplaythrough = () => { clearTimeout(timeout); finish(); };
            media.onerror = () => { clearTimeout(timeout); finish(); };
            media.src = mediaUrl;
        }
    });
}

type ElementPhase = "waiting" | "entering" | "visible" | "exiting" | "done";

function CanvasElementView({ element }: { element: CanvasPlayElement }) {
    const [phase, setPhase] = useState<ElementPhase>("waiting");
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase("entering"), element.start_delay_ms),
            setTimeout(() => setPhase("visible"), element.start_delay_ms + element.transition_ms),
            setTimeout(() => setPhase("exiting"), element.start_delay_ms + element.duration_ms),
            setTimeout(() => setPhase("done"), element.start_delay_ms + element.duration_ms + element.transition_ms),
        ];
        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (phase === "entering" && mediaRef.current) {
            mediaRef.current.volume = (element.volume ?? 100) / 100;
            mediaRef.current.currentTime = 0;
            mediaRef.current.play().catch((e) => console.error("Failed to play media:", e));
        }
        if (phase === "done" && mediaRef.current) {
            mediaRef.current.pause();
        }
    }, [phase, element.volume]);

    if (phase === "waiting" || phase === "done") return null;

    const transitionClass = phase === "exiting"
        ? getTransitionClass(element.exit_transition, "exit")
        : getTransitionClass(element.enter_transition, "enter");

    const wrapperStyle: React.CSSProperties = {
        position: "absolute",
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.z_index,
        animationDuration: `${element.transition_ms}ms`,
        animationFillMode: "both",
    };

    if (element.type === "text") {
        const textStyle = (element.text_style ?? {}) as Record<string, string | number>;
        return (
            <div
                className={transitionClass}
                style={{
                    ...wrapperStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: (textStyle.align as React.CSSProperties["textAlign"]) ?? "center",
                    fontFamily: (textStyle.fontFamily as string) ?? undefined,
                    fontSize: textStyle.fontSize ? `${textStyle.fontSize}px` : "24px",
                    fontWeight: (textStyle.weight as React.CSSProperties["fontWeight"]) ?? "bold",
                    color: (textStyle.color as string) ?? "#ffffff",
                    textShadow: (textStyle.shadow as string) ?? "0 2px 6px rgba(0,0,0,0.6)",
                    WebkitTextStroke: textStyle.stroke ? `1px ${textStyle.stroke}` : undefined,
                }}
            >
                {element.text_content}
            </div>
        );
    }

    if (element.type === "image") {
        return (
            <div className={transitionClass} style={wrapperStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={element.media_url ?? undefined}
                    alt=""
                    className="w-full h-full object-contain"
                />
            </div>
        );
    }

    if (element.type === "video") {
        return (
            <div className={transitionClass} style={wrapperStyle}>
                <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={element.media_url ?? undefined}
                    loop={element.loop}
                    className="w-full h-full object-contain bg-transparent"
                    playsInline
                />
            </div>
        );
    }

    // audio: no visual footprint, but still respects the timeline for play/stop
    return (
        <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={element.media_url ?? undefined}
            loop={element.loop}
            className="hidden"
        />
    );
}

interface CanvasPlayerProps {
    event: CanvasPlayEvent;
    onComplete: () => void;
}

export function CanvasPlayer({ event, onComplete }: CanvasPlayerProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setIsReady(false);

        Promise.all(event.elements.map(preloadMedia)).then(() => {
            if (!cancelled) setIsReady(true);
        });

        const doneTimer = setTimeout(onComplete, event.durationMs);

        return () => {
            cancelled = true;
            clearTimeout(doneTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event.playId]);

    if (!isReady) return null;

    return (
        <div className="absolute inset-0">
            {event.elements
                .slice()
                .sort((a, b) => a.z_index - b.z_index)
                .map((element) => (
                    <CanvasElementView key={element.id} element={element} />
                ))}
        </div>
    );
}
