"use client"

import { useParams, useSearchParams } from "next/navigation"
import { ReactiveRewardOverlay } from "@/features/reactive-reward/components/ReactiveRewardOverlay"

export default function ReactiveRewardOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    return <ReactiveRewardOverlay userId={params.userId as string} overlayKey={searchParams.get("key") ?? undefined} />
}
