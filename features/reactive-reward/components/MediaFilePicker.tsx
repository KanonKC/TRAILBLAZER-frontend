"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import SubLabel from "@/components/SubLabel";
import { getUploadedFiles, type UploadedFile } from "@/services/uploadedFile.service";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "../hooks/useMediaUpload";
import { pickedFromUpload, type PickedFile } from "../hooks/useReactionForm";
import { UPLOAD_RULES, uploadProblem } from "../upload";
import { MediaThumb } from "./MediaThumb";

type PickerKind = "image" | "video";

const HINTS: Record<PickerKind, string> = {
    image: "ไฟล์ PNG, JPG, GIF, WebP หรือ AVIF ไม่เกิน 2 MB",
    video: "ไฟล์ MP4 (H.264) หรือ WebM ไม่เกิน 20 MB และยาวไม่เกิน 30 วินาที",
};

// A small image is tens of kilobytes, which "0.0 MB" would hide
const formatSize = (sizeKb: number) => (sizeKb < 1024 ? `${Math.max(1, Math.round(sizeKb))} KB` : `${(sizeKb / 1024).toFixed(1)} MB`);
const formatSeconds = (durationMs: number) => `${(durationMs / 1000).toFixed(1)} วินาที`;

interface MediaFilePickerProps {
    kind: PickerKind;
    value: PickedFile | null;
    onChange: (file: PickedFile | null) => void;
    disabled?: boolean;
}

/** Choose an image or video: upload a new one with progress, or pick one already in the library. */
export function MediaFilePicker({ kind, value, onChange, disabled = false }: MediaFilePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [localProblem, setLocalProblem] = useState<string | null>(null);
    const upload = useMediaUpload();
    const mediaType = kind === "image" ? "IMAGE" : "VIDEO";
    const error = localProblem ?? upload.error;

    const chooseFile = async (file: File) => {
        setLocalProblem(null);
        upload.clearError();
        // Cheap checks first, so an unusable file never starts an upload
        const problem = uploadProblem(file, kind, null);
        if (problem) {
            setLocalProblem(problem);
            return;
        }
        const uploaded = await upload.start(file, kind);
        if (uploaded) onChange(pickedFromUpload(uploaded));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-start gap-4">
                <MediaThumb mediaType={mediaType} url={value?.url} className="size-24 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                    {value ? (
                        <div className="space-y-0.5">
                            <p className="truncate text-sm font-medium">{value.name}</p>
                            <p className="text-muted-foreground font-mono text-sm tabular-nums">
                                {formatSize(value.sizeKb)}
                                {value.durationMs ? ` · ${formatSeconds(value.durationMs)}` : ""}
                            </p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm italic">ยังไม่ได้เลือกไฟล์</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" size="sm" disabled={disabled || upload.isUploading} onClick={() => inputRef.current?.click()}>
                            <Upload />
                            อัปโหลดไฟล์ใหม่
                        </Button>
                        <Button type="button" variant="outline" size="sm" disabled={disabled || upload.isUploading} onClick={() => setLibraryOpen(true)}>
                            เลือกจากไฟล์ของฉัน
                        </Button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={UPLOAD_RULES[kind].accept}
                            className="sr-only"
                            tabIndex={-1}
                            data-testid={`${kind}-file-input`}
                            onChange={(event) => {
                                const selected = event.target.files?.[0];
                                event.target.value = "";
                                if (selected) void chooseFile(selected);
                            }}
                        />
                    </div>
                    <SubLabel>{HINTS[kind]}</SubLabel>
                </div>
            </div>

            {upload.isUploading && (
                <div className="space-y-1" role="status">
                    <Progress value={upload.progress} aria-label="ความคืบหน้าการอัปโหลด" />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-mono tabular-nums">กำลังอัปโหลด {upload.progress}%</span>
                        <button type="button" className="text-muted-foreground hover:text-primary cursor-pointer underline" onClick={upload.cancel}>
                            ยกเลิก
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p role="alert" className="text-destructive flex items-start gap-2 text-sm">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {error}
                </p>
            )}

            <LibraryDialog
                kind={kind}
                open={libraryOpen}
                onOpenChange={setLibraryOpen}
                selectedKey={value?.key ?? null}
                onSelect={(file) => {
                    setLocalProblem(null);
                    upload.clearError();
                    onChange(pickedFromUpload(file));
                    setLibraryOpen(false);
                }}
            />
        </div>
    );
}

function LibraryDialog({
    kind,
    open,
    onOpenChange,
    selectedKey,
    onSelect,
}: {
    kind: PickerKind;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedKey: string | null;
    onSelect: (file: UploadedFile) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>เลือก{UPLOAD_RULES[kind].label}จากไฟล์ของฉัน</DialogTitle>
                    <DialogDescription>เลือกไฟล์ที่เคยอัปโหลดไว้แล้ว ไม่ต้องอัปโหลดซ้ำ</DialogDescription>
                </DialogHeader>
                {/* Mounted only while the dialog is open, so every opening loads the list fresh */}
                <LibraryList kind={kind} selectedKey={selectedKey} onSelect={onSelect} />
            </DialogContent>
        </Dialog>
    );
}

function LibraryList({ kind, selectedKey, onSelect }: { kind: PickerKind; selectedKey: string | null; onSelect: (file: UploadedFile) => void }) {
    const [files, setFiles] = useState<UploadedFile[] | null>(null);
    const [failed, setFailed] = useState(false);
    const mediaType = kind === "image" ? "IMAGE" : "VIDEO";

    useEffect(() => {
        let cancelled = false;
        getUploadedFiles({ type: kind, page: 1, limit: 100 }).then(
            (response) => !cancelled && setFiles(response.data),
            () => !cancelled && setFailed(true),
        );
        return () => {
            cancelled = true;
        };
    }, [kind]);

    return (
        <div className="max-h-96 overflow-y-auto">
            {failed ? (
                <p role="alert" className="text-destructive flex items-center gap-2 text-sm">
                    <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                    โหลดรายการไฟล์ไม่สำเร็จ กรุณาลองใหม่
                </p>
            ) : files === null ? (
                <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <Skeleton key={index} className="aspect-square rounded-md" />
                    ))}
                </div>
            ) : files.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">ไม่พบข้อมูล</p>
            ) : (
                <ul className="grid grid-cols-3 gap-3">
                    {files.map((file) => (
                        <li key={file.id}>
                            <button
                                type="button"
                                onClick={() => onSelect(file)}
                                aria-pressed={file.key === selectedKey}
                                className={cn(
                                    "bg-card hover:bg-secondary block w-full cursor-pointer space-y-1.5 rounded-lg border p-2 text-left",
                                    file.key === selectedKey && "border-primary bg-primary/10",
                                )}
                            >
                                <MediaThumb mediaType={mediaType} url={file.url} className="w-full" />
                                <span className="block truncate text-sm">{file.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
