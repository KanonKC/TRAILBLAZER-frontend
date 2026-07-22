"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getUploadedFiles, uploadFile, UploadedFile } from "@/services/uploadedFile.service";
import { tbToast } from "@/utils/tbToast";
import { Upload } from "lucide-react";

interface MediaPickerProps {
    type: "image" | "video" | "audio";
    selectedKey: string | null;
    onSelect: (file: UploadedFile) => void;
}

export function MediaPicker({ type, selectedKey, onSelect }: MediaPickerProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const load = async () => {
        setIsLoading(true);
        try {
            const res = await getUploadedFiles({ type, limit: 50 });
            setFiles(res.data);
        } catch (error) {
            console.error("Failed to load uploaded files", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setIsUploading(true);
        try {
            const uploaded = await uploadFile(file);
            setFiles((prev) => [uploaded, ...prev]);
            onSelect(uploaded);
        } catch (error) {
            console.error("Failed to upload file", error);
            tbToast.error({ title: "อัปโหลดไฟล์ไม่สำเร็จ" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer w-fit">
                <Button type="button" variant="outline" size="sm" disabled={isUploading} asChild>
                    <span>
                        <Upload className="h-4 w-4 mr-1" />
                        {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์ใหม่"}
                    </span>
                </Button>
                <input
                    type="file"
                    accept={`${type}/*`}
                    className="hidden"
                    onChange={handleUpload}
                    disabled={isUploading}
                />
            </label>

            {isLoading ? (
                <p className="text-sm text-muted-foreground">กำลังโหลดไฟล์...</p>
            ) : files.length === 0 ? (
                <p className="text-sm text-muted-foreground">ยังไม่มีไฟล์ที่อัปโหลด</p>
            ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {files.map((file) => (
                        <button
                            type="button"
                            key={file.key}
                            onClick={() => onSelect(file)}
                            className={`border rounded-md p-2 text-xs text-left truncate hover:border-primary transition-colors ${selectedKey === file.key ? "border-primary bg-primary/5" : "border-muted"
                                }`}
                            title={file.name}
                        >
                            {file.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
