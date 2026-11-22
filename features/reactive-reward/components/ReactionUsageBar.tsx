"use client";

import { Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MAX_REACTIONS, POINT_TIER_FIRST, POINT_TIER_STEP } from "../constants";

interface ReactionUsageBarProps {
    /** Reactions created. */
    total: number;
    /** Reactions switched on. Always at most `total`. */
    active: number;
    className?: string;
}

/** Where a new point starts being charged: 10, 15, 20 ... up to (not including) the maximum. */
const TIER_MARKS = Array.from(
    { length: Math.floor((MAX_REACTIONS - 1 - POINT_TIER_FIRST) / POINT_TIER_STEP) + 1 },
    (_, index) => POINT_TIER_FIRST + index * POINT_TIER_STEP,
);

const percentOf = (count: number) => `${(Math.min(count, MAX_REACTIONS) / MAX_REACTIONS) * 100}%`;

/**
 * One bar out of `MAX_REACTIONS`, two layers on top of each other: the lighter one is every Reaction created, the
 * solid one is those switched on. A divider marks each step where another point is charged.
 */
export function ReactionUsageBar({ total, active, className }: ReactionUsageBarProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {/* The track is thin; the Widget Point boxes are taller than it, so they sit in a layer above rather than inside it. */}
            <div className="relative flex h-5 items-center">
                <div
                    role="meter"
                    aria-label="จำนวน Reaction"
                    aria-valuemin={0}
                    aria-valuemax={MAX_REACTIONS}
                    aria-valuenow={Math.min(total, MAX_REACTIONS)}
                    aria-valuetext={`สร้างแล้ว ${total} เปิดอยู่ ${active} จาก ${MAX_REACTIONS}`}
                    className="bg-muted relative h-2.5 w-full overflow-hidden rounded-full"
                >
                    <div className="bg-muted-foreground/40 absolute inset-y-0 left-0 transition-all" style={{ width: percentOf(total) }} />
                    <div className="bg-primary absolute inset-y-0 left-0 transition-all" style={{ width: percentOf(active) }} />
                </div>
                {/* Past each divider one more Widget Point is charged. Dividers the active count has passed are highlighted. */}
                {TIER_MARKS.map((mark) => {
                    const reachedAt = mark + 1;
                    // The first point covers POINT_TIER_FIRST Reactions; each divider after it adds one more point.
                    const pointsAtReach = (mark - POINT_TIER_FIRST) / POINT_TIER_STEP + 2;
                    return (
                        <Tooltip key={mark}>
                            <TooltipTrigger asChild>
                                <span
                                    tabIndex={0}
                                    aria-label={`เปิดใช้ถึง ${reachedAt} ตัว ต้องจ่ายเพิ่ม 1 แต้ม`}
                                    className={cn(
                                        "bg-card absolute top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 cursor-default place-items-center rounded border",
                                        active > mark ? "text-supernova border-supernova/40" : "text-muted-foreground",
                                    )}
                                    style={{ left: percentOf(mark) }}
                                >
                                    <Zap className="size-3" aria-hidden="true" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-64 space-y-1 text-sm">
                                <p className="font-medium">
                                    เปิดใช้ถึง {reachedAt} ตัว ต้องจ่ายเพิ่ม 1 แต้ม (รวม {pointsAtReach} แต้ม)
                                </p>
                                <p>แต้มที่จ่ายนับเฉพาะตัวที่เปิดอยู่ (Active) สร้างไว้ได้เรื่อยๆ สูงสุด {MAX_REACTIONS} ตัว</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums">
                <span className="flex items-center gap-1.5">
                    <span className="bg-primary size-3 rounded-sm" aria-hidden="true" />
                    เปิดอยู่ {active}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="bg-muted-foreground/40 size-3 rounded-sm" aria-hidden="true" />
                    สร้างแล้ว {total} / {MAX_REACTIONS}
                </span>
            </div>
        </div>
    );
}
