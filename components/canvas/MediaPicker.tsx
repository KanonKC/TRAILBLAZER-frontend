"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/services/uploadedFile.service";
import { FolderOpen } from "lucide-react";
import MediaPickerDialog from "./MediaPickerDialog";

interface MediaPickerProps {
    type: "image" | "video" | "audio";
    selectedKey: string | null;
    selectedName?: string | null;
    onSelect: (file: UploadedFile) => void;
}

export function MediaPicker({ type, selectedKey, selectedName, onSelect }: MediaPickerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="flex items-center justify-between gap-2 rounded-md border p-2">
            <span className="text-xs truncate min-w-0" title={selectedName ?? undefined}>
                {selectedName || "ยังไม่ได้เลือกไฟล์"}
            </span>
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
