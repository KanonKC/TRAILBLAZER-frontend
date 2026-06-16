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
import { useUser } from "../user-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import SubLabel from "../SubLabel";

export type BotProfileType = "default" | "self";

interface BotProfileSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    hideLabel?: boolean;
}

export function BotProfileSelector({ value, onValueChange, hideLabel }: BotProfileSelectorProps) {

    const { user } = useUser()

    const options = [
        {
            value: user?.twitchId,
            displayName: user?.displayName,
            label: "ใช้บัญชีของตัวเอง",
            avatar: user?.avatarUrl,
        },
        {
            value: "default",
            displayName: "MrJeremyBot",
            label: "ใช้บอทชั่วคราว",
            avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/e0bdb40f-d002-4ca0-ac86-937867b93851-profile_image-300x300.png",
        }
    ]

    return (
        <div className="space-y-2">
            {
                !hideLabel && (
                    <>
                        <Label>โปรไฟล์บอทสำหรับส่งข้อความ</Label>
                        <SubLabel>
                            เลือกบัญชีที่จะใช้ส่งข้อความทักทายไปยังห้องแชทของคุณ
                        </SubLabel>
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
                <SelectContent position="popper">
                    {
                        options.map((option) => (
                            option.value && <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-row gap-2 items-center">
                                    <Avatar size="sm">
                                        <AvatarImage src={option.avatar} />
                                        <AvatarFallback>{option.displayName}</AvatarFallback>
                                    </Avatar>
                                    <span>{option.displayName} <span className="text-sm text-muted-foreground pl-1">({option.label})</span></span>
                                </div>
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            {value === "default" && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                        บอทจะไม่สามารถส่งข้อความได้ หากช่องของคุณเปิดใช้งานโหมด Follower-only Chat
                    </p>
                </div>
            )}
        </div>
    );
}
