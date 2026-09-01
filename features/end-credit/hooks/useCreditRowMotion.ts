"use client"

import { RefObject, useLayoutEffect, useState } from "react"

/**
 * OBS's Browser Source renders off-screen (CEF OSR). requestAnimationFrame and
 * IntersectionObserver callbacks are unreliable there — they can throttle to
 * effectively never firing even while the source is actively composited into the
 * scene, which is why the tier badges never appeared at all in OBS. CSS animations
 * don't share that problem (the rest of this app's overlays already lean on plain
 * `@keyframes` for exactly this reason), so the reveal moment is computed once,
 * synchronously, from layout, and handed to CSS as a plain `animation-delay` —
 * no continuous JS timer or observer is involved afterwards.
 */
const REVEAL_LINE_FRACTION = 1.0

/**
 * Seconds until this row crosses the reveal line (REVEAL_LINE_FRACTION down the screen),
 * so every row pops at the same on-screen height regardless of how deep it sits in the
 * roll — a row further down just has further to travel first, so its delay is naturally
 * bigger, but it still lands at the identical spot every other row did. Measured once via
 * getBoundingClientRect while the row still sits at its start-of-roll position
 * (translateY(100vh) on the parent, applied in the same initial render) — a single
 * synchronous layout read, not a recurring observer, so it stays immune to the OBS
 * rAF/IntersectionObserver throttling above.
 *
 * A row's absolute delay-since-mount growing with its position in a long roll is expected
 * and harmless: reveal is defined by an on-screen position, not a countdown shared across
 * rows, so every row still gets a full screen-height's worth of dwell time after it pops,
 * no matter how many people are ahead of it in the list.
 */
export const useRevealDelay = (ref: RefObject<HTMLElement | null>, scrollSpeed: number): number => {
    const [delaySeconds, setDelaySeconds] = useState(0)

    useLayoutEffect(() => {
        const element = ref.current
        if (!element || typeof window === "undefined" || scrollSpeed <= 0) return

        const startScreenY = element.getBoundingClientRect().top
        const revealLine = window.innerHeight * REVEAL_LINE_FRACTION
        setDelaySeconds(Math.max(0, (startScreenY - revealLine) / scrollSpeed))
    }, [ref, scrollSpeed])

    return delaySeconds
}
