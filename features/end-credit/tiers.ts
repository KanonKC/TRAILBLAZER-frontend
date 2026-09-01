import { EndCreditRecordType, EndCreditViewerRecord } from "./types"

/** 0 = plain, 4 = top tier. Drives colour, scale, glow and how much motion a badge earns. */
export type CreditTier = 0 | 1 | 2 | 3 | 4

/** The three record types that actually carry a number worth showing off. */
type ValuedRecordType = Exclude<EndCreditRecordType, "follow">

export interface CreditDisplayFlags {
    is_show_sub_months: boolean
    is_show_raid_count: boolean
    is_show_bits_amount: boolean
}

export type CreditBadge =
    | { kind: "none" }
    /** A brand-new subscriber: "1 month" is not a number worth counting up, it is a milestone. */
    | { kind: "new"; label: string }
    | { kind: "value"; value: number; unit: string; tier: CreditTier }
    /** A value we could not read as a number — shown as-is rather than dropped. */
    | { kind: "text"; text: string }

/** A value >= THRESHOLDS[type][i] earns tier i + 1. Bits mirror Twitch's own cheermote steps. */
const THRESHOLDS: Record<ValuedRecordType, [number, number, number, number]> = {
    sub: [2, 6, 12, 24],
    raid: [10, 50, 200, 500],
    bit: [100, 1000, 5000, 10000],
}

const UNITS: Record<ValuedRecordType, string> = {
    sub: "เดือน",
    raid: "คน",
    bit: "Bits",
}

const tierFor = (type: ValuedRecordType, value: number): CreditTier =>
    THRESHOLDS[type].filter(threshold => value >= threshold).length as CreditTier

export const describeBadge = (item: EndCreditViewerRecord, flags: CreditDisplayFlags): CreditBadge => {
    const enabled: Record<EndCreditRecordType, boolean> = {
        follow: false,
        sub: flags.is_show_sub_months,
        raid: flags.is_show_raid_count,
        bit: flags.is_show_bits_amount,
    }
    if (!enabled[item.type] || !item.value) return { kind: "none" }

    const type = item.type as ValuedRecordType
    const value = Number(item.value)
    if (!Number.isFinite(value)) return { kind: "text", text: item.value }
    if (type === "sub" && value <= 1) return { kind: "new", label: "สมาชิกใหม่" }

    return { kind: "value", value, unit: UNITS[type], tier: tierFor(type, value) }
}

export const badgeTier = (badge: CreditBadge): CreditTier =>
    badge.kind === "value" ? badge.tier : badge.kind === "new" ? 1 : 0

/**
 * Hybrid tiering: absolute thresholds decide the look, but whoever tops a section still gets a
 * crown so even a quiet stream has one highlight. Only worth it when there is someone to beat.
 */
export const topBadgeIndex = (badges: CreditBadge[]): number => {
    let best = -1
    let bestValue = 0
    let contenders = 0

    badges.forEach((badge, index) => {
        if (badge.kind !== "value") return
        contenders += 1
        if (badge.value > bestValue) {
            bestValue = badge.value
            best = index
        }
    })

    return contenders >= 2 ? best : -1
}

/** Bigger numbers deserve a longer roll-up, but never long enough to outlive the row on screen. */
export const countUpDurationMs = (value: number): number =>
    value <= 1 ? 0 : Math.min(1200, 380 + Math.log10(value) * 260)

/** Raid shockwave: the more people arrived, the more rings ripple out. */
export const ringCountFor = (tier: CreditTier): number => [0, 1, 2, 3, 3][tier]
