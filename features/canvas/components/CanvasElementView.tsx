"use client"

import { CanvasElement } from "../types";

/**
 * Static render of a single element for the editor stage.
 * Mirrors what CanvasPlayer renders at runtime, minus the transitions —
 * both are DOM so what you position here is what streams.
 */
export function CanvasElementView({ element }: { element: CanvasElement }) {
    if (element.type === "text") {
        const textStyle = (element.text_style ?? {}) as Record<string, string | number>;
        return (
            <div
                className="w-full h-full flex items-center justify-center pointer-events-none"
                style={{
                    textAlign: (textStyle.align as React.CSSProperties["textAlign"]) ?? "center",
                    fontFamily: (textStyle.fontFamily as string) ?? undefined,
                    fontSize: textStyle.fontSize ? `${textStyle.fontSize}px` : "24px",
                    fontWeight: (textStyle.weight as React.CSSProperties["fontWeight"]) ?? "bold",
                    color: (textStyle.color as string) ?? "#ffffff",
                    textShadow: (textStyle.shadow as string) ?? "0 2px 6px rgba(0,0,0,0.6)",
                    WebkitTextStroke: textStyle.stroke ? `1px ${textStyle.stroke}` : undefined,
                }}
            >
                {element.text_content || "ข้อความ"}
            </div>
        );
    }

    if (!element.media?.url) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-muted/60 border border-dashed rounded text-[10px] text-muted-foreground pointer-events-none">
                ยังไม่ได้เลือกไฟล์
            </div>
        );
    }

    if (element.type === "image") {
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
                src={element.media.url}
                alt={element.media.name}
                draggable={false}
                className="w-full h-full object-contain pointer-events-none select-none"
            />
        );
    }

    if (element.type === "video") {
        return (
            <video
                src={element.media.url}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-contain pointer-events-none bg-black/20"
            />
        );
    }

    return null;
}
