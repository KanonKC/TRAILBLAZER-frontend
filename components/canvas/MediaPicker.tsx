"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/services/uploadedFile.service";
import { FolderOpen, Music } from "lucide-react";
import MediaPickerDialog from "./MediaPickerDialog";

interface MediaPickerProps {
    type: "image" | "video" | "audio";
    selectedKey: string | null;
    selectedName?: string | null;
    selectedUrl?: string | null;
    onSelect: (file: UploadedFile) => void;
}

export function MediaPicker({ type, selectedKey, selectedName, selectedUrl, onSelect }: MediaPickerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const hasThumb = (type === "image" || type === "video") && !!selectedUrl;

    return (
        <div className="flex items-center justify-between gap-2 rounded-md border p-2">
            <div className="flex items-center gap-2 min-w-0">
                {hasThumb ? (
                    <div className="h-8 w-8 shrink-0 rounded overflow-hidden bg-muted border">
                        {type === "image" ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={selectedUrl!} alt={selectedName ?? ""} className="w-full h-full object-cover" />
                        ) : (
                            <video src={selectedUrl!} muted preload="metadata" className="w-full h-full object-cover" />
                        )}
                    </div>
                ) : type === "audio" && selectedKey ? (
                    <div className="h-8 w-8 shrink-0 rounded bg-muted border flex items-center justify-center">
                        <Music className="h-4 w-4 text-muted-foreground" />
                    </div>
                ) : null}
                <span className="text-xs truncate min-w-0" title={selectedName ?? undefined}>
                    {selectedName || "ยังไม่ได้เลือกไฟล์"}
                </span>
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setIsDialogOpen(true)}>
                <FolderOpen className="h-3.5 w-3.5 mr-1" />
                {selectedKey ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
            </Button>

            <MediaPickerDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                type={type}
                currentKey={selectedKey}
                onSelect={onSelect}
            />
        </div>
    );
}
