"use client"

import { useEffect, useRef } from "react"

const MAX_RETRY_DELAY = 16000 // 16 seconds max
const INITIAL_RETRY_DELAY = 1000 // 1 second

export type OverlayEventHandlers = Record<string, (data: any) => void>

/**
 * Shared EventSource connection with exponential-backoff reconnect, used by every
 * overlay browser-source page. `handlers` maps SSE event names to a callback that
 * receives the JSON-parsed payload.
 *
 * Handlers are read through a ref so callers can pass inline closures without
 * tearing down and re-establishing the connection on every render.
 */
export function useOverlayEvents(url: string | null | undefined, handlers: OverlayEventHandlers) {
    const handlersRef = useRef(handlers)

    useEffect(() => {
        handlersRef.current = handlers
    })

    useEffect(() => {
        if (!url) return

        let eventSource: EventSource | null = null
        let retryTimeout: NodeJS.Timeout | null = null
        let retryDelay = INITIAL_RETRY_DELAY
        let closed = false

        const connect = () => {
            if (closed) return

            eventSource = new EventSource(url)

            eventSource.onopen = () => {
                console.log("EventSource connected")
            }

            eventSource.addEventListener("connected", () => {
                console.log("Received connected event")
                retryDelay = INITIAL_RETRY_DELAY
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
                eventSource?.close()
                if (closed) return

                console.log(`Reconnecting in ${retryDelay / 1000}s...`)
                retryTimeout = setTimeout(connect, retryDelay)
                retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY)
            }
        }

        connect()

        return () => {
            closed = true
            if (retryTimeout) clearTimeout(retryTimeout)
            eventSource?.close()
        }
    }, [url])
}
