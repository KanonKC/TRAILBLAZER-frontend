"use client"

import { RefObject, useEffect, useState } from "react";

export interface ElementSize {
    width: number;
    height: number;
}

/**
 * Tracks an element's pixel size in state via ResizeObserver.
 *
 * The Canvas editor stores geometry as percentages but the interaction libraries
 * (and pointer events) work in pixels, so the conversion needs a real measurement.
 * Reading `ref.current` during render would be stale on first paint and is not
 * allowed by the React compiler — this keeps the size as proper reactive state.
 */
export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): ElementSize {
    const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (rect) setSize({ width: rect.width, height: rect.height });
        });
        observer.observe(node);

        const initial = node.getBoundingClientRect();
        setSize({ width: initial.width, height: initial.height });

        return () => observer.disconnect();
    }, [ref]);

    return size;
}
