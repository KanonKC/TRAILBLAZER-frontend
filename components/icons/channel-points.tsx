import * as React from "react"
import { cn } from "@/lib/utils"

/** Twitch Channel Points glyph. Inherits the surrounding text colour. */
export function ChannelPointsIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <path d="M12 5v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7Z" />
      <path
        fillRule="evenodd"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm11 9a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/** A Channel Points amount: always the glyph first, then the number. */
export function ChannelPointsCost({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 tabular-nums", className)}>
      <ChannelPointsIcon />
      {amount.toLocaleString()}
    </span>
  )
}
