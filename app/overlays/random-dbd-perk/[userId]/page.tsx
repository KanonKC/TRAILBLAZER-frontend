"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getRandomDbdPerkEventUrl } from "@/features/random-dbd-perk/api/randomDbdPerk.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ackOverlayJob } from "@/lib/overlay-queue";
import { CanvasPlayer } from "@/components/overlay/CanvasPlayer";
import { CanvasPlayback } from "@/features/canvas/types";

interface DbdPerkPagination {
    page: number;
    row: number;
    perk: number;
}

interface RandomDbdPerkCanvasEvent {
    /** null when the linked canvas was deleted or switched off after the trigger. */
    canvas: CanvasPlayback | null;
    perks: DbdPerkPagination[];
    type: "survivor" | "killer";
    jobId?: string;
    duration_ms?: number;
}

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second
const FALLBACK_DURATION_MS = 5000

export default function RandomDbdPerkOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)
    const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const jobIdRef = useRef<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [current, setCurrent] = useState<RandomDbdPerkCanvasEvent | null>(null)

    // Tells the backend queue this item truly ended so the next one plays now.
    const finishCurrent = useCallback(() => {
        if (fallbackTimeoutRef.current) {
            clearTimeout(fallbackTimeoutRef.current)
            fallbackTimeoutRef.current = null
        }
        const jobId = jobIdRef.current
        jobIdRef.current = null
        setCurrent(null)
        ackOverlayJob("random-dbd-perk", userId, jobId ?? undefined, key)
    }, [userId, key])

    const connect = useCallback(() => {
        if (!userId) return

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(getRandomDbdPerkEventUrl(userId, key))
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("Connected to Random DBD Perk events")
            setIsConnected(true)
            retryDelayRef.current = INITIAL_RETRY_DELAY
        }

        eventSource.addEventListener("canvas", (event) => {
            try {
                const data = JSON.parse(event.data) as RandomDbdPerkCanvasEvent
                console.log("Received canvas event:", data)
                jobIdRef.current = data.jobId ?? null
                setCurrent(data)

                // With no canvas to play there is no media end to wait for.
                if (!data.canvas) {
                    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current)
                    fallbackTimeoutRef.current = setTimeout(finishCurrent, data.duration_ms ?? FALLBACK_DURATION_MS)
                }
            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
        })

        eventSource.onerror = () => {
            console.log("EventSource error, attempting reconnect...")
            setIsConnected(false)
            eventSource.close()

            const delay = retryDelayRef.current
            retryTimeoutRef.current = setTimeout(() => {
                connect()
            }, delay)

            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY)
        }
    }, [userId, key, finishCurrent])

    useEffect(() => {
        connect()

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (fallbackTimeoutRef.current) {
                clearTimeout(fallbackTimeoutRef.current)
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
        }
    }, [connect])

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative">
            <div className="absolute top-4 right-4 z-10 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300 flex gap-2">
                {!isConnected && (
                    <div className="bg-red-500/80 text-white p-1.5 rounded-full shadow-md" title="Disconnected">
                        <WifiOff className="h-4 w-4" />
                    </div>
                )}
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md message-overlay-refresh"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            <CanvasPlayer
                playback={current?.canvas ?? null}
                playId={current?.jobId ?? null}
                onFinished={finishCurrent}
            />

            {current && (
                <div className="absolute inset-x-0 bottom-8 flex justify-center px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 shadow-2xl text-center">
                        <h2 className={cn(
                            "text-xl font-bold mb-3 tracking-wide uppercase drop-shadow-md",
                            current.type === "survivor" ? "text-blue-400" : "text-red-500"
                        )}>
                            Random {current.type} Perks
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {current.perks.map((p, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full border px-3 py-1 text-lg font-medium text-white/90",
                                        current.type === "survivor" ? "border-blue-500/30 bg-blue-500/10" : "border-red-500/30 bg-red-500/10"
                                    )}
                                >
                                    <span className="text-xs uppercase text-white/50">Page</span>
                                    <span className="font-bold">{p.page}</span>
                                    <span className="text-white/30">/</span>
                                    <span className="text-xs uppercase text-white/50">Pos</span>
                                    <span className="font-bold">{(p.row - 1) * 5 + p.perk}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
