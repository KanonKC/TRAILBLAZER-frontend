"use client";

import { useEffect, useRef, useState } from "react";
import { getUploadedFile } from "@/services/uploadedFile.service";

/** Loads a library file on demand and plays one preview at a time. */
export function useAudioPreview(volume = 100) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const requestIdRef = useRef(0);
    const [playingFileId, setPlayingFileId] = useState<string | null>(null);
    const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

    const stop = () => {
        requestIdRef.current += 1;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingFileId(null);
        setLoadingFileId(null);
    };

    const toggle = async (fileId: string) => {
        if (playingFileId === fileId) {
            stop();
            return;
        }
        stop();
        const requestId = requestIdRef.current;
        setLoadingFileId(fileId);
        try {
            const file = await getUploadedFile(fileId);
            if (!file.url || requestId !== requestIdRef.current) return;
            const audio = new Audio(file.url);
            audio.volume = volume / 100;
            audioRef.current = audio;
            audio.onended = () => setPlayingFileId(null);
            await audio.play();
            if (requestId === requestIdRef.current) setPlayingFileId(fileId);
        } catch {
            if (requestId === requestIdRef.current) setPlayingFileId(null);
        } finally {
            if (requestId === requestIdRef.current) setLoadingFileId(null);
        }
    };

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100;
    }, [volume]);

    useEffect(() => () => {
        requestIdRef.current += 1;
        audioRef.current?.pause();
    }, []);

    return { playingFileId, loadingFileId, toggle, stop };
}
