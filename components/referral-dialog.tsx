"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Gift, Copy, Check, Users } from "lucide-react";
import { getReferralStatus, ReferralStatus } from "@/services/user.service";
import { tbToast } from "@/utils/tbToast";
import { Progress } from "@/components/ui/progress";

interface ReferralDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReferralDialog({ open, onOpenChange }: ReferralDialogProps) {
    const [status, setStatus] = useState<ReferralStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open) {
            fetchStatus();
        }
    }, [open]);

    const fetchStatus = async () => {
        setIsLoading(true);
        try {
            const data = await getReferralStatus();
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch referral status", error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyLink = () => {
        if (!status?.code) return;
        const url = `${window.location.origin}/login?ref=${status.code}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        tbToast.success({
            title: "คัดลอกลิงก์แล้ว!",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const translateReward = (reward: string) => {
        if (reward.includes("Widget Quota")) return "โควตา Widget +1";
        if (reward.includes("Storage")) return "พื้นที่เก็บข้อมูล +15 MB";
        return reward;
    };

    const progressValue = status ? Math.min((status.count / 3) * 100, 100) : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <Gift className="w-5 h-5 text-primary" />
                        ชวนเพื่อน
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        ชวนเพื่อนมาใช้ TRAILBLAZER และรับรางวัลสุดพิเศษ!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-white">ลิงก์แนะนำของคุณ</p>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={status ? `${window.location.origin}/login?ref=${status.code}` : "กำลังโหลด..."}
                                className="bg-muted text-sm"
                            />
                            <Button size="icon" variant="outline" onClick={copyLink} disabled={!status}>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium flex items-center gap-2 text-white">
                                <Users className="w-4 h-4" />
                                ความคืบหน้าของคุณ
                            </p>
                            <span className="text-sm font-bold text-primary">แนะนำเพื่อนสำเร็จ {status?.count || 0} คน</span>
                        </div>

                        <div className="space-y-10 pt-4 px-2 pb-6">
                            <div className="relative">
                                <Progress value={progressValue} className="h-2 bg-muted/30" />
                                <div className="absolute top-1/2 left-0 w-full flex justify-between -translate-y-1/2">
                                    {[0, 1, 2, 3].map((num) => {
                                        const isReached = (status?.count ?? 0) >= num;
                                        const milestone = num > 0 ? status?.milestones[num - 1] : null;

                                        return (
                                            <div key={num} className="relative flex flex-col items-center">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${isReached
                                                        ? "bg-primary border-primary shadow-[0_0_10px_rgba(255,140,0,0.5)]"
                                                        : "bg-background border-muted"
                                                        }`}
                                                />
                                                <div className="absolute top-6 flex flex-col items-center text-center min-w-[80px]">
                                                    <span className={`text-[11px] font-bold transition-colors ${isReached ? "text-primary" : "text-muted-foreground"}`}>
                                                        {num === 0 ? "เริ่ม" : `${num} คน`}
                                                    </span>
                                                    {milestone && (
                                                        <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight whitespace-nowrap">
                                                            {translateReward(milestone.reward)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm text-muted-foreground text-center">
                            เพื่อนของคุณจะได้รับ <span className="text-white font-bold">โควตา Widget +1</span> ทันทีหลังจากสมัครใช้งาน!
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
