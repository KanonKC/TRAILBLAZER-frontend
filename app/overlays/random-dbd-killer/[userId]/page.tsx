"use client"

import { useRef, useState, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getRandomDBDKillerEventUrl } from "@/features/random-dbd-killer/api/randomDBDKiller.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { KillerSpinner, KillerResult, AnimationStyle } from "./KillerSpinner";
import { useOverlayEvents } from "@/hooks/use-overlay-events";

const DISPLAY_DURATION_MS = 10000 // 10 seconds

interface KillerResultEvent {
    killer: KillerResult;
    pool?: KillerResult[];
    animationStyle?: AnimationStyle;
}

export default function RandomDBDKillerOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [result, setResult] = useState<KillerResultEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [seq, setSeq] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useOverlayEvents(userId ? getRandomDBDKillerEventUrl(userId, key) : null, {
        "killer-result": (data: KillerResultEvent) => {
            if (data.killer?.slug && data.killer?.title && data.killer?.image_url) {
                if (timerRef.current) clearTimeout(timerRef.current);
                setResult(data);
                setIsVisible(true);
                setSeq((s) => s + 1);
            } else {
                console.error("Received malformed killer-result payload, ignoring:", data)
            }
        },
    })

    const handleSpinComplete = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setIsVisible(false);
            setResult(null);
        }, DISPLAY_DURATION_MS);
    }, []);

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative flex items-center justify-center p-8">
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

            {isVisible && result && (
                <KillerSpinner
                    key={seq}
                    pool={result.pool && result.pool.length > 0 ? result.pool : [result.killer]}
                    finalKiller={result.killer}
                    animationStyle={result.animationStyle ?? "frame"}
                    onComplete={handleSpinComplete}
                />
            )}
        </div>
    )
}
