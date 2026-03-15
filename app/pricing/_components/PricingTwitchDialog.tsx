"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink } from "lucide-react";
import { Twitch } from "@/components/icons/twitch"
import { Button } from "@/components/ui/button";

interface PricingTwitchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PricingTwitchDialog = ({
    open,
    onOpenChange,
}: PricingTwitchDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>

                    <AlertDialogTitle className="flex items-center gap-2">วิธีการสมัคร Pro Plan ด้วย <span className="text-[#6441a5] font-bold">Twitch Subscription</span></AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4 pt-2">
                        <p className="text-base">
                            การอัปเกรดเป็น <span className="text-amber-600 font-bold">Pro Plan</span> จะใช้วิธีการผ่านการกด Subscribe บน Twitch ของเจ้าของแอปพลิเคชัน
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">ไว้ทีหลัง</AlertDialogCancel>
                    <Button
                        variant="twitch"
                        className="w-full sm:w-auto "
                    >
                        <a
                            href="https://www.twitch.tv/subs/kanonkc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                        >
                            <Twitch className="w-4 h-4 fill-current" />
                            ไปหน้าสมัครบน Twitch
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
