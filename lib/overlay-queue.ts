/**
 * Overlay events are paced by a queue on the backend: one viewer's moment
 * finishes before the next one starts. The backend only knows a conservative
 * estimate of how long each item takes, so an overlay reports back the instant
 * its item genuinely ended — the audio stopped, the spinner landed, the credits
 * scrolled off — and the next viewer goes straight away.
 *
 * Fire and forget: a lost ack only means the queue waits out the estimate.
 */
export function ackOverlayJob(
    slug: string,
    userId: string,
    jobId: string | undefined,
    key?: string
) {
    if (!jobId || !userId) return

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const url = new URL(`${baseUrl}/api/v1/overlay-queue/${userId}/${slug}/ack`)
    if (key) url.searchParams.append("key", key)

    fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
        keepalive: true,
    }).catch(() => {
        // The queue's own timeout covers this.
    })
}

const ACK_ATTEMPTS = 3
const ACK_RETRY_DELAY_MS = 400

/**
 * Like ackOverlayJob, for overlays whose items are long enough that a short network outage is likely to land on
 * the ack. Retries a network error or a 5xx up to three times in all; an answer below 500 (an invalid key, an
 * already-ended job) is final and not retried. If every attempt fails the queue still moves on by itself once the
 * item's ceiling passes, so this never throws.
 */
export async function ackOverlayJobWithRetry(
    slug: string,
    userId: string,
    jobId: string | undefined,
    key?: string
): Promise<boolean> {
    if (!jobId || !userId) return false

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const url = new URL(`${baseUrl}/api/v1/overlay-queue/${userId}/${slug}/ack`)
    if (key) url.searchParams.append("key", key)

    for (let attempt = 1; attempt <= ACK_ATTEMPTS; attempt++) {
        try {
            const response = await fetch(url.toString(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId }),
                keepalive: true,
            })
            if (response.ok) return true
            if (response.status < 500) return false
        } catch {
            // Network error: try again below
        }
        if (attempt < ACK_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, ACK_RETRY_DELAY_MS * attempt))
    }
    return false
}
