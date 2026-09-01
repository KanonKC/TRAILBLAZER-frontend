"use client"

import { RefObject, useEffect, useState } from "react"

/**
 * Rows live inside one big transformed container, so we let the browser tell us when a row
 * actually reaches the screen instead of re-deriving the scroll maths. A long roll can be
 * hundreds of rows, so every row shares a single observer per rootMargin.
 */
interface Registry {
    observer: IntersectionObserver
    callbacks: Map<Element, (inView: boolean) => void>
}

const registries = new Map<string, Registry>()

const registryFor = (rootMargin: string): Registry => {
    const existing = registries.get(rootMargin)
    if (existing) return existing

    const callbacks = new Map<Element, (inView: boolean) => void>()
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => callbacks.get(entry.target)?.(entry.isIntersecting)),
        { rootMargin },
    )
    const registry: Registry = { observer, callbacks }
    registries.set(rootMargin, registry)
    return registry
}

const observe = (element: Element, rootMargin: string, onChange: (inView: boolean) => void) => {
    const { observer, callbacks } = registryFor(rootMargin)
    callbacks.set(element, onChange)
    observer.observe(element)
    return () => {
        callbacks.delete(element)
        observer.unobserve(element)
    }
}

/** Reveals a row once it has travelled to roughly 70% down the screen — high enough that the
 *  count-up finishes while the row is still comfortably in reading position. */
const REVEAL_MARGIN = "-10% 0px -30% 0px"

export const useCreditRowMotion = (ref: RefObject<HTMLElement | null>) => {
    const [live, setLive] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // Without IntersectionObserver we simply show everything rather than hide the numbers.
        if (typeof IntersectionObserver === "undefined") {
            setLive(true)
            setVisible(true)
            return
        }

        let stopReveal = () => {}
        stopReveal = observe(element, REVEAL_MARGIN, inView => {
            if (!inView) return
            setLive(true)
            stopReveal()
        })
        const stopVisible = observe(element, "0px", setVisible)

        return () => {
            stopReveal()
            stopVisible()
        }
    }, [ref])

    return { live, visible }
}

const prefersReducedMotion = (): boolean =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Rolls a number up from zero once the row goes live, easing out so it lands rather than stops. */
export const useCountUp = (target: number, active: boolean, durationMs: number): number => {
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (!active) return
        if (durationMs <= 0 || prefersReducedMotion()) {
            setValue(target)
            return
        }

        let frame = 0
        const start = performance.now()
        const step = (now: number) => {
            const progress = Math.min(1, (now - start) / durationMs)
            setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
            if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)

        return () => cancelAnimationFrame(frame)
    }, [target, active, durationMs])

    return value
}
