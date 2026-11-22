"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadedFile } from "@/services/uploadedFile.service";
import { describeError } from "../errors";
import { uploadReactionMedia, type UploadKind } from "../upload";

/** One upload at a time with progress, an error message and a way to cancel; leaving the screen cancels it too. */
export function useMediaUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const start = useCallback(async (file: File, kind: UploadKind): Promise<UploadedFile | null> => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setIsUploading(true);
        setProgress(0);
        setError(null);
        try {
            return await uploadReactionMedia(file, kind, setProgress, controller.signal);
        } catch (uploadError) {
            if (!controller.signal.aborted) setError(describeError(uploadError) ?? "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่");
            return null;
        } finally {
            if (controllerRef.current === controller) {
                controllerRef.current = null;
                setIsUploading(false);
            }
        }
    }, []);

    const cancel = useCallback(() => controllerRef.current?.abort(), []);
    const clearError = useCallback(() => setError(null), []);

    useEffect(() => () => controllerRef.current?.abort(), []);

    return { isUploading, progress, error, start, cancel, clearError };
}
