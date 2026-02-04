"use client"

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

export type BotProfileType = "default" | "self";

interface BotProfileSelectorProps {
    value: BotProfileType;
    onValueChange: (value: BotProfileType) => void;
    hideLabel?: boolean;
}

export function BotProfileSelector({ value, onValueChange, hideLabel }: BotProfileSelectorProps) {
    return (
        <div className="space-y-2 pt-4">
            {
                !hideLabel && (
                    <>
                        <Label>โปรไฟล์บอทสำหรับส่งข้อความ</Label>
                        <p className="text-sm text-muted-foreground">
                            เลือกบัญชีที่จะใช้ส่งข้อความทักทายไปยังห้องแชทของคุณ
                        </p>
                    </>
                )
            }
            <Select
                value={value}
                onValueChange={(val) => onValueChange(val as BotProfileType)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกโปรไฟล์บอท" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">
                        <div className="flex flex-col gap-0.5">
                            <span>ใช้บอทเริ่มต้น (JeremyBot)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="self">
                        <div className="flex flex-col gap-0.5">
                            <span>ใช้บัญชีของตัวเอง</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            {value === "default" && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs">
                        บอทจะไม่สามารถส่งข้อความได้ หากช่องของคุณเปิดใช้งานโหมด Follower-only Chat
                    </p>
                </div>
            )}
        </div>
    );
}
