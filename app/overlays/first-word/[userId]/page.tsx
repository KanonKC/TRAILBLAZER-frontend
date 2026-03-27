"use client"

import { useEffect, useRef, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getFirstWordEventUrl } from "@/features/first-word/api/firstWord.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second

export default function FirstWordOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const audioRef = useRef<HTMLAudioElement>(null)
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)

    const connect = useCallback(() => {
        if (!userId) return

        // Clean up existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(getFirstWordEventUrl(userId, key))
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("Connected to FirstWord events")
            // Reset retry delay on successful connection
            retryDelayRef.current = INITIAL_RETRY_DELAY
        }

        eventSource.addEventListener("audio", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("Received audio event:", data)
                if (data.url && audioRef.current) {
                    audioRef.current.volume = (data.volume ?? 100) / 100
                    audioRef.current.src = data.url
                    audioRef.current.play().catch(e => console.error("Failed to play audio:", e))
                }
            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
        })

        eventSource.onerror = () => {
            console.log("EventSource error, attempting reconnect...")
            eventSource.close()

            // Schedule retry with exponential backoff
            const delay = retryDelayRef.current
            console.log(`Reconnecting in ${delay / 1000}s...`)

            retryTimeoutRef.current = setTimeout(() => {
                connect()
            }, delay)

            // Increase delay for next retry (exponential backoff with cap)
            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY)
        }
    }, [userId, key])

    useEffect(() => {
        connect()

        return () => {
            // Clean up on unmount
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
        }
    }, [connect])

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative">
            <div className="absolute top-4 right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md message-overlay-refresh"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>
            {/* Hidden audio element */}
            <audio ref={audioRef} className="hidden" />
        </div>
    )
}
