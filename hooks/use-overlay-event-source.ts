"use client";

import { useEffect, useRef } from "react";

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 16000;

interface OverlayEventSourceOptions {
    onOpen?: () => void;
    onError?: () => void;
    resetOnOpen?: boolean;
}

/** Shared connection, retry and cleanup for overlay SSE streams. */
export function useOverlayEventSource(
    url: string | null,
    eventName: string,
    onEvent: (event: MessageEvent) => void,
    options: OverlayEventSourceOptions = {},
) {
    const eventHandlerRef = useRef(onEvent);
    const openHandlerRef = useRef(options.onOpen);
    const errorHandlerRef = useRef(options.onError);
    const resetOnOpen = options.resetOnOpen ?? false;

    useEffect(() => {
        eventHandlerRef.current = onEvent;
        openHandlerRef.current = options.onOpen;
        errorHandlerRef.current = options.onError;
    });

    useEffect(() => {
        if (!url) return;
        let disposed = false;
        let eventSource: EventSource | null = null;
        let retryTimeout: ReturnType<typeof setTimeout> | null = null;
        let retryDelay = INITIAL_RETRY_DELAY;

        const connect = () => {
            if (disposed) return;
            eventSource?.close();
            const source = new EventSource(url);
            eventSource = source;
            source.onopen = () => {
                if (resetOnOpen) retryDelay = INITIAL_RETRY_DELAY;
                openHandlerRef.current?.();
            };
            source.addEventListener("connected", () => {
                retryDelay = INITIAL_RETRY_DELAY;
            });
            source.addEventListener(eventName, (event) => {
                eventHandlerRef.current(event as MessageEvent);
            });
            source.onerror = () => {
                errorHandlerRef.current?.();
                source.close();
                if (disposed) return;
                retryTimeout = setTimeout(connect, retryDelay);
                retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
            };
        };

        connect();
        return () => {
            disposed = true;
            if (retryTimeout) clearTimeout(retryTimeout);
            eventSource?.close();
        };
    }, [url, eventName, resetOnOpen]);
}
