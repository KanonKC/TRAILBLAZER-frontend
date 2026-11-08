"use client";

import { cn } from "@/lib/utils";
import { POSITIONS } from "../constants";
import type { ReactionPosition } from "../types";

/** A 3x3 picker for where on the screen the reaction appears. */
export function PositionGrid({
    value,
    onChange,
    disabled = false,
}: {
    value: ReactionPosition;
    onChange: (position: ReactionPosition) => void;
    disabled?: boolean;
}) {
    return (
        <div role="radiogroup" aria-label="ตำแหน่งบนหน้าจอ" className="grid w-44 grid-cols-3 gap-1.5">
            {POSITIONS.map(({ value: position, label }) => {
                const selected = position === value;
                return (
                    <button
                        key={position}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={label}
                        title={label}
                        disabled={disabled}
                        onClick={() => onChange(position)}
                        className={cn(
                            "bg-secondary grid aspect-[16/10] cursor-pointer place-items-center rounded-md border disabled:cursor-not-allowed disabled:opacity-50",
                            selected && "border-primary bg-primary/10",
                        )}
                    >
                        <span className={cn("size-2 rounded-full", selected ? "bg-primary" : "bg-muted-foreground/40")} />
                    </button>
                );
            })}
        </div>
    );
}
