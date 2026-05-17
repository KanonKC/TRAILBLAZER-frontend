"use client";

import { useEffect, useState } from "react";
import { getWidgetQuota, WidgetQuota } from "@/services/widget.service";
import { Zap } from "lucide-react";
import { Progress } from "../ui/progress";
import { tbToast } from "@/utils/tbToast";

interface QuotaMeterProps {
    /** Pass a refresh key (e.g. a counter) to re-fetch quota after enable/disable actions */
    refreshKey?: number;
}

export const QuotaMeter = ({ refreshKey }: QuotaMeterProps) => {
    const [quota, setQuota] = useState<WidgetQuota | null>(null);

    useEffect(() => {
        getWidgetQuota()
            .then(setQuota)
            .catch((e) => {
                tbToast.error({
                    title: "เกิดข้อผิดพลาด",
                    description: "ไม่สามารถดึงข้อมูลโควต้าได้",
                });
                console.error("Failed to fetch quota", e);
            });
    }, [refreshKey]);

    if (!quota) return null;

    const percentage = quota.total_quota > 0
        ? Math.round((quota.used_quota / quota.total_quota) * 100)
        : 0;

    const isNearLimit = quota.remaining_quota <= 1 && quota.remaining_quota > 0;
    const isAtLimit = quota.remaining_quota === 0;

    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30 w-full">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Zap className="h-4 w-4 text-amber-500" />
                    โควต้าวิดเจ็ต
                </div>
                <span
                    className={
                        isAtLimit
                            ? "text-destructive font-semibold"
                            : isNearLimit
                                ? "text-amber-500 font-semibold"
                                : "text-muted-foreground"
                    }
                >
                    {quota.used_quota} / {quota.total_quota} พอยท์
                </span>
            </div>
            <Progress
                value={percentage}
                className={`h-2 ${isAtLimit ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-amber-500" : ""}`}
            />
            {isAtLimit && (
                <p className="text-sm text-destructive">
                    โควต้าของคุณหมดแล้ว กรุณาปิดวิดเจ็ตหรืออัปเกรดเป็น Pro
                </p>
            )}
        </div>
    );
};
