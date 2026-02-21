"use client"

import { useState } from "react";
import { Music } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";

interface AudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    hideLabel?: boolean;
}

export function AudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    disabled = false,
    className,
    inputClassName,
    hideLabel = false
}: AudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className={cn("space-y-4", className)}>
            {!hideLabel && (
                <div>
                    <Label htmlFor="qs_audio_file" className={cn(className?.includes("text-white") ? "text-white" : "")}>
                        ไฟล์เสียง
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                        อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ชมใหม่เข้ามาพิมพ์ข้อความแรก (รองรับไฟล์ MP3, WAV)
                    </p>
                </div>
            )}

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
                        <span className={cn("text-sm", className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")}>
                            ไฟล์เสียงปัจจุบัน
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={disabled}
                    className={cn(
                        className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                    )}
                >
                    เปลี่ยนไฟล์ใหม่
                </Button>

                <AudioFileUploaderDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    currentFileName={currentFileName}
                    onFileSelect={onFileSelect}
                />
            </div>
        </div>
    );
}
