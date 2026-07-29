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
    hiddenIds?: Set<string>;
    lockedIds?: Set<string>;
    onSelect: (id: string | null) => void;
    onChange: (id: string, patch: Partial<CanvasElement>) => void;
}

export function CanvasStage({
    elements,
    selectedElementId,
    hiddenIds,
    lockedIds,
    onSelect,
    onChange,
}: CanvasStageProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const moveableRef = useRef<Moveable>(null);
    /** Stage pixel size — moveable speaks px, our model stores % of the stage. */
    const stage = useElementSize(stageRef);

    // Audio has no visual footprint — it lives in its own track below the stage.
    // Hidden elements are a preview-only convenience, not deleted, so they stay out
    // of the stage entirely rather than just being dimmed.
    const visualElements = useMemo(
        () =>
            elements
                .filter((el) => el.type !== "audio" && !hiddenIds?.has(el.id))
                .sort((a, b) => a.z_index - b.z_index),
        [elements, hiddenIds]
    );

    // A locked element can't be the active Moveable target — selection is already
    // blocked at the pointerdown handler below, but this is a second guard in case
    // something else set selectedElementId to a locked id.
    const selected = selectedElementId && !lockedIds?.has(selectedElementId)
        ? visualElements.find((el) => el.id === selectedElementId) ?? null
        : null;

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

    // These were previously recreated as new array literals on every render — since
    // a resize/drag gesture commits state (and re-renders) every frame, Moveable was
    // getting brand-new guideline arrays continuously mid-gesture, which can cause it
    // to reset/stutter its own tracking. Memoizing keeps the reference stable across
    // frames; it only actually changes when the stage is resized.
    const verticalGuidelines = useMemo(
        () => [0, 25, 50, 75, 100].map((p) => (p / 100) * stage.width),
        [stage.width]
    );
    const horizontalGuidelines = useMemo(
        () => [0, 25, 50, 75, 100].map((p) => (p / 100) * stage.height),
        [stage.height]
    );

    // Confirmed by watching real resize events: e.width/e.height oscillate between
    // two values on a single continuous gesture when we feed the computed geometry
    // straight back into the target's own CSS mid-gesture (whether via parent or
    // local React state) — Moveable's own rect tracking gets confused by us moving
    // its target out from under it every frame. So during the LIVE phase we now
    // only mutate the DOM directly (cheap, and it's what Moveable expects to own),
    // and only touch React state once, at the very end of the gesture.
    const liveDrag = (e: OnDrag) => {
        (e.target as HTMLElement).style.transform = e.transform;
    };
    const liveResize = (e: OnResize) => {
        const target = e.target as HTMLElement;
        target.style.width = `${e.width}px`;
        target.style.height = `${e.height}px`;
        target.style.transform = e.drag.transform;
    };
    const liveRotate = (e: OnRotate) => {
        (e.target as HTMLElement).style.transform = e.transform;
    };

    /**
     * Reads the element's on-screen centre straight from the DOM instead of
     * recomputing it from deltas — rotating or resizing a box moves its edges but
     * never its centre, so this is correct for drag, resize, and rotate alike, and
     * it can't drift from whatever was visually shown during the live phase.
     */
    const centreFromRect = (target: HTMLElement) => {
        const stageEl = stageRef.current;
        if (!stageEl) return null;
        const stageRect = stageEl.getBoundingClientRect();
        if (!stageRect.width || !stageRect.height) return null;
        const targetRect = target.getBoundingClientRect();
        return {
            x: clampPct(((targetRect.left + targetRect.width / 2 - stageRect.left) / stageRect.width) * 100),
            y: clampPct(((targetRect.top + targetRect.height / 2 - stageRect.top) / stageRect.height) * 100),
        };
    };

    /**
     * React only touches a DOM style property when it differs from what it last
     * rendered — it doesn't know we mutated `transform` directly during the live
     * phase. If the commit doesn't happen to change rotation (true for a plain
     * drag or resize), React would skip re-setting `transform` and the stale
     * manual value would be left stacked on top of the freshly committed left/top.
     * Resetting it back to baseline right after commit avoids that. `updateRect`
     * nudges Moveable to re-measure, since it caches the target's rect internally
     * and has no way to know React changed its geometry after the gesture ended.
     */
    const resetLiveTransform = (target: HTMLElement, rotationDeg: number) => {
        target.style.transform = `rotate(${rotationDeg}deg)`;
        requestAnimationFrame(() => moveableRef.current?.updateRect());
    };

    /**
     * Same bailout-diffing risk applies to `width`/`height`, but only resize ever
     * sets those manually — clearing them after every gesture (including drag/
     * rotate, which never touch them) risked leaving them at "" when the commit
     * didn't change size, collapsing the box to its content's intrinsic size.
     */
    const resetLiveSize = (target: HTMLElement) => {
        target.style.width = "";
        target.style.height = "";
    };

    const handleDragEnd = (e: { target: Element | SVGElement }) => {
        if (!selected) return;
        const target = e.target as HTMLElement;
        const centre = centreFromRect(target);
        if (centre) onChange(selected.id, centre);
        resetLiveTransform(target, selected.rotation);
    };

    const handleResizeEnd = (e: { target: Element | SVGElement; lastEvent?: OnResize }) => {
        if (!selected) return;
        const lastEvent = e.lastEvent;
        const stageEl = stageRef.current;
        if (!lastEvent || !stageEl) return;
        const stageRect = stageEl.getBoundingClientRect();
        if (!stageRect.width || !stageRect.height) return;
        const target = e.target as HTMLElement;
        const centre = centreFromRect(target);
        onChange(selected.id, {
            width: clampPct((lastEvent.width / stageRect.width) * 100),
            height: clampPct((lastEvent.height / stageRect.height) * 100),
            ...(centre ?? {}),
        });
        resetLiveSize(target);
        resetLiveTransform(target, selected.rotation);
    };

    const handleRotateEnd = (e: { target: Element | SVGElement; lastEvent?: OnRotate }) => {
        if (!selected) return;
        const lastEvent = e.lastEvent;
        if (!lastEvent) return;
        const rotation = Math.round(lastEvent.rotation);
        onChange(selected.id, { rotation });
        resetLiveTransform(e.target as HTMLElement, rotation);
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
                const isLocked = !!lockedIds?.has(element.id);
                return (
                    <div
                        key={element.id}
                        data-canvas-el={element.id}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            // A locked element can't be picked from the stage — it stays
                            // visible, but only the layer list can select/unlock it.
                            if (!isLocked) onSelect(element.id);
                        }}
                        className={`absolute ${isLocked ? "cursor-not-allowed" : "cursor-move"}`}
                        style={{
                            // Model stores the centre; render as a plain box so moveable's
                            // geometry lines up, and keep rotate as the only transform.
                            left: `${element.x - element.width / 2}%`,
                            top: `${element.y - element.height / 2}%`,
                            width: `${element.width}%`,
                            height: `${element.height}%`,
                            transform: `rotate(${element.rotation}deg)`,
                            zIndex: element.z_index,
                            opacity: element.opacity,
                        }}
                    >
                        <CanvasElementView element={element} />
                    </div>
                );
            })}

            {targetSelector && selected && (
                <Moveable
                    ref={moveableRef}
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
                    verticalGuidelines={verticalGuidelines}
                    horizontalGuidelines={horizontalGuidelines}
                    onDrag={liveDrag}
                    onDragEnd={handleDragEnd}
                    onResize={liveResize}
                    onResizeEnd={handleResizeEnd}
                    onRotate={liveRotate}
                    onRotateEnd={handleRotateEnd}
                />
            )}
        </div>
    );
}

function clampPct(value: number) {
    return Math.min(200, Math.max(0, value));
}
