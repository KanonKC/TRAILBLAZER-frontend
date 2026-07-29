"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getUploadedFiles, getUploadedFilesTotalSize, UploadedFile, uploadFile } from "@/services/uploadedFile.service";
import { calculateFileSizeWithUnit } from "@/utils/file";
import { tbToast } from "@/utils/tbToast";
import { Check, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Loader2, Music, Play, PlayCircle, Search, Square, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MediaPickerDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    type: "image" | "video" | "audio";
    currentKey?: string | null;
    onSelect: (file: UploadedFile) => void;
}

export default function MediaPickerDialog({ isOpen, onOpenChange, type, currentKey, onSelect }: MediaPickerDialogProps) {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalSizeKb, setTotalSizeKb] = useState(0);
    const [maxStorageKb, setMaxStorageKb] = useState(10 * 1024);

    const label = type === "image" ? "รูปภาพ" : type === "video" ? "วิดีโอ" : "เสียง";

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingId(null);
    };

    const toggleAudio = (e: React.MouseEvent, file: UploadedFile) => {
        e.stopPropagation();
        if (playingId === file.id) {
            stopAudio();
            return;
        }
        stopAudio();
        const audio = new Audio(file.url);
        audioRef.current = audio;
        audio.onended = () => setPlayingId(null);
        audio.play().then(() => setPlayingId(file.id)).catch(() => setPlayingId(null));
    };

    const fetchTotalSize = async () => {
        try {
            const result = await getUploadedFilesTotalSize();
            setTotalSizeKb(result.total_size_kb);
            setMaxStorageKb(result.max_storage_kb);
        } catch (error) {
            console.error("Failed to fetch total size:", error);
        }
    };

    const fetchLibraryFiles = async (page = 1, search = "") => {
        setIsLoadingLibrary(true);
        try {
            const response = await getUploadedFiles({ page, limit: 12, search, type });
            setLibraryFiles(response.data);
            setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
            setCurrentPage(response.pagination.page);
        } catch (error) {
            console.error("Failed to fetch library files:", error);
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTotalSize();
            const timer = setTimeout(() => {
                fetchLibraryFiles(1, searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, isOpen, type]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            stopAudio();
        }
    }, [isOpen]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLibraryFiles(newPage, searchQuery);
        }
    };

    const handleConfirmSelect = () => {
        if (!selectedFile) return;
        onSelect(selectedFile);
        stopAudio();
        onOpenChange(false);
    };

    const handleUploadFromDialog = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        if (!file.type.startsWith(`${type}/`)) {
            tbToast.error({ title: `รองรับเฉพาะไฟล์${label}` });
            return;
        }

        const fileSizeKb = file.size / 1024;
        if (totalSizeKb + Math.round(fileSizeKb) > maxStorageKb) {
            tbToast.error({ title: `ไม่สามารถอัปโหลดได้ เนื่องจากพื้นที่การใช้งานเต็ม (พื้นที่ที่ต้องใช้สำหรับไฟล์นี้ ${calculateFileSizeWithUnit(Math.round(fileSizeKb))})` });
            return;
        }

        setIsUploading(true);
        try {
            const uploaded = await uploadFile(file);
            tbToast.success({ title: `อัปโหลดไฟล์${label}สำเร็จ` });
            fetchTotalSize();
            await fetchLibraryFiles(1, searchQuery);
            setSelectedFile(uploaded);
        } catch (err) {
            tbToast.error({ title: "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", error: (err as any).response?.data });
        } finally {
            setIsUploading(false);
            if (uploadInputRef.current) uploadInputRef.current.value = "";
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, 5];
        if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>เลือกไฟล์{label}</DialogTitle>
                    <Input
                        ref={uploadInputRef}
                        type="file"
                        accept={`${type}/*`}
                        className="hidden"
                        onChange={handleUploadFromDialog}
                    />
                </DialogHeader>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={`ค้นหาไฟล์${label}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button size="sm" onClick={() => uploadInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" />กำลังอัปโหลด...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />อัปโหลดไฟล์ใหม่</>
                            )}
                        </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 w-fit">
                            <div className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                                {calculateFileSizeWithUnit(totalSizeKb)} / {calculateFileSizeWithUnit(maxStorageKb)}
                            </div>
                            <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-500 ease-out",
                                        (totalSizeKb / maxStorageKb) > 0.9 ? "bg-red-500" : (totalSizeKb / maxStorageKb) > 0.7 ? "bg-yellow-500" : "bg-green-500"
                                    )}
                                    style={{ width: `${Math.min((totalSizeKb / maxStorageKb) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <a href="/my/uploaded-files" target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-1 text-muted-foreground text-xs hover:underline cursor-pointer">
                                <span>จัดการไฟล์อัปโหลด</span>
                                <ExternalLink className="w-3 h-3" />
                            </div>
                        </a>
                    </div>

                    <ScrollArea className="h-[400px] rounded-md mt-2">
                        {isLoadingLibrary ? (
                            <div className="flex items-center justify-center py-16 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                กำลังโหลด...
                            </div>
                        ) : libraryFiles.length > 0 ? (
                            type === "audio" ? (
                                <div className="space-y-1 pr-2">
                                    {libraryFiles.map((file) => {
                                        const isSelected = selectedFile?.id === file.id;
                                        return (
                                            <div
                                                key={file.id}
                                                onClick={() => setSelectedFile(file)}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors",
                                                    isSelected ? "bg-primary/10 ring-1 ring-primary" : currentKey === file.key ? "bg-secondary" : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => toggleAudio(e, file)}>
                                                        {playingId === file.id ? <Square className="w-3.5 h-3.5 text-red-500" /> : <Play className="w-3.5 h-3.5 text-green-500" />}
                                                    </Button>
                                                    <Music className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <div className="flex flex-col min-w-0 max-w-[300px]">
                                                        <span className="text-sm font-medium truncate">{file.name}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {calculateFileSizeWithUnit(file.size_kb)} • {new Date(file.created_at).toLocaleDateString("th-TH")}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 pr-2">
                                    {libraryFiles.map((file) => {
                                        const isSelected = selectedFile?.id === file.id;
                                        return (
                                            <button
                                                type="button"
                                                key={file.id}
                                                onClick={() => setSelectedFile(file)}
                                                className={cn(
                                                    "relative flex flex-col rounded-md border overflow-hidden text-left hover:border-primary transition-colors",
                                                    isSelected ? "border-primary ring-1 ring-primary" : currentKey === file.key ? "border-primary/50" : "border-border"
                                                )}
                                            >
                                                <div className="relative aspect-video bg-muted flex items-center justify-center">
                                                    {type === "image" ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={file.url} alt={file.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <>
                                                            <video src={file.url} muted preload="metadata" className="w-full h-full object-cover" />
                                                            <PlayCircle className="absolute w-8 h-8 text-white/90 drop-shadow" />
                                                        </>
                                                    )}
                                                    {isSelected && (
                                                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-1.5">
                                                    <p className="text-xs font-medium truncate">{file.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{calculateFileSizeWithUnit(file.size_kb)}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground text-sm">
                                <ImageIcon className="w-8 h-8" />
                                ไม่พบไฟล์{label}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <div className="flex justify-between w-full items-center">
                        {totalPages > 1 ? (
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground mr-2">หน้า {currentPage} จาก {totalPages}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoadingLibrary}>
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {getPageNumbers().map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handlePageChange(pageNum)}
                                        disabled={isLoadingLibrary}
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoadingLibrary}>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : <div />}
                        <Button onClick={handleConfirmSelect} disabled={!selectedFile}>
                            <Check className="w-4 h-4 mr-2" />
                            เลือกไฟล์นี้
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
