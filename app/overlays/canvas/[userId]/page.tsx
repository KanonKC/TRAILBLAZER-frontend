"use client"

import { useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getCanvasEventUrl } from "@/features/canvas/api/canvas.api"
import { useOverlayEvents } from "@/hooks/use-overlay-events"
import { CanvasPlayer } from "@/components/canvas/CanvasPlayer"
import { CanvasPlayEvent } from "@/features/canvas/types"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function CanvasOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [queue, setQueue] = useState<CanvasPlayEvent[]>([])
    const seenPlayIds = useRef<Set<string>>(new Set())

    useOverlayEvents(userId ? getCanvasEventUrl(userId, key) : null, {
        play: (data: CanvasPlayEvent) => {
            if (seenPlayIds.current.has(data.playId)) return
            seenPlayIds.current.add(data.playId)
            setQueue((prev) => [...prev, data])
        },
    })

    const current = queue[0] ?? null

    const handleComplete = () => {
        setQueue((prev) => prev.slice(1))
    }

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative">
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

            {current && <CanvasPlayer key={current.playId} event={current} onComplete={handleComplete} />}
        </div>
    )
}
