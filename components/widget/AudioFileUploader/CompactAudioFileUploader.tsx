"use client"

import { useEffect, useRef, useState } from "react";
import { AudioWaveform, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { UploadedFile, getUploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";

interface CompactAudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    audioVolume?: number;
    onAudioVolumeChange?: (volume: number) => void;
    disabled?: boolean;
    className?: string;
}

export function CompactAudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    audioVolume,
    onAudioVolumeChange,
    disabled = false,
    className,
}: CompactAudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const displayName = currentFileName?.split('/').pop() || "เลือกไฟล์เสียง";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = (audioVolume ?? 100) / 100;
        }
    }, [audioVolume]);

    const isUploadedFile = selectedFile && !(selectedFile instanceof File) && !!(selectedFile as UploadedFile).id;

    const handlePlayStop = async () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            return;
        }

        if (!isUploadedFile) return;

        setIsLoading(true);
        try {
            const file = await getUploadedFile((selectedFile as UploadedFile).id);
            if (!file.url) return;

            const audio = new Audio(file.url);
            audio.volume = (audioVolume ?? 100) / 100;
            audioRef.current = audio;

            audio.onended = () => setIsPlaying(false);

            await audio.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("space-y-2 w-full", className)}>
            <div className={cn("flex items-center gap-2 w-full overflow-hidden")}>
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

                {isUploadedFile && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePlayStop}
                        disabled={disabled || isLoading}
                        className={cn(
                            "h-9 w-9 shrink-0",
                            className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                        )}
                    >
                        {isPlaying ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
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
                    <Volume2 className={cn("w-3.5 h-3.5 shrink-0", className?.includes("text-white") ? "text-white" : "text-muted-foreground")} />
                    <Slider
                        value={[audioVolume]}
                        onValueChange={([v]) => onAudioVolumeChange(v)}
                        min={0}
                        max={100}
                        step={1}
                        disabled={disabled}
                        className="flex-1"
                    />
                    <span className={cn("text-sm tabular-nums w-10 text-right shrink-0", className?.includes("text-white") ? "text-white" : "text-muted-foreground")}>
                        {audioVolume}%
                    </span>
                </div>
            )}
        </div>
    );
}
