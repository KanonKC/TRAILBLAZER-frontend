"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

export default function FirstWordOverlayPage() {
    const params = useParams()
    const userId = params.userId as string
    const audioRef = useRef<HTMLAudioElement>(null)
    const [lastAudio, setLastAudio] = useState<string>("")

    useEffect(() => {
        if (!userId) return

        const eventSource = new EventSource(`http://localhost:8080/api/v1/events/first-word/${userId}`)

        eventSource.onopen = () => {
            console.log("Connected to FirstWord events")
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
            // Reconnect after 5 seconds
            setTimeout(() => {
                // Trigger re-render to reconnect
                // For simplicity in this example, we just log. 
                // In a robust app, we might toggle a state to force effect re-run or let the browser/library handle it.
                // EventSource usually attempts reconnect automatically, but onerror often signals a fatal error or closure.
                window.location.reload()
            }, 5000)
        }

        return () => {
            eventSource.close()
        }
    }, [userId])

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none">
            {/* Hidden audio element */}
            <audio ref={audioRef} className="hidden" />
        </div>
    )
}
