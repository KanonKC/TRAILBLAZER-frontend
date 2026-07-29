"use client"

import { usePathname } from "next/navigation";
import { Footer } from "@/components/landing/footer";

// A tool/editor page manages its own full-viewport layout (and often hides
// scroll entirely), so a marketing footer below it would just force an
// extra scroll the page was specifically built to avoid.
const NO_FOOTER_PREFIXES = ["/overlays", "/dashboard/canvas/"];

export function ConditionalFooter() {
    const pathname = usePathname();
    if (NO_FOOTER_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
        return null;
    }
    return <Footer />;
}
