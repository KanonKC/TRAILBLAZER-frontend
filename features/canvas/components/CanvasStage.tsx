"use client"

import { useCallback, useRef } from "react";
import { CanvasElement } from "../types";

interface CanvasStageProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelect: (id: string | null) => void;
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
}

export function CanvasStage({ elements, selectedElementId, onSelect, onChange }: CanvasStageProps) {
    const stageRef = useRef<HTMLDivElement>(null);

    const startDrag = useCallback((e: React.PointerEvent, element: CanvasElement) => {
        e.stopPropagation();
        onSelect(element.id);
        const stage = stageRef.current;
        if (!stage) return;
        const rect = stage.getBoundingClientRect();

        const onMove = (moveEvent: PointerEvent) => {
            const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
            const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
            onChange(element.id, {
                x: Math.min(100, Math.max(0, x)),
                y: Math.min(100, Math.max(0, y)),
            });
        };
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }, [onSelect, onChange]);

    const startResize = useCallback((e: React.PointerEvent, element: CanvasElement) => {
        e.stopPropagation();
        const stage = stageRef.current;
        if (!stage) return;
        const rect = stage.getBoundingClientRect();

        const onMove = (moveEvent: PointerEvent) => {
            const width = Math.abs(((moveEvent.clientX - rect.left) / rect.width) * 100 - element.x) * 2;
            const height = Math.abs(((moveEvent.clientY - rect.top) / rect.height) * 100 - element.y) * 2;
            onChange(element.id, {
                width: Math.min(100, Math.max(2, width)),
                height: Math.min(100, Math.max(2, height)),
            });
        };
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }, [onChange]);

    return (
        <div
            ref={stageRef}
            className="relative w-full aspect-video bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f9fafb_0%_50%)] bg-[length:20px_20px] rounded-lg overflow-hidden border"
            onPointerDown={() => onSelect(null)}
        >
            {elements.slice().sort((a, b) => a.z_index - b.z_index).map((element) => {
                const isSelected = element.id === selectedElementId;
                return (
                    <div
                        key={element.id}
                        onPointerDown={(e) => startDrag(e, element)}
                        className={`absolute cursor-move flex items-center justify-center text-xs select-none ${isSelected ? "outline outline-2 outline-primary" : "outline outline-1 outline-dashed outline-muted-foreground/40"
                            }`}
                        style={{
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                            zIndex: element.z_index,
                            opacity: element.opacity,
                            background: element.type === "text" ? "rgba(59,130,246,0.08)" : "rgba(0,0,0,0.05)",
                        }}
                    >
                        <span className="truncate px-1 pointer-events-none bg-background/70 rounded">
                            {element.type === "text" ? (element.text_content || "Text") : element.media?.name ?? element.type}
                        </span>

                        {isSelected && (
                            <div
                                onPointerDown={(e) => startResize(e, element)}
                                className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-primary cursor-nwse-resize"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
