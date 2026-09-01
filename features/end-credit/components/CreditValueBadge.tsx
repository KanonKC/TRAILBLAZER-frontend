"use client"

import { useCountUp } from "../hooks/useCreditRowMotion"
import { CreditBadge, CreditTier, countUpDurationMs, ringCountFor } from "../tiers"
import { EndCreditRecordType } from "../types"

const CrownIcon = () => (
    <svg className="ec-crown" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2.6 6.4 7.4 10 12 3.2 16.6 10l4.8-3.6-1.7 11H4.3l-1.7-11Zm1.7 13.1h15.4v1.9H4.3v-1.9Z" />
    </svg>
)

interface CreditValueBadgeProps {
    badge: CreditBadge
    type: EndCreditRecordType
    tier: CreditTier
    isTop: boolean
    live: boolean
}

export const CreditValueBadge = ({ badge, type, tier, isTop, live }: CreditValueBadgeProps) => {
    const target = badge.kind === "value" ? badge.value : 0
    const counted = useCountUp(target, live, countUpDurationMs(target))

    if (badge.kind === "none") return null

    if (badge.kind === "new") {
        return <span className="ec-badge ec-badge--new">{badge.label}</span>
    }

    if (badge.kind === "text") {
        return (
            <span className="ec-badge">
                <span className="ec-badge-value">{badge.text}</span>
            </span>
        )
    }

    // The final string reserves the badge's width up front so the leader dots never twitch
    // while the counter is still rolling.
    const finalText = badge.value.toLocaleString("en-US")
    const rings = type === "raid" ? Array.from({ length: ringCountFor(tier) }) : []

    return (
        <span className="ec-badge" data-shine={tier >= 4 || isTop ? "" : undefined}>
            {rings.map((_, index) => (
                <span
                    key={index}
                    className="ec-ring"
                    style={{ animationDelay: `${index * 0.16}s` }}
                    aria-hidden="true"
                />
            ))}
            {isTop && <CrownIcon />}
            <span className="ec-badge-value" style={{ minWidth: `${finalText.length}ch` }}>
                {counted.toLocaleString("en-US")}
            </span>
            <span className="ec-badge-unit">{badge.unit}</span>
        </span>
    )
}
