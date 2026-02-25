"use client"

import { useEffect, useRef, useState } from "react";
import { AudioWaveform, Play, Square, Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { UploadedFile, getUploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";

interface AudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    audioVolume?: number;
    onAudioVolumeChange?: (volume: number) => void;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    hideLabel?: boolean;
}

export function AudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    audioVolume,
    onAudioVolumeChange,
    disabled = false,
    className,
    inputClassName,
    hideLabel = false
}: AudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
                        <AudioWaveform className={cn("w-4 h-4", className?.includes("text-white") ? "text-white" : "text-primary")} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={cn("text-sm font-medium truncate", className?.includes("text-white") ? "text-white" : "")}>
                            {currentFileName?.split('/').pop()}
                        </span>
                        <span className={cn("text-sm", className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")}>
                            {currentFileName ? "ไฟล์เสียงปัจจุบัน" : "ยังไม่ได้เลือกไฟล์เสียง"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isUploadedFile && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePlayStop}
                            disabled={disabled || isLoading}
                            className={cn(
                                "h-8 w-8 shrink-0",
                                className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                            )}
                        >
                            {isPlaying ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        disabled={disabled}
                        className={cn(
                            className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                        )}
                    >
                        {currentFileName ? "เปลี่ยนไฟล์ใหม่" : "เลือกไฟล์เสียง"}
                    </Button>
                </div>

                <AudioFileUploaderDialog
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    currentFileName={currentFileName}
                    onFileSelect={onFileSelect}
                />
            </div>

            {audioVolume !== undefined && onAudioVolumeChange && (
                <div className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg",
                    className?.includes("text-white") ? "border-white/20 bg-white/5" : "bg-card"
                )}>
                    <Volume2 className={cn("w-4 h-4 shrink-0", className?.includes("text-white") ? "text-white" : "text-muted-foreground")} />
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
