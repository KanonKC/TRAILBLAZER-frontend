"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getFirstWordEventUrl } from "@/services/firstWord.service";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function FirstWordOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const audioRef = useRef<HTMLAudioElement>(null)
    const [lastAudio, setLastAudio] = useState<string>("")

    const router = useRouter()

    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        console.log('retryCount', retryCount)
        if (!userId) return

        const connect = () => {
            const eventSource = new EventSource(getFirstWordEventUrl(userId, key))

            eventSource.onopen = () => {
                console.log("Connected to FirstWord events")
                setRetryCount(0)
            }

            eventSource.addEventListener("audio", (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("Received audio event:", data)
                    if (data.url && audioRef.current) {
                        setLastAudio(data.url)
                        audioRef.current.src = data.url
                        audioRef.current.play().catch(e => console.error("Failed to play audio:", e))
                    }
                } catch (error) {
                    console.error("Failed to parse event data:", error)
                }
            })

            eventSource.onerror = (error) => {
                console.error("EventSource error:", error)
                eventSource.close()
                router.push('/overlays/not-found')
            }

            return eventSource
        }

        const eventSource = connect()

        return () => {
            eventSource.close()
        }
    }, [userId, key, router, retryCount])

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
