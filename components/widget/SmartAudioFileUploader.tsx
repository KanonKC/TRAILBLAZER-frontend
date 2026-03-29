"use client"

import { useState } from "react";
import { AudioFileUploader } from "./AudioFileUploader/AudioFileUploader";
import { apiClient } from "@/lib/api-client";
import { tbToast } from "@/utils/tbToast";
import { UploadedFile } from "@/services/uploadedFile.service";

interface SmartAudioFileUploaderProps {
    slug: string;
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    audioVolume?: number;
    onAudioVolumeChange?: (volume: number) => void;
    onSuccess?: (data: any) => void;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    hideLabel?: boolean;
}

/**
 * Smart version of AudioFileUploader that handles immediate audio key updates.
 * Centralizes the upload/update logic.
 */
export function SmartAudioFileUploader({
    slug,
    currentFileName,
    selectedFile,
    audioVolume,
    onAudioVolumeChange,
    onSuccess,
    disabled = false,
    className,
    inputClassName,
    hideLabel = false
}: SmartAudioFileUploaderProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFileSelect = async (file: File | UploadedFile | null, fileKey: string | null) => {
        if (!fileKey) return;

        setIsUpdating(true);
        try {
            const response = await apiClient.patch(`/api/v1/${slug}`, {
                audio_key: fileKey
            });
            
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error("Failed to update audio file:", error);
            tbToast.error({ title: "ไม่สามารถอัปโหลดไฟล์เสียงได้" });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AudioFileUploader
            currentFileName={currentFileName}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            audioVolume={audioVolume}
            onAudioVolumeChange={onAudioVolumeChange}
            disabled={disabled || isUpdating}
            className={className}
            inputClassName={inputClassName}
            hideLabel={hideLabel}
        />
    );
}
