"use client";

import { useState } from "react";
import { Film, FileX2, ImageIcon, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactionMediaType } from "../types";

interface MediaThumbProps {
    mediaType: ReactionMediaType;
    url?: string | null;
    /** The file this points at was deleted from the library. */
    missing?: boolean;
    className?: string;
    iconClassName?: string;
}

/** A square preview of a reaction's media: the image, a video's first frame, or an icon for sound. */
export function MediaThumb({ mediaType, url, missing = false, className, iconClassName }: MediaThumbProps) {
    // A URL that stops working (an expired signed link) falls back to the icon instead of a broken image
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const usable = !missing && !!url && failedUrl !== url;

    return (
        <span
            className={cn(
                "bg-secondary text-muted-foreground relative grid aspect-square place-items-center overflow-hidden rounded-md",
                className,
            )}
        >
            {missing ? (
                <FileX2 className={cn("size-6", iconClassName)} aria-hidden="true" />
            ) : mediaType === "AUDIO" ? (
                <AudioLines className={cn("size-6", iconClassName)} aria-hidden="true" />
            ) : mediaType === "VIDEO" ? (
                <>
                    {usable ? (
                        <video
                            // #t shows a frame instead of a black rectangle while the metadata loads
                            src={`${url}#t=0.1`}
                            muted
                            playsInline
                            preload="metadata"
                            className="size-full object-cover"
                            onError={() => setFailedUrl(url ?? null)}
                        />
                    ) : (
                        <Film className={cn("size-6", iconClassName)} aria-hidden="true" />
                    )}
                    {usable && <Film className="bg-card/80 absolute right-1 bottom-1 size-5 rounded p-0.5 text-foreground" aria-hidden="true" />}
                </>
            ) : usable ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="size-full object-cover" onError={() => setFailedUrl(url ?? null)} />
            ) : (
                <ImageIcon className={cn("size-6", iconClassName)} aria-hidden="true" />
            )}
        </span>
    );
}
