"use client"

import { useEffect, useReducer, useRef, useState } from "react"
import { KillerResult } from "./KillerSpinner"

interface KillerFrameRevealProps {
    pool: KillerResult[];
    finalKiller: KillerResult;
    onComplete: () => void;
}

const FRAME_APPEAR_MS = 400;
const SPIN_DURATION_MS = 5200; // cycling + decelerating
const LANDED_BUFFER_MS = 200;
const PRELOAD_TIMEOUT_MS = 3000;

type Phase = "preload" | "frame-appear" | "spinning" | "landed" | "reveal";

interface State {
    phase: Phase;
    step: number;
    tickMs: number;
}

type Action =
    | { type: "PRELOAD_DONE" }
    | { type: "FRAME_READY" }
    | { type: "TICK"; tickMs: number }
    | { type: "SCHEDULE_DONE" }
    | { type: "BUFFER_DONE" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PRELOAD_DONE":
            return state.phase === "preload" ? { ...state, phase: "frame-appear" } : state;
        case "FRAME_READY":
            return state.phase === "frame-appear" ? { ...state, phase: "spinning" } : state;
        case "TICK":
            return state.phase === "spinning"
                ? { ...state, step: state.step + 1, tickMs: action.tickMs }
                : state;
        case "SCHEDULE_DONE":
            return state.phase === "spinning" ? { ...state, phase: "landed" } : state;
        case "BUFFER_DONE":
            return state.phase === "landed" ? { ...state, phase: "reveal" } : state;
        default:
            return state;
    }
}

/** Exponential ease-out tick schedule with an extra deliberate slowdown on the final two ticks. */
const FAST_PHASE_MS = 1500;

function buildTickSchedule(totalDurationMs: number): number[] {
    const delays: number[] = [];
    let elapsed = 0;
    let delay = 60;
    while (elapsed < totalDurationMs) {
        delays.push(delay);
        elapsed += delay;
        if (elapsed >= FAST_PHASE_MS) delay = Math.min(delay * 1.12, 650);
    }
    delays.push(700, 800);
    return delays;
}

function usePreloadImages(urls: string[]) {
    const [ready, setReady] = useState(urls.length === 0);

    useEffect(() => {
        if (urls.length === 0) {
            setReady(true);
            return;
        }
        let cancelled = false;
        let settled = 0;

        const markSettled = () => {
            settled += 1;
            if (!cancelled && settled >= urls.length) setReady(true);
        };

        urls.forEach((url) => {
            const img = new window.Image();
            img.onload = markSettled;
            img.onerror = markSettled;
            img.src = url;
        });

        const timeout = setTimeout(() => {
            if (!cancelled) setReady(true);
        }, PRELOAD_TIMEOUT_MS);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urls.join("|")]);

    return ready;
}

