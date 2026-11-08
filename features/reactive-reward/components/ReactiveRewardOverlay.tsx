"use client";

import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { POSITION_CLASSES } from "../constants";
import { useReactiveRewardOverlay } from "../hooks/useReactiveRewardOverlay";

/** The OBS Browser Source page: a transparent canvas that shows one reaction at a time. */
export function ReactiveRewardOverlay({ userId, overlayKey }: { userId: string; overlayKey?: string }) {
    const { current, audioBlocked, enableAudio, video } = useReactiveRewardOverlay(userId, overlayKey);
    const event = current?.event;

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden bg-transparent">
            {event && event.media_type !== "AUDIO" && (
                <div className={cn("absolute inset-0 flex p-8", POSITION_CLASSES[event.position])}>
                    {event.media_type === "IMAGE" ? (
                        current.visible && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={event.jobId}
                                src={event.media_url}
                                alt=""
                                className="max-h-full object-contain animate-in fade-in zoom-in-95 duration-300"
                                style={{ width: `${event.size_percent}%` }}
                            />
                        )
                    ) : (
                        // No crossOrigin: the media URL is a signed link and the element only has to play it
                        <video
                            key={event.jobId}
                            src={event.media_url}
                            playsInline
                            preload="auto"
                            className={cn("max-h-full object-contain", !current.visible && "opacity-0")}
                            style={{ width: `${event.size_percent}%` }}
                            onCanPlay={(videoEvent) => video.onCanPlay(event.jobId, videoEvent.currentTarget)}
                            onEnded={() => video.onEnded(event.jobId)}
                            onError={() => video.onError(event.jobId)}
                        />
                    )}
                </div>
            )}
            {audioBlocked && (
                <button
                    type="button"
                    onClick={enableAudio}
                    className="pointer-events-auto absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg border bg-popover px-3 py-2 text-sm text-foreground"
                >
                    <Volume2 className="size-4" aria-hidden="true" />
                    คลิกเพื่อเปิดเสียง
                </button>
            )}
        </div>
    );
}
