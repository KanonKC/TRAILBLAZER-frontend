"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { fetchEndCreditOverlayData, EndCreditOverlayData } from "@/features/end-credit/api/endCredit.api"
import { EndCreditRecordType, EndCreditViewerRecord } from "@/features/end-credit/types"

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

    const [data, setData] = useState<EndCreditOverlayData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!userId) return
        fetchEndCreditOverlayData(userId, key)
            .then(setData)
            .catch((error) => console.error("Failed to fetch end credit records:", error))
            .finally(() => setIsLoading(false))
    }, [userId, key])

    if (isLoading || !data) {
        return <div className="w-screen h-screen bg-transparent overflow-hidden" />
    }

    const grouped = data.records.reduce<Record<string, EndCreditViewerRecord[]>>((acc, record) => {
        (acc[record.type] ??= []).push(record)
        return acc
    }, {})

    const headerFor = (type: EndCreditRecordType): string => {
        switch (type) {
            case "follow": return data.followers_header || DEFAULT_HEADERS.follow
            case "sub": return data.subscribes_header || DEFAULT_HEADERS.sub
            case "raid": return data.raids_header || DEFAULT_HEADERS.raid
            case "bit": return data.bits_header || DEFAULT_HEADERS.bit
        }
    }

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center p-12">
            <div className="w-full max-w-3xl space-y-8 text-white">
                {Object.entries(grouped).map(([type, items]) => (
                    <div key={type} className="space-y-3">
                        <h2 className="text-2xl font-bold drop-shadow-lg">{headerFor(type as EndCreditRecordType)}</h2>
                        <div className="flex flex-wrap gap-3">
                            {items.map((item) => (
                                <span
                                    key={item.id}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-lg font-medium drop-shadow"
                                >
                                    {data.is_show_viewer_avatars && item.avatar_url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.avatar_url}
                                            alt=""
                                            className="w-6 h-6 rounded-full"
                                        />
                                    )}
                                    {item.display_name ?? item.viewer_id}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
