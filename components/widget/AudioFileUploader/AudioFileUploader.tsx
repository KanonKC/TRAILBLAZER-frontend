"use client"

import { useState } from "react";
import { AudioWaveform, Play, Square, Trash2, Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { UploadedFile } from "@/services/uploadedFile.service";
import AudioFileUploaderDialog from "./AudioFileUploaderDialog";
import { useAudioPreview } from "./useAudioPreview";

interface AudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
    audioVolume?: number;
    onAudioVolumeChange?: (volume: number) => void;
    disabled?: boolean;
    /** Shows a remove button when a file is set. Leave out when the sound is required. */
    onClear?: () => void;
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
    onClear,
    className,
    inputClassName,
    hideLabel = false
}: AudioFileUploaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { playingFileId, loadingFileId, toggle, stop } = useAudioPreview(audioVolume);

    const isUploadedFile = selectedFile && !(selectedFile instanceof File) && !!(selectedFile as UploadedFile).id;

    const selectedFileId = isUploadedFile ? (selectedFile as UploadedFile).id : null;
    const handlePlayStop = () => selectedFileId ? toggle(selectedFileId) : undefined;

    return (
        <div className={cn("space-y-4", className)}>
            {!hideLabel && (
                <div>
                    <Label htmlFor="qs_audio_file" >
                        ไฟล์เสียง
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                        อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ชมใหม่เข้ามาพิมพ์ข้อความแรก (รองรับไฟล์ MP3, WAV, OGG)
                    </p>
                </div>
            )}

            <div className="border rounded-lg overflow-hidden bg-card">
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-md bg-secondary">
                            <AudioWaveform className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate mr-4">
                                {currentFileName?.split('/').pop() || "ยังไม่ได้เลือกไฟล์เสียง"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {currentFileName ? "ไฟล์เสียงปัจจุบัน" : "กดปุ่มเพื่อเลือกไฟล์"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isUploadedFile && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePlayStop}
                                disabled={disabled || loadingFileId !== null}
                                className="h-8 w-8 shrink-0"
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
                                className="h-8 w-8 shrink-0"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={disabled}
                            
                        >
                            {currentFileName ? "เปลี่ยนไฟล์ใหม่" : "เลือกไฟล์เสียง"}
                        </Button>
                    </div>
                </div>

                {audioVolume !== undefined && onAudioVolumeChange && (
                    <div className="flex items-center gap-3 px-3 pb-3 pt-3 border-t">
                        <Volume2 className="w-4 h-4 shrink-0 text-muted-foreground" />
                        <Slider
                            value={[audioVolume]}
                            onValueChange={([v]) => onAudioVolumeChange(v)}
                            min={0}
                            max={100}
                            step={1}
                            disabled={disabled}
                            className="flex-1 cursor-pointer"
                        />
                        <span className="font-mono text-sm tabular-nums w-10 text-right shrink-0 text-muted-foreground">
                            {audioVolume}%
                        </span>
                    </div>
                )}

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
