"use client"

import { useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { getDropImageEventUrl } from "@/features/drop-image/api/dropImage.api";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useOverlayEvents } from "@/hooks/use-overlay-events";

export default function DropImageOverlayPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const userId = params.userId as string
    const key = searchParams.get("key") ?? undefined

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useOverlayEvents(userId ? getDropImageEventUrl(userId, key) : null, {
        "image-url": (data) => {
            if (data.url) {
                setImageUrl(data.url);
                setIsVisible(true);

                // Hide the image after 10 seconds
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    setIsVisible(false);
                    setImageUrl(null);
                }, 10000);
            }
        },
    })

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

            {isVisible && imageUrl && (
                <div className="animate-in fade-in zoom-in duration-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt="Drop Image"
                        className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                    />
                </div>
            )}
        </div>
    )
}
