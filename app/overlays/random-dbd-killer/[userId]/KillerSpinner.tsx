"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { KillerFrameReveal } from "./KillerFrameReveal"

export interface KillerResult {
    slug: string;
    title: string;
    image_url: string;
}

export type AnimationStyle = "slot" | "flip" | "roulette" | "frame";

interface KillerSpinnerProps {
    pool: KillerResult[];
    finalKiller: KillerResult;
    animationStyle: AnimationStyle;
    onComplete: () => void;
}

const SPIN_DURATION_MS = 2800;

/** Tick delays that ramp up (ease-out) so the spin visibly decelerates before landing. */
function buildTickSchedule(totalDurationMs: number): number[] {
    const delays: number[] = [];
    let elapsed = 0;
    let delay = 140;
    while (elapsed < totalDurationMs) {
        delays.push(delay);
        elapsed += delay;
        delay = Math.min(delay * 1.22, 500);
    }
    return delays;
}

function useSpinCursor(poolLength: number, active: boolean, onDone: () => void) {
    const [step, setStep] = useState(0);
    const [tickMs, setTickMs] = useState(140);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!active || poolLength <= 1) {
            if (poolLength <= 1) onDone();
            return;
        }

        const schedule = buildTickSchedule(SPIN_DURATION_MS);
        let i = 0;

        const tick = () => {
            if (i >= schedule.length) {
                onDone();
                return;
            }
            setTickMs(schedule[i]);
            setStep((prev) => prev + 1);
            timeoutRef.current = setTimeout(tick, schedule[i]);
            i += 1;
        };

        timeoutRef.current = setTimeout(tick, schedule[0]);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, poolLength]);

    return { step, tickMs, index: poolLength > 0 ? step % poolLength : 0 };
}

export function KillerSpinner({ pool, finalKiller, animationStyle, onComplete }: KillerSpinnerProps) {
    const [isSpinning, setIsSpinning] = useState(pool.length > 1);

    if (animationStyle === "frame") {
        return <KillerFrameReveal pool={pool} finalKiller={finalKiller} onComplete={onComplete} />;
    }

    return (
        <LegacySpinner
            pool={pool}
            finalKiller={finalKiller}
            animationStyle={animationStyle}
            onComplete={onComplete}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
        />
    );
}

function LegacySpinner({
    pool,
    finalKiller,
    animationStyle,
    onComplete,
    isSpinning,
    setIsSpinning,
}: KillerSpinnerProps & { isSpinning: boolean; setIsSpinning: (v: boolean) => void }) {
    const { step, tickMs, index: cursorIndex } = useSpinCursor(pool.length, isSpinning, () => {
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
        // Cross-fade between two stacked layers instead of remounting, so there's
        // never a frame where both layers are transparent (no "flash to blank").
        return (
            <div className="relative" style={{ width: "min(80vw, 420px)" }}>
                <div key={step} className="animate-in fade-in duration-150 fill-mode-forwards">
                    <KillerCard killer={current} />
                </div>
            </div>
        );
    }

    // Render two extra copies of the pool ahead of the cursor so the strip can
    // always slide forward continuously instead of snapping back on wraparound.
    const loopedPool = [...pool, ...pool, ...pool];
    const offset = pool.length + cursorIndex;

    if (animationStyle === "roulette") {
        return (
            <div className="overflow-hidden" style={{ width: "min(80vw, 420px)" }}>
                <div
                    className="flex gap-4 ease-linear"
                    style={{
                        transform: `translateX(-${offset * 100}%)`,
                        transitionProperty: "transform",
                        transitionDuration: `${tickMs}ms`,
                    }}
                >
                    {loopedPool.map((k, i) => (
                        <div key={i} className="shrink-0 w-full">
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
                className="ease-linear"
                style={{
                    transform: `translateY(-${offset * 100}%)`,
                    transitionProperty: "transform",
                    transitionDuration: `${tickMs}ms`,
                }}
            >
                {loopedPool.map((k, i) => (
                    <div key={i}>
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
