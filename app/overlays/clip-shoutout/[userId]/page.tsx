"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getClipShoutoutEventUrl } from "@/features/clip-shoutout/api/clipShoutout.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ackOverlayJob } from "@/lib/overlay-queue";
import { useOverlayEventSource } from "@/hooks/use-overlay-event-source";


export default function ClipShoutoutOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [url, setUrl] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const jobIdRef = useRef<string | null>(null);

    // Told to the backend queue so the next raid's shoutout, chat reply and
    // clip all go out together as soon as this clip is done.
    const finishCurrent = useCallback(() => {
        setIsVisible(false);
        setUrl(null);
        const jobId = jobIdRef.current;
        jobIdRef.current = null;
        ackOverlayJob("clip-shoutout", userId, jobId ?? undefined, key);
    }, [userId, key])

    useOverlayEventSource(userId ? getClipShoutoutEventUrl(userId, key) : null, "clip", (event) => {
            try {
                const data = JSON.parse(event.data)
                console.log("Received clip event:", data)
                if (data.url) {
                    setUrl(data.url);
                    setIsVisible(true);
                    jobIdRef.current = data.jobId ?? null;

                    // The queue's own figure when it sends one, otherwise the
                    // clip length plus a small buffer.
                    const durationMs = data.duration_ms ?? ((data.duration ? data.duration * 1000 : 60000) + 3000);

                    if (timerRef.current) clearTimeout(timerRef.current);
                    timerRef.current = setTimeout(finishCurrent, durationMs);
                }
            } catch (error) {
                console.error("Failed to parse event data:", error)
            }
    });

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    // Get parent domain for Twitch embed
    const parentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

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
                        // muted={false} // React video tag specific: muted prop is boolean, false by default. But browsers often block autoplay with sound. 
                        // However, since this is likely an overlay in OBS, it might be allowed.
                        width="1280"
                        height="720"
                        className="bg-black block"
                        onEnded={finishCurrent}
                    />
                </div>
            )}
        </div>
    )
}
