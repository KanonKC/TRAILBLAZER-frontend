"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getRandomDbdPerkEventUrl } from "@/services/randomDbdPerk.service";
import { Button } from "@/components/ui/button";
import { RefreshCcw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DbdPerkPagination {
    page: number;
    row: number;
    perk: number;
}

interface RandomDbdPerkEvent {
    perks: DbdPerkPagination[];
    type: "survivor" | "killer";
}

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second

export default function RandomDbdPerkOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [perkData, setPerkData] = useState<RandomDbdPerkEvent | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const connect = useCallback(() => {
        if (!userId) return

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const url = getRandomDbdPerkEventUrl(userId, key);
        const eventSource = new EventSource(url)
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("Connected to Random DBD Perk events")
            setIsConnected(true)
            retryDelayRef.current = INITIAL_RETRY_DELAY
        }

        eventSource.addEventListener("perks", (event) => {
            try {
                const data = JSON.parse(event.data) as RandomDbdPerkEvent;
                console.log("Received perks event:", data)
                setPerkData(data)
                setIsVisible(true)

                // Clear existing timeout
                if (hideTimeoutRef.current) {
                    clearTimeout(hideTimeoutRef.current)
                }

                // Hide after 30 seconds
                hideTimeoutRef.current = setTimeout(() => {
                    setIsVisible(false)
                }, 30000)

            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
        })

        eventSource.onerror = () => {
            console.log("EventSource error, attempting reconnect...")
            setIsConnected(false)
            eventSource.close()

            const delay = retryDelayRef.current
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
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
        }
    }, [connect])

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative flex items-center justify-center p-8">
            <div className="absolute top-4 right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300 flex gap-2">
                {!isConnected && (
                    <div className="bg-red-500/80 text-white p-1.5 rounded-full shadow-md" title="Disconnected">
                        <WifiOff className="h-4 w-4" />
                    </div>
                )}
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md message-overlay-refresh"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            <div className={cn(
                "transition-all duration-500 transform",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
            )}>
                {perkData && (
                    <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl max-w-4xl text-center">
                        <h2 className={cn(
                            "text-2xl font-bold mb-6 tracking-wide uppercase drop-shadow-md",
                            perkData.type === 'survivor' ? "text-blue-400" : "text-red-500"
                        )}>
                            Random {perkData.type} Perks
                        </h2>

                        <div className="flex flex-wrap justify-center gap-6">
                            {perkData.perks.map((p, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div className={cn(
                                        "w-24 h-24 rounded-xl flex items-center justify-center border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform duration-300 group-hover:scale-105",
                                        perkData.type === 'survivor'
                                            ? "bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/30 group-hover:border-blue-500/60 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                            : "bg-gradient-to-br from-zinc-900 to-black border-red-500/30 group-hover:border-red-500/60 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                                    )}>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-4xl font-bold text-white drop-shadow-lg leading-none mb-1">{p.page}</span>
                                            <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Page</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    </div>

                                    <div className="flex items-center gap-2 text-lg font-medium text-white/90 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                        <span className={cn(
                                            "text-xs px-1.5 py-0.5 rounded font-mono font-bold",
                                            perkData.type === 'survivor' ? "bg-blue-500/20 text-blue-300" : "bg-red-500/20 text-red-300"
                                        )}>
                                            POS
                                        </span>
                                        {/* Calculate position based on row and perk: (row-1)*5 + perk */}
                                        <span>{(p.row - 1) * 5 + p.perk}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
