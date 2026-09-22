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
