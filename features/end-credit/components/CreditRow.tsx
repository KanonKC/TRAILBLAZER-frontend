"use client"

import { CSSProperties, useRef } from "react"
import { useRevealDelay } from "../hooks/useCreditRowMotion"
import { CreditBadge, CreditTier, badgeTier } from "../tiers"
import { EndCreditViewerRecord } from "../types"
import { CreditValueBadge } from "./CreditValueBadge"

interface CreditRowProps {
    item: EndCreditViewerRecord
    badge: CreditBadge
    /** This row tops its section, so it earns a crown and a shine on top of its own tier. */
    isTop: boolean
    showAvatar: boolean
    /** Draw the dotted leader that ties the name to its number, credit-roll style. */
    withLeader: boolean
    /** px/second the roll travels at — needed to time this row's reveal against real elapsed time. */
    scrollSpeed: number
}

export const CreditRow = ({ item, badge, isTop, showAvatar, withLeader, scrollSpeed }: CreditRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null)
    const revealDelaySeconds = useRevealDelay(rowRef, scrollSpeed)

    // Topping a section is worth at least a little shine even when the raw number is modest.
    const tier = (isTop ? Math.max(1, badgeTier(badge)) : badgeTier(badge)) as CreditTier
    const hasBadge = badge.kind !== "none"

    return (
        <div
            ref={rowRef}
            className="ec-row text-2xl font-medium drop-shadow"
            data-type={item.type}
            data-tier={tier}
            style={{ "--ec-delay": `${revealDelaySeconds}s` } as CSSProperties}
        >
            <div className="ec-row-name">
                {showAvatar && item.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.avatar_url} alt="" className="w-9 h-9 rounded-full" />
                )}
                <span>{item.display_name ?? item.viewer_id}</span>
            </div>
            {withLeader && hasBadge && <span className="ec-leader" aria-hidden="true" />}
            <CreditValueBadge badge={badge} type={item.type} tier={tier} isTop={isTop} />
        </div>
    )
}
