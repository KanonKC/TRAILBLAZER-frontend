"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getRandomDBDKillerEventUrl } from "@/features/random-dbd-killer/api/randomDBDKiller.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second
const DISPLAY_DURATION_MS = 10000 // 10 seconds

interface KillerResult {
    slug: string;
    title: string;
    image_url: string;
}

export default function RandomDBDKillerOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [killer, setKiller] = useState<KillerResult | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!userId) return

        // Clean up existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(getRandomDBDKillerEventUrl(userId, key))
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("EventSource connected")
        }

        eventSource.addEventListener("connected", () => {
            console.log("Received connected event")
            retryDelayRef.current = INITIAL_RETRY_DELAY
        })

        eventSource.addEventListener("killer-result", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("Received killer-result event:", data)
                if (data.killer) {
                    setKiller(data.killer);
                    setIsVisible(true);

                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(() => {
                        setIsVisible(false);
                        setKiller(null);
                    }, DISPLAY_DURATION_MS);
                }
            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
        })

        eventSource.onerror = () => {
            console.log("EventSource error, attempting reconnect...")
            eventSource.close()

            const delay = retryDelayRef.current
            console.log(`Reconnecting in ${delay / 1000}s...`)

            retryTimeoutRef.current = setTimeout(() => {
                connect()
            }, delay)

            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY)
        }
    }, [userId, key])

    useEffect(() => {
        connect()

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    }, [connect])

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative flex items-center justify-center p-8">
            <div className="absolute top-4 right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            {isVisible && killer && (
                <div className="animate-in fade-in zoom-in duration-500">
                    <div className="bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={killer.image_url}
                            alt={killer.title}
                            className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-2xl"
                        />
                        <span className="text-2xl font-bold text-white uppercase tracking-wide drop-shadow-md">
                            {killer.title}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
