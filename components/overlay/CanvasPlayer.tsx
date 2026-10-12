"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { CanvasPlayback } from "@/features/canvas/types"

interface CanvasPlayerProps {
    /** null renders nothing. A new object (or a new playId) restarts playback. */
    playback: CanvasPlayback | null
    /** Changes per trigger so the same canvas twice in a row still replays. */
    playId?: string | null
    /** Called once when the canvas genuinely ends (or cannot play at all). */
    onFinished?: () => void
    className?: string
}

/**
 * Plays a canvas template full-frame:
 * - image_audio: shows the image while the audio plays; a silent image stays
 *   up for the canvas's duration.
 * - video: plays the video to its end.
 *
 * Any playback failure ends the canvas immediately — the overlay queue must
 * never sit on something the browser refused to play.
 */
export function CanvasPlayer({ playback, playId, onFinished, className }: CanvasPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const finishedRef = useRef(false)
    const onFinishedRef = useRef(onFinished)
    onFinishedRef.current = onFinished

    const finish = () => {
        if (finishedRef.current) return
        finishedRef.current = true
        onFinishedRef.current?.()
    }

    useEffect(() => {
        if (!playback) return
        finishedRef.current = false
        const volume = Math.min(1, Math.max(0, (playback.volume ?? 100) / 100))
        const audio = audioRef.current
        const video = videoRef.current
        let timer: ReturnType<typeof setTimeout> | null = null

        if (playback.template_type === "video") {
            if (!video || !playback.video_url) {
                finish()
                return
            }
            video.volume = volume
            video.currentTime = 0
            video.play().catch((e) => {
                console.error("Failed to play canvas video:", e)
                finish()
            })
        } else if (playback.audio_url) {
            if (!audio) {
                finish()
                return
            }
            audio.volume = volume
            audio.currentTime = 0
            audio.play().catch((e) => {
                console.error("Failed to play canvas audio:", e)
                finish()
            })
        } else {
            timer = setTimeout(finish, playback.duration_ms)
        }

        return () => {
            if (timer) clearTimeout(timer)
            audio?.pause()
            video?.pause()
        }
    }, [playback, playId])

    if (!playback) return null

    return (
        <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
            {playback.template_type === "video" ? (
                playback.video_url && (
                    <video
                        key={playId ?? playback.video_url}
                        ref={videoRef}
                        src={playback.video_url}
                        playsInline
                        className="max-h-full max-w-full object-contain"
                        onEnded={finish}
                        onError={finish}
                    />
                )
            ) : (
                <>
                    {playback.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={playback.image_url} alt="" className="max-h-full max-w-full object-contain" />
                    )}
                    {playback.audio_url && (
                        <audio
                            key={playId ?? playback.audio_url}
                            ref={audioRef}
                            src={playback.audio_url}
                            className="hidden"
                            onEnded={finish}
                            onError={finish}
                        />
                    )}
                </>
            )}
        </div>
    )
}
