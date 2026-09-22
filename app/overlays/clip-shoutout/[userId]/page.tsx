"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getClipShoutoutEventUrl } from "@/features/clip-shoutout/api/clipShoutout.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ackOverlayJob } from "@/lib/overlay-queue";

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second

export default function ClipShoutoutOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [url, setUrl] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const jobIdRef = useRef<string | null>(null);

    // Told to the backend queue so the next raid's shoutout, chat reply and
    // clip all go out together as soon as this clip is done.
    const finishCurrent = useCallback(() => {
        setIsVisible(false);
        setUrl(null);
        const jobId = jobIdRef.current;
        jobIdRef.current = null;
        ackOverlayJob("clip-shoutout", userId, jobId ?? undefined, key);
    }, [userId, key])

    const connect = useCallback(() => {
        if (!userId) return

        // Clean up existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(getClipShoutoutEventUrl(userId, key))
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("EventSource connected")
        }

        eventSource.addEventListener("connected", (event) => {
            console.log("Received connected event")
            // Reset retry delay on successful logical connection
            retryDelayRef.current = INITIAL_RETRY_DELAY
        })

        eventSource.addEventListener("clip", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("Received clip event:", data)
                if (data.url) {
                    setUrl(data.url);
                    setIsVisible(true);
                    jobIdRef.current = data.jobId ?? null;

                    // The queue's own figure when it sends one, otherwise the
                    // clip length plus a small buffer.
                    const durationMs = data.duration_ms ?? ((data.duration ? data.duration * 1000 : 60000) + 3000);

                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(finishCurrent, durationMs);
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
    }, [userId, key, finishCurrent])

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
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    }, [connect])

    // Get parent domain for Twitch embed
    const parentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative flex items-center justify-center p-8">
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

            {isVisible && url && (
                <div className="shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    <video
                        src={url}
                        autoPlay
                        // muted={false} // React video tag specific: muted prop is boolean, false by default. But browsers often block autoplay with sound. 
                        // However, since this is likely an overlay in OBS, it might be allowed.
                        width="1280"
                        height="720"
                        className="bg-black block"
                        onEnded={finishCurrent}
                    />
                </div>
            )}
        </div>
    )
}
