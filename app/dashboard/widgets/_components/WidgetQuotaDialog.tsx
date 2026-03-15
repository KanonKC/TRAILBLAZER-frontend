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
import { useRouter } from "next/navigation";

interface WidgetQuotaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    enabledWidgetName: string | null;
    onConfirmToggle: () => void;
}

export const WidgetQuotaDialog = ({
    open,
    onOpenChange,
    enabledWidgetName,
    onConfirmToggle
}: WidgetQuotaDialogProps) => {
    const router = useRouter();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>ไม่สามารถเปิดใช้งานวิดเจ็ตได้</AlertDialogTitle>
                    <AlertDialogDescription>
                        เนื่องจากคุณเป็นผู้ใช้งาน Free Tier คุณสามารถเปิดใช้งานวิดเจ็ตได้เพียง 1 อันเท่านั้น หากคุณเปิดใช้งานวิดเจ็ตนี้ {enabledWidgetName ? `วิดเจ็ต "${enabledWidgetName}" ที่เคยเปิดใช้งานไว้จะถูกปิด` : 'วิดเจ็ตอื่นๆ ที่เคยเปิดใช้งานไว้จะถูกปิดทั้งหมด'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => router.push('/pricing')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        อัปเกรดเป็น Pro Plan
                    </AlertDialogAction>
                    <AlertDialogAction
                        onClick={onConfirmToggle}
                    >
                        เปิดใช้งานวิดเจ็ดนี้แทน
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
