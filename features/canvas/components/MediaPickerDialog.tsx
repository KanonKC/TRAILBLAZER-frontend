"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getUploadedFiles, UploadedFile, uploadFile } from "@/services/uploadedFile.service";
import { tbToast } from "@/utils/tbToast";
import { ChevronLeft, ChevronRight, FileAudio, Loader2, Search, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasMediaSlot } from "../types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // matches the file manager

const SLOT_META: Record<CanvasMediaSlot, { title: string; accept: string; hint: string }> = {
    image: { title: "เลือกรูปภาพ", accept: "image/png,image/jpeg,image/gif,image/webp", hint: ".png, .jpg, .gif, .webp" },
    audio: { title: "เลือกไฟล์เสียง", accept: "audio/mpeg,audio/wav,audio/ogg,.mp3,.wav,.ogg", hint: ".mp3, .wav, .ogg" },
    video: { title: "เลือกวิดีโอ", accept: "video/mp4,video/webm", hint: ".mp4, .webm" },
};

interface MediaPickerDialogProps {
    slot: CanvasMediaSlot;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (file: UploadedFile) => void;
}

export function MediaPickerDialog({ slot, isOpen, onOpenChange, onSelect }: MediaPickerDialogProps) {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const meta = SLOT_META[slot];

    const fetchFiles = useCallback(async (nextPage: number, query: string) => {
        setIsLoading(true);
        try {
            const res = await getUploadedFiles({ page: nextPage, limit: 12, search: query, type: slot });
            setFiles(res.data);
            setPage(res.pagination.page);
            setTotalPages(Math.max(1, Math.ceil(res.pagination.total / res.pagination.limit)));
        } catch (error) {
            console.error("Failed to load files", error);
            tbToast.error({ title: "โหลดไฟล์ไม่สำเร็จ" });
        } finally {
            setIsLoading(false);
        }
    }, [slot]);

    useEffect(() => {
        if (isOpen) fetchFiles(1, search);
        // search is applied on submit, not on every keystroke
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, fetchFiles]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            tbToast.error({ title: "ขนาดไฟล์ต้องไม่เกิน 10 MB" });
            return;
        }
        setIsUploading(true);
        try {
            await uploadFile(file);
            tbToast.success({ title: "อัปโหลดไฟล์สำเร็จ" });
            await fetchFiles(1, search);
        } catch (err) {
            tbToast.error({ title: "อัปโหลดไฟล์ไม่สำเร็จ", error: (err as { response?: { data?: unknown } }).response?.data });
        } finally {
            setIsUploading(false);
            if (uploadInputRef.current) uploadInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{meta.title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row gap-2">
                    <form
                        className="relative flex-1"
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchFiles(1, search);
                        }}
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ค้นหาชื่อไฟล์ (3 ตัวอักษรขึ้นไป)"
                            className="pl-9"
                        />
                    </form>
                    <input ref={uploadInputRef} type="file" accept={meta.accept} className="hidden" onChange={handleUpload} />
                    <Button variant="outline" onClick={() => uploadInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        อัปโหลด ({meta.hint})
                    </Button>
                </div>

                <ScrollArea className="h-[360px] pr-2">
                    {isLoading ? (
                        <div className="flex h-[340px] items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
                            ยังไม่มีไฟล์ประเภทนี้ในคลัง
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {files.map((file) => (
                                <button
                                    key={file.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(file);
                                        onOpenChange(false);
                                    }}
                                    className={cn(
                                        "group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-muted/20 text-left",
                                        "hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                                    )}
                                >
                                    <div className="flex aspect-video items-center justify-center bg-black/40">
                                        {slot === "image" && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={file.url} alt={file.name} className="h-full w-full object-contain" />
                                        )}
                                        {slot === "video" && (
                                            <video src={file.url} muted preload="metadata" className="h-full w-full object-contain" />
                                        )}
                                        {slot === "audio" && <FileAudio className="h-8 w-8 text-emerald-400" />}
                                    </div>
                                    <span className="truncate px-2 py-1.5 text-xs">{file.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" disabled={page <= 1 || isLoading} onClick={() => fetchFiles(page - 1, search)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
                    <Button variant="ghost" size="icon" disabled={page >= totalPages || isLoading} onClick={() => fetchFiles(page + 1, search)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
