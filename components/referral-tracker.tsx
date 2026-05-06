"use client"

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Tracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            // Set cookie for 7 days
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            document.cookie = `blaze_ref=${ref}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
            console.log("Referral code tracked:", ref);
        }
    }, [searchParams]);

    return null;
}

export function ReferralTracker() {
    return (
        <Suspense fallback={null}>
            <Tracker />
        </Suspense>
    );
}
