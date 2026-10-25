"use client"

import { useRef, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getFirstWordEventUrl } from "@/features/first-word/api/firstWord.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ackOverlayJob } from "@/lib/overlay-queue";
import { useOverlayEventSource } from "@/hooks/use-overlay-event-source";

export default function FirstWordOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const audioRef = useRef<HTMLAudioElement>(null)
    // The greeting currently playing, so we can tell the backend queue the
    // moment it really ends instead of making the next viewer wait out an
    // estimate.
    const jobIdRef = useRef<string | null>(null)

    const finishCurrent = useCallback(() => {
        const jobId = jobIdRef.current
        jobIdRef.current = null
        ackOverlayJob("first-word", userId, jobId ?? undefined, key)
    }, [userId, key])

    useOverlayEventSource(userId ? getFirstWordEventUrl(userId, key) : null, "audio", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("Received audio event:", data)
                if (data.url && audioRef.current) {
                    jobIdRef.current = data.jobId ?? null
                    audioRef.current.volume = (data.volume ?? 100) / 100
                    audioRef.current.src = data.url
                    audioRef.current.play().catch(e => {
                        console.error("Failed to play audio:", e)
                        // A greeting the browser refuses to play must not hold
                        // the queue for the whole estimated duration.
                        finishCurrent()
                    })
                }
            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
    }, { resetOnOpen: true });

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
            <audio
                ref={audioRef}
                className="hidden"
                onEnded={finishCurrent}
                onError={finishCurrent}
            />
        </div>
    )
}
