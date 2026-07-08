"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface KillerResult {
    slug: string;
    title: string;
    image_url: string;
}

export type AnimationStyle = "slot" | "flip" | "roulette";

interface KillerSpinnerProps {
    pool: KillerResult[];
    finalKiller: KillerResult;
    animationStyle: AnimationStyle;
    onComplete: () => void;
}

const SPIN_DURATION_MS = 2000;

/** Tick delays that ramp up (ease-out) so the spin visibly decelerates before landing. */
function buildTickSchedule(totalDurationMs: number): number[] {
    const delays: number[] = [];
    let elapsed = 0;
    let delay = 80;
    while (elapsed < totalDurationMs) {
        delays.push(delay);
        elapsed += delay;
        delay = Math.min(delay * 1.18, 400);
    }
    return delays;
}

function useSpinCursor(poolLength: number, active: boolean, onDone: () => void) {
    const [index, setIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!active || poolLength <= 1) {
            if (poolLength <= 1) onDone();
            return;
        }

        const schedule = buildTickSchedule(SPIN_DURATION_MS);
        let step = 0;

        const tick = () => {
            if (step >= schedule.length) {
                onDone();
                return;
            }
            setIndex((prev) => (prev + 1) % poolLength);
            timeoutRef.current = setTimeout(tick, schedule[step]);
            step += 1;
        };

        timeoutRef.current = setTimeout(tick, schedule[0]);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, poolLength]);

    return index;
}

export function KillerSpinner({ pool, finalKiller, animationStyle, onComplete }: KillerSpinnerProps) {
    const [isSpinning, setIsSpinning] = useState(pool.length > 1);
    const cursorIndex = useSpinCursor(pool.length, isSpinning, () => {
        setIsSpinning(false);
        onComplete();
    });

    const current = isSpinning ? (pool[cursorIndex] ?? finalKiller) : finalKiller;

    if (!isSpinning) {
        return (
            <div className="animate-in fade-in zoom-in duration-500">
                <KillerCard killer={finalKiller} />
            </div>
        );
    }

    if (animationStyle === "flip") {
        return (
            <div key={current.slug + cursorIndex} className="animate-in fade-in zoom-in duration-150">
                <KillerCard killer={current} />
            </div>
        );
    }

    if (animationStyle === "roulette") {
        return (
            <div className="overflow-hidden" style={{ width: "min(80vw, 420px)" }}>
                <div
                    className="flex gap-4 transition-transform duration-150 ease-linear"
                    style={{ transform: `translateX(-${cursorIndex * 100}%)`, filter: "blur(2px)" }}
                >
                    {pool.map((k, i) => (
                        <div key={k.slug + i} className="shrink-0 w-full">
                            <KillerCard killer={k} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // slot (default)
    return (
        <div className="overflow-hidden rounded-2xl" style={{ height: "min(60vh, 420px)" }}>
            <div
                className="transition-transform duration-150 ease-linear"
                style={{ transform: `translateY(-${cursorIndex * 100}%)` }}
            >
                {pool.map((k, i) => (
                    <div key={k.slug + i}>
                        <KillerCard killer={k} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function KillerCard({ killer }: { killer: KillerResult }) {
    return (
        <div className="bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={killer.image_url}
                alt={killer.title}
                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                className={cn("max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl")}
            />
            <span className="text-2xl font-bold text-white uppercase tracking-wide drop-shadow-md">
                {killer.title}
            </span>
        </div>
    );
}