export function KillerFrameReveal({ pool, finalKiller, onComplete }: KillerFrameRevealProps) {
    const [state, dispatch] = useReducer(reducer, { phase: "preload", step: 0, tickMs: 60 });
    const hasCompletedRef = useRef(false);
    const scheduleRef = useRef<number[] | null>(null);

    const imageUrls = pool.length > 0 ? pool.map((k) => k.image_url) : [finalKiller.image_url];
    const preloaded = usePreloadImages(imageUrls);

    // preload -> frame-appear
    useEffect(() => {
        if (preloaded) dispatch({ type: "PRELOAD_DONE" });
    }, [preloaded]);

    // frame-appear -> spinning
    useEffect(() => {
        if (state.phase !== "frame-appear") return;
        const t = setTimeout(() => dispatch({ type: "FRAME_READY" }), FRAME_APPEAR_MS);
        return () => clearTimeout(t);
    }, [state.phase]);

    // spinning: drive the tick schedule
    useEffect(() => {
        if (state.phase !== "spinning") return;
        if (pool.length <= 1) {
            dispatch({ type: "SCHEDULE_DONE" });
            return;
        }

        if (!scheduleRef.current) scheduleRef.current = buildTickSchedule(SPIN_DURATION_MS);
        const schedule = scheduleRef.current;
        let i = 0;
        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            if (i >= schedule.length) {
                dispatch({ type: "SCHEDULE_DONE" });
                return;
            }
            dispatch({ type: "TICK", tickMs: schedule[i] });
            timeoutId = setTimeout(tick, schedule[i]);
            i += 1;
        };

        timeoutId = setTimeout(tick, schedule[0]);
        return () => clearTimeout(timeoutId);
    }, [state.phase, pool.length]);

    // landed -> reveal (buffer)
    useEffect(() => {
        if (state.phase !== "landed") return;
        const t = setTimeout(() => dispatch({ type: "BUFFER_DONE" }), LANDED_BUFFER_MS);
        return () => clearTimeout(t);
    }, [state.phase]);

    // reveal -> notify parent once
    useEffect(() => {
        if (state.phase === "reveal" && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
        }
    }, [state.phase, onComplete]);

    const cursorIndex = pool.length > 0 ? state.step % pool.length : 0;
    const isSpinning = state.phase === "spinning";
    const current = isSpinning ? (pool[cursorIndex] ?? finalKiller) : finalKiller;
    const showFrame = state.phase !== "preload";
    const showGlowAndText = state.phase === "reveal";
    const fadeMs = Math.max(60, Math.round(state.tickMs * 0.6));

    return (
        <div className="flex flex-col items-center" style={{ gap: "clamp(8px, 1.5vw, 16px)" }}>
            <div
                className="relative"
                style={{
                    width: "clamp(220px, 22vw, 320px)",
                    aspectRatio: "3 / 4",
                    opacity: showFrame ? 1 : 0,
                    transformOrigin: "center",
                    animation: showGlowAndText
                        ? "killer-frame-shift-up 450ms cubic-bezier(0.22,1,0.36,1) both"
                        : showFrame
                            ? "killer-frame-fade-in 300ms ease-out both, killer-frame-appear-y 250ms cubic-bezier(0.34,1.56,0.64,1) both, killer-frame-appear-x 250ms 100ms cubic-bezier(0.34,1.56,0.64,1) both"
                            : undefined,
                }}
            >
                {/* frame background — TRAILBLAZER orange at the bottom, fading up into grey-brown */}
                <div
                    className="absolute inset-0 z-0 rounded-lg"
                    style={{ background: "linear-gradient(0deg, #5C3B0A 0%, #2E2114 35%, #191510 70%, #0F0D0B 100%)" }}
                />

                {/* cracked, weathered texture overlay */}
                <div className="absolute inset-0 z-[1] rounded-lg killer-frame-weathering" />
                <div className="absolute inset-0 z-[1] rounded-lg killer-frame-cracks" />

                {/* top / left / right frame edges — behind the killer image */}
                <div className="absolute inset-0 z-10 rounded-lg border-t-4 border-l-4 border-r-4 border-b-0" style={{ borderColor: "#F59E0B" }} />

                {/* killer image, cross-faded between two stacked layers to avoid any blank frame */}
                <div
                    className="absolute z-20 rounded-md overflow-hidden"
                    style={{
                        inset: 12,
                        animation: showGlowAndText ? "killer-rim-pulse 1.2s ease-in-out infinite" : undefined,
                        boxShadow: showGlowAndText ? undefined : "none",
                    }}
                >
                    <CrossFadeImage killer={current} fadeMs={fadeMs} />
                </div>

                {/* bottom frame edge — in front of the killer image, so it looks slotted in from below */}
                <div className="absolute inset-0 z-30 rounded-lg border-b-4 pointer-events-none" style={{ borderColor: "#F59E0B" }} />
            </div>

            {showGlowAndText && <KillerNameReveal title={finalKiller.title} />}
        </div>
    );
}

function CrossFadeImage({ killer, fadeMs }: { killer: KillerResult; fadeMs: number }) {
    const [slots, setSlots] = useState<[KillerResult, KillerResult]>([killer, killer]);
    const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
    const prevSlugRef = useRef(killer.slug);

    useEffect(() => {
        if (killer.slug === prevSlugRef.current) return;
        prevSlugRef.current = killer.slug;
        setSlots((prev) => {
            const next: [KillerResult, KillerResult] = [...prev];
            next[activeSlot === 0 ? 1 : 0] = killer;
            return next;
        });
        setActiveSlot((s) => (s === 0 ? 1 : 0));
    }, [killer, activeSlot]);

    return (
        <div className="relative w-full h-full">
            {slots.map((slotKiller, slotIdx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={slotIdx}
                    src={slotKiller.image_url}
                    alt={slotKiller.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: activeSlot === slotIdx ? 1 : 0,
                        transition: `opacity ${fadeMs}ms linear`,
                    }}
                />
            ))}
        </div>
    );
}

function KillerNameReveal({ title }: { title: string }) {
    const chars = title.split("");
    return (
        <div className="animate-killer-text-slide-up" style={{ animationDelay: "150ms" }}>
            <span className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white drop-shadow-md">
                {chars.map((ch, i) => (
                    <span
                        key={i}
                        className="inline-block animate-killer-char-in"
                        style={{ animationDelay: `${350 + i * 40}ms` }}
                    >
                        {ch === " " ? " " : ch}
                    </span>
                ))}
            </span>
        </div>
    );
}
