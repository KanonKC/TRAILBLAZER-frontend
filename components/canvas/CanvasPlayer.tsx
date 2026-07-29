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

function phaseAt(element: CanvasPlayElement, t: number): ElementPhase {
    const enterEnd = element.start_delay_ms + element.transition_ms;
    const visibleEnd = element.start_delay_ms + element.duration_ms;
    const exitEnd = visibleEnd + element.transition_ms;
    if (t < element.start_delay_ms) return "waiting";
    if (t < enterEnd) return "entering";
    if (t < visibleEnd) return "visible";
    if (t < exitEnd) return "exiting";
    return "done";
}

interface CanvasElementViewProps {
    element: CanvasPlayElement;
    /**
     * When provided, this element's visibility/phase is a pure function of this
     * clock instead of being scheduled once via setTimeout at mount — required
     * for the editor's scrubbable/pausable preview (seeking or pausing a
     * fire-and-forget setTimeout schedule doesn't mean anything), while the real
     * overlay page (no currentTimeMs passed) keeps the simpler timer-based path.
     */
    currentTimeMs?: number;
    isPaused?: boolean;
}

function CanvasElementView({ element, currentTimeMs, isPaused }: CanvasElementViewProps) {
    const isControlled = currentTimeMs !== undefined;
    const [timerPhase, setTimerPhase] = useState<ElementPhase>("waiting");
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

    useEffect(() => {
        if (isControlled) return;
        const timers = [
            setTimeout(() => setTimerPhase("entering"), element.start_delay_ms),
            setTimeout(() => setTimerPhase("visible"), element.start_delay_ms + element.transition_ms),
            setTimeout(() => setTimerPhase("exiting"), element.start_delay_ms + element.duration_ms),
            setTimeout(() => setTimerPhase("done"), element.start_delay_ms + element.duration_ms + element.transition_ms),
        ];
        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const phase = isControlled ? phaseAt(element, currentTimeMs) : timerPhase;

    // Controlled mode: keep the media element's position and play/pause state in
    // sync with the scrubber instead of firing once on an "entering" transition.
    useEffect(() => {
        if (!isControlled || !mediaRef.current) return;
        const media = mediaRef.current;
        const active = phase === "entering" || phase === "visible" || phase === "exiting";
        if (!active) {
            media.pause();
            return;
        }
        media.volume = (element.volume ?? 100) / 100;
        const expectedSec = (currentTimeMs - element.start_delay_ms) / 1000;
        if (Math.abs(media.currentTime - expectedSec) > 0.3) {
            media.currentTime = Math.max(0, expectedSec);
        }
        if (isPaused) {
            media.pause();
        } else {
            media.play().catch((e) => console.error("Failed to play media:", e));
        }
    }, [isControlled, phase, currentTimeMs, isPaused, element.volume, element.start_delay_ms]);

    useEffect(() => {
        if (isControlled) return;
        if (timerPhase === "entering" && mediaRef.current) {
            mediaRef.current.volume = (element.volume ?? 100) / 100;
            mediaRef.current.currentTime = 0;
            mediaRef.current.play().catch((e) => console.error("Failed to play media:", e));
        }
        if (timerPhase === "done" && mediaRef.current) {
            mediaRef.current.pause();
        }
    }, [isControlled, timerPhase, element.volume]);

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
        // Freezing the CSS enter/exit animation exactly where it is is what
        // makes Pause actually look paused instead of the animation continuing
        // to run on the browser's own compositor clock regardless of our state.
        animationPlayState: isControlled && isPaused ? "paused" : undefined,
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
    /** Controlled/scrubbable mode — see CanvasElementView for why. */
    currentTimeMs?: number;
    isPaused?: boolean;
}

export function CanvasPlayer({ event, onComplete, currentTimeMs, isPaused }: CanvasPlayerProps) {
    const [isReady, setIsReady] = useState(false);
    const isControlled = currentTimeMs !== undefined;

    useEffect(() => {
        let cancelled = false;
        setIsReady(false);

        Promise.all(event.elements.map(preloadMedia)).then(() => {
            if (!cancelled) setIsReady(true);
        });

        // In controlled mode the caller owns the clock and decides when playback
        // is "done" (it needs to anyway, to stop advancing currentTimeMs), so
        // this component doesn't schedule its own end timer.
        if (isControlled) return () => { cancelled = true; };

        const doneTimer = setTimeout(onComplete, event.durationMs);

        return () => {
            cancelled = true;
            clearTimeout(doneTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event.playId, isControlled]);

    if (!isReady) return null;

    return (
        <div className="absolute inset-0">
            {event.elements
                .slice()
                .sort((a, b) => a.z_index - b.z_index)
                .map((element) => (
                    <CanvasElementView key={element.id} element={element} currentTimeMs={currentTimeMs} isPaused={isPaused} />
                ))}
        </div>
    );
}
