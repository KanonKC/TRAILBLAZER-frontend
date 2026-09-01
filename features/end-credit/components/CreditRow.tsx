"use client"

import { useRef } from "react"
import { useCreditRowMotion } from "../hooks/useCreditRowMotion"
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
}

export const CreditRow = ({ item, badge, isTop, showAvatar, withLeader }: CreditRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null)
    const { live, visible } = useCreditRowMotion(rowRef)

    // Topping a section is worth at least a little shine even when the raw number is modest.
    const tier = (isTop ? Math.max(1, badgeTier(badge)) : badgeTier(badge)) as CreditTier
    const hasBadge = badge.kind !== "none"

    return (
        <div
            ref={rowRef}
            className="ec-row text-2xl font-medium drop-shadow"
            data-type={item.type}
            data-tier={tier}
            data-live={live ? "" : undefined}
            data-visible={visible ? "" : undefined}
        >
            <div className="ec-row-name">
                {showAvatar && item.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.avatar_url} alt="" className="w-9 h-9 rounded-full" />
                )}
                <span>{item.display_name ?? item.viewer_id}</span>
            </div>
            {withLeader && hasBadge && <span className="ec-leader" aria-hidden="true" />}
            <CreditValueBadge badge={badge} type={item.type} tier={tier} isTop={isTop} live={live} />
        </div>
    )
}
