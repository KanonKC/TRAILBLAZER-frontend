"use client"

import { useEffect } from "react"

export default function RandomDBDKillerOverlayError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error("Random DBD Killer overlay crashed:", error)
        const timer = setTimeout(() => reset(), 3000)
        return () => clearTimeout(timer)
    }, [error, reset])

    return <div className="w-screen h-screen bg-transparent" />
}
