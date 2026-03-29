"use client"

import { useState } from "react";
import { OverlayUrlInput } from "./OverlayUrlInput";
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
import { apiClient } from "@/lib/api-client";
import { tbToast } from "@/utils/tbToast";

interface SmartOverlayUrlInputProps {
    url: string;
    slug: string;
    onSuccess?: (data: any) => void;
    className?: string;
    disabled?: boolean;
    hideLabel?: boolean;
}

/**
 * Smart version of OverlayUrlInput that handles key refreshing.
 * Centralizes the refresh logic and confirmation dialog.
 */
export function SmartOverlayUrlInput({
    url,
    slug,
    onSuccess,
    className,
    disabled,
    hideLabel
}: SmartOverlayUrlInputProps) {
    const [showConfirmRefresh, setShowConfirmRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await apiClient.post(`/api/v1/${slug}/refresh-key`);
            tbToast.success({ title: "รีเซ็ตคีย์สำเร็จ" });
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error("Failed to refresh overlay key:", error);
            tbToast.error({ title: "ไม่สามารถรีเซ็ตคีย์ได้" });
        } finally {
            setIsRefreshing(false);
            setShowConfirmRefresh(false);
        }
    };

    return (
        <>
            <OverlayUrlInput
                url={url}
                showRefresh={true}
                onRefresh={() => setShowConfirmRefresh(true)}
                className={className}
                disabled={disabled || isRefreshing}
                hideLabel={hideLabel}
            />

            <AlertDialog open={showConfirmRefresh} onOpenChange={setShowConfirmRefresh}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการรีเซ็ต Key</AlertDialogTitle>
                        <AlertDialogDescription>
                            การรีเซ็ต Key จะทำให้ URL เดิมที่ใช้อยู่ใน OBS ใช้งานไม่ได้ทันที คุณจะต้องนำ URL ใหม่ไปใส่ใน OBS อีกครั้ง
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRefreshing}>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleRefresh();
                            }}
                            disabled={isRefreshing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isRefreshing ? "กำลังรีเซ็ต..." : "ยืนยันรีเซ็ต"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
