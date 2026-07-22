"use client"

import { useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getClipShoutoutEventUrl } from "@/features/clip-shoutout/api/clipShoutout.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useOverlayEvents } from "@/hooks/use-overlay-events";

export default function ClipShoutoutOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [url, setUrl] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useOverlayEvents(userId ? getClipShoutoutEventUrl(userId, key) : null, {
        clip: (data) => {
            if (data.url) {
                setUrl(data.url);
                setIsVisible(true);

                // Duration is in seconds, convert to ms and add a small buffer (e.g. 1s)
                const durationMs = (data.duration ? data.duration * 1000 : 60000) + 3000;

                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    setIsVisible(false);
                    setUrl(null);
                }, durationMs);
            }
        },
    })

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden pointer-events-none relative flex items-center justify-center p-8">
            <div className="absolute top-4 right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md message-overlay-refresh"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>

            {isVisible && url && (
                <div className="shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    <video
                        src={url}
                        autoPlay
                        width="1280"
                        height="720"
                        className="bg-black block"
                    />
                </div>
            )}
        </div>
    )
}
