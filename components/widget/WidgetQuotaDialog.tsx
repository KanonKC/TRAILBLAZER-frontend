"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExtendedWidget } from "@/services/widget.service";
import { useRouter } from "next/navigation";
import { StaticWidgets } from "@/constants/widgets";
import { ToggleLeft } from "lucide-react";

interface WidgetQuotaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    enabledWidgets: ExtendedWidget[];
    onDisableWidget: (widgetId: string) => void;
}

export const WidgetQuotaDialog = ({
    open,
    onOpenChange,
    enabledWidgets,
    onDisableWidget,
}: WidgetQuotaDialogProps) => {
    const router = useRouter();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>โควต้าวิดเจ็ตไม่เพียงพอ</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                คุณไม่มีโควต้าเพียงพอในการเปิดใช้งานวิดเจ็ตนี้
                                กรุณาปิดวิดเจ็ตที่เปิดอยู่ก่อน หรืออัปเกรดเป็น Pro เพื่อรับโควต้าเพิ่ม
                            </p>

                            {enabledWidgets.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-foreground">วิดเจ็ตที่เปิดอยู่:</p>
                                    <ul className="space-y-2">
                                        {enabledWidgets.map((widget) => {
                                            const staticWidget = StaticWidgets.find(w => w.slug === widget.widget_type_slug);
                                            const displayName = widget.widget_type?.displayName ?? staticWidget?.title ?? widget.widget_type_slug ?? "Unknown";
                                            const cost = widget.widget_type?.cost ?? 1;
                                            return (
                                                <li
                                                    key={widget.id}
                                                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{displayName}</span>
                                                        <span className="text-muted-foreground">ใช้ {cost} พอยท์</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                                                        onClick={() => onDisableWidget(widget.id)}
                                                    >
                                                        <ToggleLeft className="h-4 w-4" />
                                                        ปิด
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <Button
                        onClick={() => router.push('/pricing')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
                    >
                        อัปเกรดเป็น Pro
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
