"use client"

import { useCallback, useMemo, useRef } from "react";
import { CanvasElement } from "../types";
import { Image as ImageIcon, Video, Music, Type } from "lucide-react";
import { useElementSize } from "@/hooks/use-element-size";

const TYPE_META: Record<CanvasElement["type"], { icon: React.ComponentType<{ className?: string }>; clip: string }> = {
    image: { icon: ImageIcon, clip: "bg-sky-500/80 border-sky-400" },
    video: { icon: Video, clip: "bg-violet-500/80 border-violet-400" },
    text: { icon: Type, clip: "bg-amber-500/80 border-amber-400" },
    audio: { icon: Music, clip: "bg-emerald-500/80 border-emerald-400" },
};

const TICK_STEPS = [100, 250, 500, 1000, 2000, 5000, 10000];
const MIN_CLIP_MS = 100;
const SNAP_MS = 50;

type DragMode = "move" | "trim-start" | "trim-end";

interface CanvasTimelineProps {
    elements: CanvasElement[];
    canvasDurationMs: number;
    selectedElementId: string | null;
    currentTimeMs: number;
    onSelect: (id: string) => void;
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
    onTimeChange: (ms: number) => void;
}

export function CanvasTimeline({
    elements,
    canvasDurationMs,
    selectedElementId,
    currentTimeMs,
    onSelect,
    onChange,
    onTimeChange,
}: CanvasTimelineProps) {
    const laneRef = useRef<HTMLDivElement>(null);
    const lane = useElementSize(laneRef);

    // Visual elements on top, audio grouped underneath — the familiar NLE layout.
    const tracks = useMemo(() => {
        const visual = elements.filter((el) => el.type !== "audio").sort((a, b) => b.z_index - a.z_index);
        const audio = elements.filter((el) => el.type === "audio").sort((a, b) => a.start_delay_ms - b.start_delay_ms);
        return { visual, audio };
    }, [elements]);

    const tickStep = useMemo(() => {
        const width = lane.width || 800;
        return TICK_STEPS.find((step) => (step / canvasDurationMs) * width >= 45) ?? TICK_STEPS[TICK_STEPS.length - 1];
    }, [canvasDurationMs, lane.width]);

    const ticks = useMemo(() => {
        const out: number[] = [];
        for (let t = 0; t <= canvasDurationMs; t += tickStep) out.push(t);
        return out;
    }, [canvasDurationMs, tickStep]);

    const pctOf = (ms: number) => (ms / canvasDurationMs) * 100;

    const msFromClientX = useCallback((clientX: number) => {
        const rect = laneRef.current?.getBoundingClientRect();
        if (!rect) return 0;
        const ratio = (clientX - rect.left) / rect.width;
        return Math.round(Math.min(1, Math.max(0, ratio)) * canvasDurationMs);
    }, [canvasDurationMs]);

    const scrub = useCallback((e: React.PointerEvent) => {
        onTimeChange(msFromClientX(e.clientX));
        const onMove = (ev: PointerEvent) => onTimeChange(msFromClientX(ev.clientX));
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }, [msFromClientX, onTimeChange]);

    const startClipDrag = useCallback((e: React.PointerEvent, element: CanvasElement, mode: DragMode) => {
        e.stopPropagation();
        onSelect(element.id);

        const originMs = msFromClientX(e.clientX);
        const startDelay = element.start_delay_ms;
        const duration = element.duration_ms;

        const onMove = (ev: PointerEvent) => {
            const deltaMs = Math.round((msFromClientX(ev.clientX) - originMs) / SNAP_MS) * SNAP_MS;

            if (mode === "move") {
                const next = Math.min(canvasDurationMs - duration, Math.max(0, startDelay + deltaMs));
                onChange(element.id, { start_delay_ms: next });
                return;
            }

            if (mode === "trim-start") {
                // Left edge moves; the clip's end stays put.
                const maxShift = duration - MIN_CLIP_MS;
                const shift = Math.min(maxShift, Math.max(-startDelay, deltaMs));
                onChange(element.id, {
                    start_delay_ms: startDelay + shift,
                    duration_ms: duration - shift,
                });
                return;
            }

            const maxDuration = canvasDurationMs - startDelay;
            onChange(element.id, {
                duration_ms: Math.min(maxDuration, Math.max(MIN_CLIP_MS, duration + deltaMs)),
            });
        };

        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }, [msFromClientX, canvasDurationMs, onChange, onSelect]);

    const renderTrack = (element: CanvasElement) => {
        const meta = TYPE_META[element.type];
        const Icon = meta.icon;
        const isSelected = element.id === selectedElementId;
        const label = element.type === "text"
            ? (element.text_content || "ข้อความ")
            : element.media?.name ?? element.type;

        return (
            <div key={element.id} className="flex items-stretch h-9">
                <button
                    type="button"
                    onClick={() => onSelect(element.id)}
                    className={`w-36 shrink-0 flex items-center gap-1.5 px-2 text-xs border-r truncate text-left ${isSelected ? "bg-primary/10 font-medium" : "bg-muted/30"}`}
                    title={label}
                >
                    <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{label}</span>
                </button>

                <div className="relative flex-1 border-b bg-muted/10">
                    <div
                        onPointerDown={(e) => startClipDrag(e, element, "move")}
                        className={`absolute top-1 bottom-1 rounded border flex items-center cursor-grab active:cursor-grabbing ${meta.clip} ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}`}
                        style={{
                            left: `${pctOf(element.start_delay_ms)}%`,
                            width: `${Math.max(pctOf(element.duration_ms), 0.5)}%`,
                        }}
                    >
                        <div
                            onPointerDown={(e) => startClipDrag(e, element, "trim-start")}
                            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-white/60 rounded-l"
                        />
                        <span className="px-2 text-[10px] text-white/95 truncate pointer-events-none">
                            {(element.duration_ms / 1000).toFixed(1)}s
                        </span>
                        <div
                            onPointerDown={(e) => startClipDrag(e, element, "trim-end")}
                            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-white/60 rounded-r"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Ruler */}
            <div className="flex items-stretch border-b bg-muted/40">
                <div className="w-36 shrink-0 border-r px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    {(currentTimeMs / 1000).toFixed(2)}s
                </div>
                <div
                    className="relative flex-1 h-7 cursor-pointer"
                    onPointerDown={scrub}
                >
                    {ticks.map((t) => (
                        <div key={t} className="absolute top-0 bottom-0 flex flex-col justify-between pointer-events-none" style={{ left: `${pctOf(t)}%` }}>
                            <span className="text-[9px] text-muted-foreground pl-1 leading-none pt-1">{(t / 1000).toFixed(t % 1000 === 0 ? 0 : 1)}s</span>
                            <div className="w-px h-2 bg-border" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tracks + playhead overlay */}
            <div className="relative">
                {tracks.visual.map(renderTrack)}

                {tracks.audio.length > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 border-y">
                        <Music className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Audio</span>
                    </div>
                )}
                {tracks.audio.map(renderTrack)}

                {elements.length === 0 && (
                    <p className="text-sm text-muted-foreground p-4">ยังไม่มี element — เพิ่มจากแถบ Layers</p>
                )}

                {/* Playhead spans every track, offset past the 9rem label gutter */}
                {elements.length > 0 && (
                    <div className="absolute top-0 bottom-0 left-36 right-0 pointer-events-none">
                        <div
                            className="absolute top-0 bottom-0 w-px bg-red-500"
                            style={{ left: `${pctOf(currentTimeMs)}%` }}
                        >
                            <div className="absolute -top-0 -translate-x-1/2 w-2 h-2 rotate-45 bg-red-500" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
