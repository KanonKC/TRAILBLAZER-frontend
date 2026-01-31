"use client"

import { useRef } from "react";
import { Music } from "lucide-react";
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

    const hasCurrentFile = !!currentFileName;
    const isReplacing = !!selectedFile;
    const showCurrentFileView = hasCurrentFile && !isReplacing;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleCancelReplace = () => {
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
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-md", className?.includes("text-white") ? "bg-white/10" : "bg-secondary")}>
                            <Music className={cn("w-4 h-4", className?.includes("text-white") ? "text-white" : "text-primary")} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-sm font-medium", className?.includes("text-white") ? "text-white" : "")}>
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
                    accept="audio/*"
                    disabled={disabled}
                    onChange={handleFileChange}
                    className={cn(
                        inputClassName,
                        className?.includes("text-white")
                            ? "bg-transparent border-white/20 text-white file:text-white file:bg-white/10 file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded-md file:text-sm file:font-semibold hover:file:bg-white/20"
                            : ""
                    )}
                />

                {hasCurrentFile && isReplacing && (
                    <div className="flex justify-end">
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
                            ยกเลิกการเปลี่ยน
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
