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
                    <AlertDialogTitle>คุณสามารถเปิดวิดเจ็ตได้เพียง 1 อันเท่านั้น</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <div>เนื่องจากคุณเป็นผู้ใช้งาน Free Tier คุณสามารถเปิดใช้งานวิดเจ็ตได้เพียง 1 อันเท่านั้น หากคุณเปิดใช้งานวิดเจ็ตนี้ {enabledWidgetName ? `วิดเจ็ตที่เคยเปิดใช้งานไว้จะถูกปิด` : 'วิดเจ็ตอื่นๆ ที่เคยเปิดใช้งานไว้จะถูกปิดทั้งหมด'}</div>
                        <div>คุณสามารถเปลี่ยนเป็น Pro Plan เพื่อเปิดใช้งานวิดเจ็ตได้อย่างไม่จำกัด</div>
                        <div className="font-bold">วิดเจ็ตที่กำลังเปิดใช้งาน <span className="text-yellow-600">{enabledWidgetName}</span></div>

                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => router.push('/pricing')}
                        className="text-md bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
                    >
                        อัปเกรดเป็น Pro
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
