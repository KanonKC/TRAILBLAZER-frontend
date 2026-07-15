"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getRandomDBDKillerEventUrl } from "@/features/random-dbd-killer/api/randomDBDKiller.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { KillerSpinner, KillerResult, AnimationStyle } from "./KillerSpinner";

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second
const DISPLAY_DURATION_MS = 10000 // 10 seconds

interface KillerResultEvent {
    killer: KillerResult;
    pool?: KillerResult[];
    animationStyle?: AnimationStyle;
}

export default function RandomDBDKillerOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [result, setResult] = useState<KillerResultEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [seq, setSeq] = useState(0);

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
                const data = JSON.parse(event.data) as KillerResultEvent
                console.log("Received killer-result event:", data)
                if (data.killer?.slug && data.killer?.title && data.killer?.image_url) {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setResult(data);
                    setIsVisible(true);
                    setSeq((s) => s + 1);
                } else {
                    console.error("Received malformed killer-result payload, ignoring:", data)
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

    const handleSpinComplete = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
            setResult(null);
        }, DISPLAY_DURATION_MS);
    }, []);

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

            {isVisible && result && (
                <KillerSpinner
                    key={seq}
                    pool={result.pool && result.pool.length > 0 ? result.pool : [result.killer]}
                    finalKiller={result.killer}
                    animationStyle={result.animationStyle ?? "frame"}
                    onComplete={handleSpinComplete}
                />
            )}
        </div>
    )
}
