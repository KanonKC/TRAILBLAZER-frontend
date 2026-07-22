"use client"

import { useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getFirstWordEventUrl } from "@/features/first-word/api/firstWord.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useOverlayEvents } from "@/hooks/use-overlay-events";

export default function FirstWordOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const audioRef = useRef<HTMLAudioElement>(null)

    useOverlayEvents(userId ? getFirstWordEventUrl(userId, key) : null, {
        audio: (data) => {
            if (data.url && audioRef.current) {
                audioRef.current.volume = (data.volume ?? 100) / 100
                audioRef.current.src = data.url
                audioRef.current.play().catch(e => console.error("Failed to play audio:", e))
            }
        },
    })

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
