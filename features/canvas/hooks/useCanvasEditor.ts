import { useState, useCallback, useRef, useEffect } from "react";
import { tbToast } from "@/utils/tbToast";
import { updateCanvas, updateCanvasLinks, testCanvas } from "../api/canvas.api";
import { CanvasElement, CanvasElementInput, CanvasWithLinks } from "../types";

const DEFAULT_ELEMENT: Omit<CanvasElementInput, "type"> = {
    x: 50,
    y: 50,
    width: 20,
    height: 20,
    rotation: 0,
    z_index: 0,
    opacity: 1,
    start_delay_ms: 0,
    duration_ms: 3000,
    enter_transition: "fade",
    exit_transition: "fade",
    transition_ms: 400,
    volume: 100,
    loop: false,
};

/** A continuous gesture (drag/resize) settles into a single undo step. */
const HISTORY_COALESCE_MS = 400;
const HISTORY_LIMIT = 50;

let localIdCounter = 0;
const nextLocalId = () => `local-${Date.now()}-${localIdCounter++}`;

export const useCanvasEditor = (initialCanvas: CanvasWithLinks) => {
    const [canvas, setCanvas] = useState<CanvasWithLinks>(initialCanvas);
    const [elements, setElements] = useState<CanvasElement[]>(initialCanvas.elements);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(initialCanvas.elements[0]?.id ?? null);
    const [linkedWidgetIds, setLinkedWidgetIds] = useState<string[]>(
        initialCanvas.links.map((link) => link.widget.id)
    );
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [currentTimeMs, setCurrentTimeMs] = useState(0);

    const [past, setPast] = useState<CanvasElement[][]>([]);
    const [future, setFuture] = useState<CanvasElement[][]>([]);
    const pendingSnapshot = useRef<CanvasElement[] | null>(null);
    const coalesceTimer = useRef<NodeJS.Timeout | null>(null);

    const selectedElement = elements.find((el) => el.id === selectedElementId) ?? null;

    /**
     * Snapshots the pre-change state, coalescing rapid successive edits so a whole
     * drag gesture collapses into one undo step instead of hundreds.
     */
    const recordHistory = useCallback((before: CanvasElement[]) => {
        if (!pendingSnapshot.current) {
            pendingSnapshot.current = before;
        }
        if (coalesceTimer.current) clearTimeout(coalesceTimer.current);
        coalesceTimer.current = setTimeout(() => {
            const snapshot = pendingSnapshot.current;
            pendingSnapshot.current = null;
            if (!snapshot) return;
            setPast((prev) => [...prev, snapshot].slice(-HISTORY_LIMIT));
            setFuture([]);
        }, HISTORY_COALESCE_MS);
    }, []);

    useEffect(() => () => {
        if (coalesceTimer.current) clearTimeout(coalesceTimer.current);
    }, []);

    const mutateElements = useCallback((updater: (prev: CanvasElement[]) => CanvasElement[]) => {
        setElements((prev) => {
            recordHistory(prev);
            return updater(prev);
        });
        setIsDirty(true);
    }, [recordHistory]);

    const addElement = useCallback((type: CanvasElement["type"]) => {
        const newElement = {
            id: nextLocalId(),
            type,
            media_key: null,
            media: null,
            text_content: type === "text" ? "ข้อความใหม่" : null,
            text_style: null,
            ...DEFAULT_ELEMENT,
            z_index: elements.length,
        } as CanvasElement;
        mutateElements((prev) => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    }, [elements.length, mutateElements]);

    const updateElement = useCallback((id: string, patch: Partial<CanvasElement>) => {
        mutateElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
    }, [mutateElements]);

    const removeElement = useCallback((id: string) => {
        mutateElements((prev) => prev.filter((el) => el.id !== id));
        setSelectedElementId((current) => (current === id ? null : current));
    }, [mutateElements]);

    const duplicateElement = useCallback((id: string) => {
        const source = elements.find((el) => el.id === id);
        if (!source) return;
        const copy: CanvasElement = {
            ...source,
            id: nextLocalId(),
            x: Math.min(100, source.x + 2),
            y: Math.min(100, source.y + 2),
            z_index: elements.length,
        };
        mutateElements((prev) => [...prev, copy]);
        setSelectedElementId(copy.id);
    }, [elements, mutateElements]);

    const nudgeElement = useCallback((id: string, dx: number, dy: number) => {
        mutateElements((prev) => prev.map((el) =>
            el.id === id
                ? { ...el, x: Math.min(100, Math.max(0, el.x + dx)), y: Math.min(100, Math.max(0, el.y + dy)) }
                : el
        ));
    }, [mutateElements]);

    /** Reorders z_index from a top-down (highest first) layer list. */
    const reorderLayers = useCallback((orderedIdsTopFirst: string[]) => {
        mutateElements((prev) => {
            const total = orderedIdsTopFirst.length;
            return prev.map((el) => {
                const index = orderedIdsTopFirst.indexOf(el.id);
                return index === -1 ? el : { ...el, z_index: total - 1 - index };
            });
        });
    }, [mutateElements]);

    const moveLayer = useCallback((id: string, direction: "up" | "down") => {
        const sortedTopFirst = [...elements].sort((a, b) => b.z_index - a.z_index).map((el) => el.id);
        const index = sortedTopFirst.indexOf(id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        if (index === -1 || swapWith < 0 || swapWith >= sortedTopFirst.length) return;
        [sortedTopFirst[index], sortedTopFirst[swapWith]] = [sortedTopFirst[swapWith], sortedTopFirst[index]];
        reorderLayers(sortedTopFirst);
    }, [elements, reorderLayers]);

    const undo = useCallback(() => {
        setPast((prevPast) => {
            if (prevPast.length === 0) return prevPast;
            const previous = prevPast[prevPast.length - 1];
            setFuture((f) => [elements, ...f]);
            setElements(previous);
            setIsDirty(true);
            return prevPast.slice(0, -1);
        });
    }, [elements]);

    const redo = useCallback(() => {
        setFuture((prevFuture) => {
            if (prevFuture.length === 0) return prevFuture;
            const next = prevFuture[0];
            setPast((p) => [...p, elements]);
            setElements(next);
            setIsDirty(true);
            return prevFuture.slice(1);
        });
    }, [elements]);

    const updateMeta = useCallback((patch: { name?: string; enabled?: boolean; duration_ms?: number }) => {
        setCanvas((prev) => ({ ...prev, ...patch }));
        setIsDirty(true);
    }, []);

    const toggleWidgetLink = useCallback((widgetId: string) => {
        setLinkedWidgetIds((prev) =>
            prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]
        );
        setIsDirty(true);
    }, []);

    const save = useCallback(async () => {
        setIsSaving(true);
        try {
            const elementInputs: CanvasElementInput[] = elements.map((el) => ({
                id: el.id.startsWith("local-") ? undefined : el.id,
                type: el.type,
                media_key: el.media_key,
                text_content: el.text_content,
                text_style: el.text_style,
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                rotation: el.rotation,
                z_index: el.z_index,
                opacity: el.opacity,
                start_delay_ms: el.start_delay_ms,
                duration_ms: el.duration_ms,
                enter_transition: el.enter_transition,
                exit_transition: el.exit_transition,
                transition_ms: el.transition_ms,
                volume: el.volume,
                loop: el.loop,
            }));

            const updated = await updateCanvas(canvas.id, {
                name: canvas.name,
                enabled: canvas.enabled,
                duration_ms: canvas.duration_ms,
                elements: elementInputs,
            });
            await updateCanvasLinks(canvas.id, linkedWidgetIds);

            setCanvas(updated);
            setElements(updated.elements);
            setIsDirty(false);
            tbToast.success({ title: "บันทึก Canvas สำเร็จ" });
        } catch (error: any) {
            console.error("Failed to save canvas", error);
            tbToast.error({ title: "บันทึก Canvas ไม่สำเร็จ", error: error.response?.data });
        } finally {
            setIsSaving(false);
        }
    }, [canvas, elements, linkedWidgetIds]);

    const test = useCallback(async () => {
        setIsTesting(true);
        try {
            await testCanvas(canvas.id);
            tbToast.success({ title: "ทดสอบ Canvas สำเร็จ" });
        } catch (error) {
            console.error("Failed to test canvas", error);
            tbToast.error({ title: "ทดสอบ Canvas ไม่สำเร็จ" });
        } finally {
            setIsTesting(false);
        }
    }, [canvas.id]);

    return {
        canvas,
        elements,
        selectedElement,
        selectedElementId,
        linkedWidgetIds,
        isDirty,
        isSaving,
        isTesting,
        currentTimeMs,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        setCurrentTimeMs,
        setSelectedElementId,
        addElement,
        updateElement,
        removeElement,
        duplicateElement,
        nudgeElement,
        moveLayer,
        reorderLayers,
        undo,
        redo,
        updateMeta,
        toggleWidgetLink,
        save,
        test,
    };
};
