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
        <div className="w-screen h-screen bg-transparent overflow-hidden">
            {/* Hidden audio element */}
            <audio ref={audioRef} className="hidden" />
            <div className="p-4 text-green-500 font-bold bg-black/50 inline-block rounded m-4">
                FirstWord Overlay Active
                <div className="text-xs font-normal text-white">Listening for user: {userId}</div>
                {lastAudio && <div className="text-xs text-gray-300 mt-1 max-w-[200px] truncate">Last audio: {lastAudio}</div>}
            </div>
        </div>
    )
}
