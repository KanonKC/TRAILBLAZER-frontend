"use client"

import { useState } from "react";
import { AudioWaveform, Play, Square, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { UploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";
import { useAudioPreview } from "./useAudioPreview";

interface CompactAudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    audioVolume?: number;
    onAudioVolumeChange?: (volume: number) => void;
    disabled?: boolean;
    /** Shows a remove button when a file is set. Leave out when the sound is required. */
    onClear?: () => void;
    className?: string;
}

export function CompactAudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    audioVolume,
    onAudioVolumeChange,
    disabled = false,
    onClear,
    className,
}: CompactAudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { playingFileId, loadingFileId, toggle, stop } = useAudioPreview(audioVolume);

    const displayName = currentFileName?.split('/').pop() || "เลือกไฟล์เสียง";

    const isUploadedFile = selectedFile && !(selectedFile instanceof File) && !!(selectedFile as UploadedFile).id;
    const selectedFileId = isUploadedFile ? (selectedFile as UploadedFile).id : null;
    const handlePlayStop = () => selectedFileId ? toggle(selectedFileId) : undefined;

    return (
        <div className={cn("space-y-2 w-full", className)}>
            <div className={cn("flex items-center gap-2 w-full overflow-hidden")}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={disabled}
                    className="flex-1 justify-start gap-2 h-9 px-3 overflow-hidden"
                >
                    <AudioWaveform className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-[150px]">{displayName}</span>
                </Button>

                {isUploadedFile && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePlayStop}
                        disabled={disabled || loadingFileId !== null}
                        className="h-9 w-9 shrink-0"
                    >
                        {playingFileId === selectedFileId ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </Button>
                )}

                {currentFileName && onClear && (
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="นำเสียงออก"
                        onClick={() => {
                            stop();
                            onClear();
                        }}
                        disabled={disabled}
                        className="h-9 w-9 shrink-0"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                )}

                <AudioFileUploaderDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    currentFileName={currentFileName}
                    onFileSelect={onFileSelect}
                />
            </div>

            {audioVolume !== undefined && onAudioVolumeChange && (
                <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <Slider
                        value={[audioVolume]}
                        onValueChange={([v]) => onAudioVolumeChange(v)}
                        min={0}
                        max={100}
                        step={1}
                        disabled={disabled}
                        className="flex-1"
                    />
                    <span className="font-mono text-sm tabular-nums w-10 text-right shrink-0 text-muted-foreground">
                        {audioVolume}%
                    </span>
                </div>
            )}
        </div>
    );
}
