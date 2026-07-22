"use client"

import { useMemo, useRef } from "react";
import Moveable, { OnDrag, OnResize, OnRotate } from "react-moveable";
import { CanvasElement } from "../types";
import { CanvasElementView } from "./CanvasElementView";
import { useElementSize } from "@/hooks/use-element-size";

/** Handles rendered around the selection: 4 corners + 4 edge midpoints. */
const EIGHT_HANDLES = ["nw", "n", "ne", "w", "e", "sw", "s", "se"];

interface CanvasStageProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    /** When set, elements outside their time window are dimmed (timeline scrubbing). */
    currentTimeMs?: number;
    onSelect: (id: string | null) => void;
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
}

export function CanvasStage({
    elements,
    selectedElementId,
    currentTimeMs,
    onSelect,
    onChange,
}: CanvasStageProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    /** Stage pixel size — moveable speaks px, our model stores % of the stage. */
    const stage = useElementSize(stageRef);

    // Audio has no visual footprint — it lives in its own track below the stage.
    const visualElements = useMemo(
        () => elements.filter((el) => el.type !== "audio").sort((a, b) => a.z_index - b.z_index),
        [elements]
    );

    const selected = visualElements.find((el) => el.id === selectedElementId) ?? null;

    // Moveable resolves these selectors itself, so there is no need to hold DOM
    // nodes in state (which would mean reading refs during render or an effect).
    const targetSelector = selectedElementId ? `[data-canvas-el="${selectedElementId}"]` : null;
    const guidelineSelectors = useMemo(
        () =>
            visualElements
                .filter((el) => el.id !== selectedElementId)
                .map((el) => `[data-canvas-el="${el.id}"]`),
        [visualElements, selectedElementId]
    );

    const handleDrag = (e: OnDrag) => {
        if (!selected || !stage.width || !stage.height) return;
        onChange(selected.id, {
            x: clampPct(selected.x + (e.delta[0] / stage.width) * 100),
            y: clampPct(selected.y + (e.delta[1] / stage.height) * 100),
        });
    };

    /**
     * Resizing anchors the opposite edge/corner, so the element's centre moves by
     * half the size delta — along the element's own axes, which are rotated when
     * the element is rotated. Moveable gives us the new dimensions and the drag
     * direction; placing the centre correctly is the part we own.
     */
    const handleResize = (e: OnResize) => {
        if (!selected || !stage.width || !stage.height) return;
        const { width: w, height: h } = stage;

        const newWidthPct = clampPct((e.width / w) * 100);
        const newHeightPct = clampPct((e.height / h) * 100);

        const deltaWPct = newWidthPct - selected.width;
        const deltaHPct = newHeightPct - selected.height;

        const [dirX, dirY] = e.direction;
        const offsetX = (deltaWPct / 2) * dirX;
        const offsetY = (deltaHPct / 2) * dirY;

        // Convert the offset from the element's rotated frame into stage space.
        // Percentages are relative to different axes, so go through px and back.
        const theta = (selected.rotation * Math.PI) / 180;
        const offsetXpx = (offsetX / 100) * w;
        const offsetYpx = (offsetY / 100) * h;
        const rotatedXpx = offsetXpx * Math.cos(theta) - offsetYpx * Math.sin(theta);
        const rotatedYpx = offsetXpx * Math.sin(theta) + offsetYpx * Math.cos(theta);

        onChange(selected.id, {
            width: newWidthPct,
            height: newHeightPct,
            x: clampPct(selected.x + (rotatedXpx / w) * 100),
            y: clampPct(selected.y + (rotatedYpx / h) * 100),
        });
    };

    const handleRotate = (e: OnRotate) => {
        if (!selected) return;
        onChange(selected.id, { rotation: Math.round(e.rotation) });
    };

    return (
        <div
            ref={stageRef}
            className="relative w-full aspect-video bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f9fafb_0%_50%)] bg-[length:20px_20px] rounded-lg overflow-hidden border select-none"
            onPointerDown={(e) => {
                if (e.target === stageRef.current) onSelect(null);
            }}
        >
            {visualElements.map((element) => {
                const isOutsideTime =
                    currentTimeMs !== undefined &&
                    (currentTimeMs < element.start_delay_ms ||
                        currentTimeMs > element.start_delay_ms + element.duration_ms);

                return (
                    <div
                        key={element.id}
                        data-canvas-el={element.id}
                        onPointerDown={(e) => { e.stopPropagation(); onSelect(element.id); }}
                        className={`absolute cursor-move ${isOutsideTime ? "opacity-20" : ""}`}
                        style={{
                            // Model stores the centre; render as a plain box so moveable's
                            // geometry lines up, and keep rotate as the only transform.
                            left: `${element.x - element.width / 2}%`,
                            top: `${element.y - element.height / 2}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            transform: `rotate(${element.rotation}deg)`,
                            zIndex: element.z_index,
                            opacity: isOutsideTime ? undefined : element.opacity,
                        }}
                    >
                        <CanvasElementView element={element} />
                    </div>
                );
            })}

            {targetSelector && selected && (
                <Moveable
                    key={selected.id}
                    target={targetSelector}
                    draggable
                    resizable
                    rotatable
                    // Images and video keep their aspect ratio; text can stretch freely.
                    keepRatio={selected.type === "image" || selected.type === "video"}
                    renderDirections={EIGHT_HANDLES}
                    throttleRotate={1}
                    origin={false}
                    snappable
                    snapThreshold={6}
                    elementGuidelines={guidelineSelectors}
                    verticalGuidelines={[0, 25, 50, 75, 100].map((p) => (p / 100) * stage.width)}
                    horizontalGuidelines={[0, 25, 50, 75, 100].map((p) => (p / 100) * stage.height)}
                    onDrag={handleDrag}
                    onResize={handleResize}
                    onRotate={handleRotate}
                />
            )}
        </div>
    );
}

function clampPct(value: number) {
    return Math.min(200, Math.max(0, value));
}
