"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getEndCreditEventUrl, EndCreditOverlayData } from "@/features/end-credit/api/endCredit.api"
import { CreditRow } from "@/features/end-credit/components/CreditRow"
import { describeBadge, topBadgeIndex } from "@/features/end-credit/tiers"
import { EndCreditRecordType, EndCreditViewerRecord } from "@/features/end-credit/types"

const MAX_RETRY_DELAY = 16000
const INITIAL_RETRY_DELAY = 1000

/** Fallback pixels-per-second if the widget config hasn't loaded a custom speed yet. */
const DEFAULT_SCROLL_SPEED = 60
/** Sections render in this order, matching how a real end-credit sequence reads. */
const SECTION_ORDER: EndCreditRecordType[] = ["follow", "sub", "raid", "bit"]

const DEFAULT_HEADERS: Record<EndCreditRecordType, string> = {
    follow: "ผู้ติดตามใหม่",
    sub: "สมาชิกใหม่",
    raid: "ผู้ที่ Raid เข้ามา",
    bit: "ผู้สนับสนุน Bits",
}

export default function EndCreditOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [roll, setRoll] = useState<EndCreditOverlayData | null>(null)
    const [scrollDistance, setScrollDistance] = useState(0)

    const contentRef = useRef<HTMLDivElement | null>(null)
    const eventSourceRef = useRef<EventSource | null>(null)
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const endTimerRef = useRef<NodeJS.Timeout | null>(null)

    const connect = useCallback(() => {
        if (!userId) return

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(getEndCreditEventUrl(userId, key))
        eventSourceRef.current = eventSource

        eventSource.addEventListener("connected", () => {
            retryDelayRef.current = INITIAL_RETRY_DELAY
        })

        eventSource.addEventListener("roll", (event) => {
            try {
                const data: EndCreditOverlayData = JSON.parse((event as MessageEvent).data)
                // Restart cleanly if a roll is already playing.
                if (endTimerRef.current) clearTimeout(endTimerRef.current)
                setScrollDistance(0)
                setRoll(data)
            } catch (error) {
                console.error("Failed to parse roll event:", error)
            }
        })

        eventSource.onerror = () => {
            eventSource.close()
            const delay = retryDelayRef.current
            retryTimeoutRef.current = setTimeout(() => connect(), delay)
            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY)
        }
    }, [userId, key])

    useEffect(() => {
        connect()
        return () => {
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
            if (eventSourceRef.current) eventSourceRef.current.close()
            if (endTimerRef.current) clearTimeout(endTimerRef.current)
        }
    }, [connect])

    // Once the roll content is laid out, measure it so the credits travel their full
    // height plus one screen — the last line clears the top before we hide.
    // The distance is applied on the next frame so the browser paints the starting
    // position first and actually animates the transition instead of jumping.
    useEffect(() => {
        if (!roll || !contentRef.current) return

        const scrollSpeed = roll.scroll_speed || DEFAULT_SCROLL_SPEED
        const distance = contentRef.current.offsetHeight + window.innerHeight
        const frame = requestAnimationFrame(() => setScrollDistance(distance))

        const durationMs = (distance / scrollSpeed) * 1000
        endTimerRef.current = setTimeout(() => {
            setRoll(null)
            setScrollDistance(0)
        }, durationMs)

        return () => {
            cancelAnimationFrame(frame)
            if (endTimerRef.current) clearTimeout(endTimerRef.current)
        }
    }, [roll])

    if (!roll) {
        return <div className="w-screen h-screen bg-transparent overflow-hidden" />
    }

    const headerFor = (type: EndCreditRecordType): string => {
        switch (type) {
            case "follow": return roll.followers_header || DEFAULT_HEADERS.follow
            case "sub": return roll.subscribes_header || DEFAULT_HEADERS.sub
            case "raid": return roll.raids_header || DEFAULT_HEADERS.raid
            case "bit": return roll.bits_header || DEFAULT_HEADERS.bit
        }
    }

    const grouped = roll.records.reduce<Record<string, EndCreditViewerRecord[]>>((acc, record) => {
        (acc[record.type] ??= []).push(record)
        return acc
    }, {})

    const sections = SECTION_ORDER
        .map(type => ({ type, items: grouped[type] ?? [] }))
        .filter(section => section.items.length > 0)
        .map(section => {
            const badges = section.items.map(item => describeBadge(item, roll))
            return {
                ...section,
                badges,
                // Hybrid tiering: the section's biggest number also earns a crown.
                topIndex: topBadgeIndex(badges),
                hasBadges: badges.some(badge => badge.kind !== "none"),
            }
        })

    const scrollSpeed = roll.scroll_speed || DEFAULT_SCROLL_SPEED
    const durationSeconds = scrollDistance > 0 ? scrollDistance / scrollSpeed : 0

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden">
            <div
                ref={contentRef}
                className="flex flex-col items-center gap-12 text-white text-center px-12"
                style={{
                    // Start just below the fold, then travel up past the top edge.
                    transform: scrollDistance > 0 ? `translateY(-${scrollDistance}px)` : "translateY(100vh)",
                    transition: durationSeconds > 0 ? `transform ${durationSeconds}s linear` : undefined,
                    willChange: "transform",
                }}
            >
                {sections.map(({ type, items, badges, topIndex, hasBadges }) => (
                    <div key={type} className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-wide drop-shadow-lg trailblazer-gradient-text">{headerFor(type)}</h2>
                        {/* A minimum width gives the leader dots something to span; without badges
                            the names just sit as wide as they need to. */}
                        <div className={`flex flex-col items-stretch gap-2 w-max mx-auto ${hasBadges ? "min-w-[32rem]" : ""}`}>
                            {items.map((item, index) => (
                                <CreditRow
                                    key={item.id}
                                    item={item}
                                    badge={badges[index]}
                                    isTop={index === topIndex}
                                    showAvatar={roll.is_show_viewer_avatars}
                                    withLeader={hasBadges}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
