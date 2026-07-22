"use client"

import { useEffect, useRef, useCallback } from "react"

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second

export type OverlayEventHandlers = Record<string, (data: any) => void>

/**
 * Shared EventSource connection with exponential-backoff reconnect, used by every
 * overlay browser-source page. `handlers` maps SSE event names to a callback that
 * receives the JSON-parsed payload.
 */
export function useOverlayEvents(url: string | null | undefined, handlers: OverlayEventHandlers) {
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY)
    const eventSourceRef = useRef<EventSource | null>(null)
    const handlersRef = useRef(handlers)
    handlersRef.current = handlers

    const connect = useCallback(() => {
        if (!url) return

        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const eventSource = new EventSource(url)
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
            console.log("EventSource connected")
        }

        eventSource.addEventListener("connected", () => {
            console.log("Received connected event")
            retryDelayRef.current = INITIAL_RETRY_DELAY
        })

        for (const eventName of Object.keys(handlersRef.current)) {
            eventSource.addEventListener(eventName, (event: MessageEvent) => {
                try {
                    const data = event.data ? JSON.parse(event.data) : undefined
                    console.log(`Received ${eventName} event:`, data)
                    handlersRef.current[eventName]?.(data)
                } catch (error) {
                    console.error(`Failed to parse ${eventName} event data:`, error)
                }
            })
        }

        eventSource.onerror = () => {
            console.log("EventSource error, attempting reconnect...")
            eventSource.close()

            const delay = retryDelayRef.current
            console.log(`Reconnecting in ${delay / 1000}s...`)

            retryTimeoutRef.current = setTimeout(() => {
                connect()
            }, delay)

            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    useEffect(() => {
        connect()

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
        }
    }, [connect])
}
