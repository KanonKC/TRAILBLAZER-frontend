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
import { Badge } from "@/components/ui/badge";
import { tbToast } from "@/utils/tbToast";

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
            tbToast.error({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถดึงข้อมูลการแนะนำเพื่อนได้",
            });
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

                        <div className="grid gap-3">
                            {status?.milestones.map((milestone) => (
                                <div
                                    key={milestone.count}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${milestone.reached ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-muted"
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">แนะนำเพื่อนคนที่ {milestone.count}</span>
                                        <span className="text-sm text-muted-foreground">{translateReward(milestone.reward)}</span>
                                    </div>
                                    {milestone.reached ? (
                                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-sm">
                                            สำเร็จแล้ว
                                        </Badge>
                                    ) : (
                                        <span className="text-sm font-medium text-muted-foreground">รอดำเนินการ</span>
                                    )}
                                </div>
                            ))}
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


