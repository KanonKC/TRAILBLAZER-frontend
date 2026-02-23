"use client"

import { useState } from "react";
import { AudioWaveform, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";

interface CompactAudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    disabled?: boolean;
    className?: string;
}

export function CompactAudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    disabled = false,
    className,
}: CompactAudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const displayName = currentFileName?.split('/').pop() || "เลือกไฟล์เสียง";

    return (
        <div className={cn("flex items-center gap-2 w-full overflow-hidden", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                disabled={disabled}
                className={cn(
                    "flex-1 justify-start gap-2 h-9 px-3 overflow-hidden",
                    className?.includes("text-white") && "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                )}
            >
                <AudioWaveform className="w-4 h-4 shrink-0" />
                <span className="truncate">{displayName}</span>
            </Button>

            <AudioFileUploaderDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                currentFileName={currentFileName}
                onFileSelect={onFileSelect}
            />
        </div>
    );
}
