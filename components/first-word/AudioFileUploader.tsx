"use client"

import { useRef, useState } from "react";
import { Music } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | null;
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
}

export function AudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    disabled = false,
    className,
    inputClassName
}: AudioFileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 2.5MB
    const ACCEPTED_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];

    const fileSchema = z
        .custom<File>((file) => file instanceof File, "ข้อมูลไม่ถูกต้อง")
        .refine((file) => file.size <= MAX_FILE_SIZE, "ขนาดไฟล์ต้องไม่เกิน 2.5 MB")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'),
            "รองรับเฉพาะไฟล์ .mp3, .wav, .ogg"
        );

    const hasCurrentFile = !!currentFileName;
    const isReplacing = !!selectedFile;
    const showCurrentFileView = hasCurrentFile && !isReplacing;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const result = fileSchema.safeParse(file);

            if (!result.success) {
                setError(result.error.issues[0].message);
                // Reset input to allow selecting the same invalid file again to trigger error if needed, or just leave it
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            setError(null);
            onFileSelect(file);
        }
    };

    const handleCancelReplace = () => {
        setError(null);
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor="qs_audio_file" className={cn(className?.includes("text-white") ? "text-white" : "")}>
                ไฟล์เสียง
            </Label>

            {showCurrentFileView && (
                <div className={cn(
                    "flex items-center justify-between p-3 border rounded-lg",
                    className?.includes("text-white") ? "border-white/20 bg-white/5" : "bg-card"
                )}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn("p-2 rounded-md", className?.includes("text-white") ? "bg-white/10" : "bg-secondary")}>
                            <Music className={cn("w-4 h-4", className?.includes("text-white") ? "text-white" : "text-primary")} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className={cn("text-sm font-medium truncate", className?.includes("text-white") ? "text-white" : "")}>
                                {currentFileName?.split('/').pop()}
                            </span>
                            <span className={cn("text-xs", className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")}>
                                ไฟล์เสียงปัจจุบัน
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className={cn(
                            className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                        )}
                    >
                        เปลี่ยนไฟล์ใหม่
                    </Button>
                </div>
            )}

            <div className={cn("space-y-2", showCurrentFileView ? "hidden" : "")}>
                <Input
                    ref={fileInputRef}
                    id="qs_audio_file"
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    disabled={disabled}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className={cn(
                    "flex items-center justify-between p-3 border rounded-lg",
                    className?.includes("text-white") ? "border-white/20 bg-white/5" : "bg-card",
                    error ? "border-red-500/50 bg-red-500/5" : ""
                )}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn("p-2 rounded-md", className?.includes("text-white") ? "bg-white/10" : "bg-secondary")}>
                            <Music className={cn("w-4 h-4", className?.includes("text-white") ? "text-white" : "text-primary")} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className={cn("text-sm font-medium truncate", className?.includes("text-white") ? "text-white" : "")}>
                                {selectedFile ? selectedFile.name : "ไม่ได้เลือกไฟล์"}
                            </span>
                            <span className={cn(
                                "text-xs",
                                error
                                    ? "text-red-500"
                                    : (className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")
                            )}>
                                {error || (selectedFile ? "ไฟล์ที่เลือก" : "รองรับไฟล์ .mp3, .wav, .ogg")}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasCurrentFile && isReplacing && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelReplace}
                                disabled={disabled}
                                className={cn(
                                    className?.includes("text-white")
                                        ? "text-white/70 hover:text-white hover:bg-white/10"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                ยกเลิก
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                            className={cn(
                                className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                            )}
                        >
                            {selectedFile ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
