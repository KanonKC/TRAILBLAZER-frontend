import { useState, useCallback } from "react";
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

let localIdCounter = 0;
const nextLocalId = () => `local-${Date.now()}-${localIdCounter++}`;

export const useCanvasEditor = (initialCanvas: CanvasWithLinks) => {
    const [canvas, setCanvas] = useState<CanvasWithLinks>(initialCanvas);
    const [elements, setElements] = useState<CanvasElement[]>(initialCanvas.elements);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(elements[0]?.id ?? null);
    const [linkedWidgetIds, setLinkedWidgetIds] = useState<string[]>(
        initialCanvas.links.map((link) => link.widget.id)
    );
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const selectedElement = elements.find((el) => el.id === selectedElementId) ?? null;

    const addElement = useCallback((type: CanvasElement["type"]) => {
        const newElement: CanvasElement = {
            id: nextLocalId(),
            type,
            media_key: null,
            media: null,
            text_content: type === "text" ? "New text" : null,
            text_style: null,
            z_index: elements.length,
            ...DEFAULT_ELEMENT,
        } as CanvasElement;
        setElements((prev) => [...prev, newElement]);
        setSelectedElementId(newElement.id);
        setIsDirty(true);
    }, [elements.length]);

    const updateElement = useCallback((id: string, patch: Partial<CanvasElement>) => {
        setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch } : el)));
        setIsDirty(true);
    }, []);

    const removeElement = useCallback((id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
        setSelectedElementId((current) => (current === id ? null : current));
        setIsDirty(true);
    }, []);

    const moveLayer = useCallback((id: string, direction: "up" | "down") => {
        setElements((prev) => {
            const sorted = [...prev].sort((a, b) => a.z_index - b.z_index);
            const index = sorted.findIndex((el) => el.id === id);
            const swapWith = direction === "up" ? index + 1 : index - 1;
            if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return prev;

            const a = sorted[index];
            const b = sorted[swapWith];
            const aZ = a.z_index;
            a.z_index = b.z_index;
            b.z_index = aZ;
            return prev.map((el) => {
                if (el.id === a.id) return { ...el, z_index: a.z_index };
                if (el.id === b.id) return { ...el, z_index: b.z_index };
                return el;
            });
        });
        setIsDirty(true);
    }, []);

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
        setSelectedElementId,
        addElement,
        updateElement,
        removeElement,
        moveLayer,
        updateMeta,
        toggleWidgetLink,
        save,
        test,
    };
};
