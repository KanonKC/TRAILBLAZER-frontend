"use client"

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

interface OverlayUrlInputProps {
    url: string;
    onRefresh?: () => void;
    showRefresh?: boolean;
    className?: string;
    inputClassName?: string;
    hideLabel?: boolean;
}

export function OverlayUrlInput({
    url,
    onRefresh,
    showRefresh = false,
    className,
    inputClassName,
    hideLabel = false
}: OverlayUrlInputProps) {
    const [showUrl, setShowUrl] = useState(false);
    const [showConfirmReveal, setShowConfirmReveal] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = async () => {
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {
                !hideLabel && (
                    <>
                        <Label>Overlay URL</Label>
                        <p className="text-sm text-muted-foreground">
                            คลิกที่ช่องเพื่อคัดลอก URL แล้วนำไปใส่ใน Browser Source ของโปรแกรมสตรีม (OBS/Streamlabs)
                        </p>
                    </>
                )
            }
            <div className="relative">
                <Input
                    type={showUrl ? "text" : "password"}
                    value={url}
                    readOnly
                    onClick={handleCopyUrl}
                    className={cn("pr-30 cursor-pointer font-mono text-sm", inputClassName)}
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent"
                        onClick={() => {
                            if (showUrl) {
                                setShowUrl(false);
                            } else {
                                setShowConfirmReveal(true);
                            }
                        }}
                    >
                        {showUrl ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>

                    {showRefresh && onRefresh && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-transparent"
                            onClick={onRefresh}
                        >
                            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent"
                        onClick={handleCopyUrl}
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
            </div>

            <AlertDialog open={showConfirmReveal} onOpenChange={setShowConfirmReveal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณต้องการแสดง Overlay URL หรือไม่?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Overlay URL เปรียบเสมือนรหัสผ่านสำหรับสตรีมของคุณ หากหลุดออกไป ผู้อื่นอาจสามารถส่งข้อความขี้นหน้าจอสตรีมของคุณได้โดยไม่ได้รับอนุญาต
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { setShowConfirmReveal(false); setShowUrl(true); }}>
                            แสดง URL
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
