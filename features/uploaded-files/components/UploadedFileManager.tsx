"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    deleteUploadedFile,
    getUploadedFile,
    getUploadedFiles,
    getUploadedFilesTotalSize,
    UploadedFile,
    uploadFile,
    updateUploadedFile
} from "@/services/uploadedFile.service";
import { calculateFileSizeWithUnit } from "@/utils/file";
import { tbToast } from "@/utils/tbToast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Loader2,
    Play,
    Search,
    Square,
    Trash2,
    Upload,
    X
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // Increased to 10MB for general management
const ACCEPTED_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "image/png", "image/jpeg", "image/gif"];

export default function UploadedFileManager() {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [playingFileId, setPlayingFileId] = useState<string | null>(null);
    const [isLoadingAudio, setIsLoadingAudio] = useState<string | null>(null);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    // Renaming state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Library state
    const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalSizeKb, setTotalSizeKb] = useState(0);
    const [maxStorageKb, setMaxStorageKb] = useState(10 * 1024);

    // Deletion confirmation state
    const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);
    const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

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
            const response = await getUploadedFiles({
                page,
                limit: 10,
                search,
            });
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
        fetchTotalSize();
        const timer = setTimeout(() => {
            fetchLibraryFiles(1, searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLibraryFiles(newPage, searchQuery);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingFileId(null);
    };

    const handlePlayAudio = async (e: React.MouseEvent, file: UploadedFile) => {
        e.stopPropagation();

        if (playingFileId === file.id) {
            stopAudio();
            return;
        }

        stopAudio();
        setIsLoadingAudio(file.id);
        try {
            const fetched = await getUploadedFile(file.id);
            if (!fetched.url) return;

            const audio = new Audio(fetched.url);
            audio.volume = 1;
            audioRef.current = audio;
            audio.onended = () => setPlayingFileId(null);

            await audio.play();
            setPlayingFileId(file.id);
        } catch {
            setPlayingFileId(null);
        } finally {
            setIsLoadingAudio(null);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        if (file.size > MAX_FILE_SIZE) {
            tbToast.error({ title: "ขนาดไฟล์ต้องไม่เกิน 10 MB" });
            return;
        }

        setIsUploading(true);
        try {
            await uploadFile(file);
            tbToast.success({ title: "อัปโหลดไฟล์สำเร็จ" });
            fetchTotalSize();
            await fetchLibraryFiles(1, searchQuery);
        } catch (err) {
            tbToast.error({ title: "อัปโหลดไฟล์ไม่สำเร็จ", error: (err as any).response?.data });
        } finally {
            setIsUploading(false);
            if (uploadInputRef.current) uploadInputRef.current.value = "";
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsBulkDeleteConfirmOpen(true);
    };

    const confirmBulkDelete = async () => {
        setIsBulkDeleteConfirmOpen(false);
        try {
            await Promise.all(selectedIds.map(id => deleteUploadedFile(id)));
            tbToast.success({ title: `ลบไฟล์สำเร็จ ${selectedIds.length} ไฟล์` });
            setSelectedIds([]);
            fetchTotalSize();
            fetchLibraryFiles(currentPage, searchQuery);
        } catch (err) {
            tbToast.error({ title: "ลบไฟล์บางส่วนหรือทั้งหมดไม่สำเร็จ" });
        } finally {
            setIsDeletingBulk(false);
        }
    };

    const handleToggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleToggleAll = () => {
        if (selectedIds.length === libraryFiles.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(libraryFiles.map(f => f.id));
        }
    };

    const startEditing = (file: UploadedFile) => {
        setEditingId(file.id);
        setEditValue(file.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleRename = async () => {
        if (!editingId || !editValue.trim()) return;

        setIsUpdating(true);
        try {
            await updateUploadedFile(editingId, { name: editValue.trim() });
            tbToast.success({ title: "เปลี่ยนชื่อไฟล์สำเร็จ" });
            setLibraryFiles(prev => prev.map(f => f.id === editingId ? { ...f, name: editValue.trim() } : f));
            setEditingId(null);
        } catch (err) {
            tbToast.error({ title: "เปลี่ยนชื่อไฟล์ไม่สำเร็จ" });
        } finally {
            setIsUpdating(false);
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5];
        }
        if (currentPage >= totalPages - 2) {
            return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-bold">จัดการไฟล์ของคุณ</h1>
                    <div className="flex items-center gap-2">
                        <Input
                            ref={uploadInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                        />
                        <Button
                            onClick={() => uploadInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" />กำลังอัปโหลด...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />อัปโหลดไฟล์</>
                            )}
                        </Button>
                        {selectedIds.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                disabled={isDeletingBulk}
                            >
                                {isDeletingBulk ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />กำลังลบ...</>
                                ) : (
                                    <><Trash2 className="w-4 h-4 mr-2" />ลบ ({selectedIds.length})</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาไฟล์..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-secondary/30 px-3 py-1.5 rounded-lg border">
                        <div className="text-[12px] font-medium text-muted-foreground whitespace-nowrap">
                            การใช้งาน: {calculateFileSizeWithUnit(totalSizeKb)} / {calculateFileSizeWithUnit(maxStorageKb)}
                        </div>
                        <div className="h-1.5 w-32 bg-secondary rounded-full overflow-hidden border">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500 ease-out",
                                    (totalSizeKb / maxStorageKb) > 0.9 ? "bg-red-500" : (totalSizeKb / maxStorageKb) > 0.7 ? "bg-yellow-500" : "bg-primary"
                                )}
                                style={{ width: `${Math.min((totalSizeKb / maxStorageKb) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
                <div className="flex-1 overflow-hidden relative min-h-0">
                    <ScrollArea className="h-full w-full">
                        <div className="p-4">
                            <div className="flex items-center gap-4 mb-2 px-4 py-2 text-sm font-medium text-muted-foreground border-b uppercase tracking-wider sticky top-0 bg-card z-10">
                                <div className="w-5 shrink-0 flex justify-center">
                                    <Checkbox
                                        className="cursor-pointer"
                                        checked={selectedIds.length > 0 && selectedIds.length === libraryFiles.length}
                                        onCheckedChange={handleToggleAll}
                                    />
                                </div>
                                <div className="flex-1 pl-4">ชื่อไฟล์</div>
                                <div className="w-20 text-center hidden sm:block">ประเภท</div>
                                <div className="w-20 text-center hidden md:block">ขนาด</div>
                                <div className="w-15 text-right">จัดการ</div>
                            </div>

                            <div className="space-y-1">
                                {isLoadingLibrary ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                        <span className="text-lg">กำลังโหลดไฟล์ของคุณ...</span>
                                    </div>
                                ) : libraryFiles.length > 0 ? (
                                    libraryFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className={cn(
                                                "flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-all border border-transparent group",
                                                selectedIds.includes(file.id) ? "bg-primary/5 border-primary/20 shadow-sm" : ""
                                            )}
                                        >
                                            <div className="w-5 shrink-0 flex justify-center">
                                                <Checkbox
                                                    className="cursor-pointer"
                                                    checked={selectedIds.includes(file.id)}
                                                    onCheckedChange={() => handleToggleSelection(file.id)}
                                                />
                                            </div>

                                            <div className="flex-1 flex items-center gap-3 overflow-hidden min-w-0 pl-4">
                                                {(file.type.startsWith('audio/') || file.type.startsWith('application/ogg')) && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className={cn(
                                                            "h-9 w-9 shrink-0 rounded-full border-primary/20 hover:border-primary transition-colors",
                                                            playingFileId === file.id && "bg-primary/10 border-primary"
                                                        )}
                                                        disabled={isLoadingAudio === file.id}
                                                        onClick={(e) => handlePlayAudio(e, file)}
                                                    >
                                                        {isLoadingAudio === file.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                        ) : playingFileId === file.id ? (
                                                            <Square className="w-4 h-4 text-red-500 fill-red-500" />
                                                        ) : (
                                                            <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                                        )}
                                                    </Button>
                                                )}

                                                <div className="flex flex-col min-w-0 flex-1">
                                                    {editingId === file.id ? (
                                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <Input
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="h-8 py-0 focus-visible:ring-1"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleRename();
                                                                    if (e.key === 'Escape') cancelEditing();
                                                                }}
                                                            />
                                                            <div className="flex gap-0.5">
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={handleRename} disabled={isUpdating}>
                                                                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                                </Button>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={cancelEditing} disabled={isUpdating}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 group/name overflow-hidden">
                                                            <span className="text-sm truncate text-foreground/90 group-hover:text-foreground transition-colors">{file.name}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                                onClick={() => startEditing(file)}
                                                            >
                                                                <Edit2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 font-medium">
                                                        <span className="bg-secondary/50 px-1.5 rounded-sm font-bold text-[9px] uppercase tracking-tighter shrink-0">
                                                            {file.type.split('/')[1] || 'FILE'}
                                                        </span>
                                                        <span className="opacity-50">•</span>
                                                        <span>{calculateFileSizeWithUnit(file.size_kb)}</span>
                                                        <span className="opacity-50 hidden sm:inline">•</span>
                                                        <span className="hidden sm:inline">{new Date(file.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-20 text-center hidden sm:block text-xs font-medium text-muted-foreground uppercase opacity-60">
                                                {file.type.split('/')[1]}
                                            </div>
                                            <div className="w-20 text-center hidden md:block text-xs font-medium text-muted-foreground opacity-60">
                                                {calculateFileSizeWithUnit(file.size_kb)}
                                            </div>

                                            <div className="w-15 shrink-0 flex justify-end pr-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground/30 group-hover:text-rose-600 hover:bg-rose-50 transition-all rounded-lg"
                                                    onClick={() => setFileToDelete(file)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                                        <Search className="w-12 h-12 mb-4 opacity-20" />
                                        <span className="text-lg font-medium text-foreground/60">ไม่พบไฟล์ที่คุณกำลังมองหา</span>
                                        <span className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะ</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t bg-card border-border flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 transition-all">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                            หน้า <span className="text-foreground">{currentPage}</span> จาก <span className="text-foreground">{totalPages}</span>
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg shrink-0"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoadingLibrary}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex gap-1 px-1">
                                {getPageNumbers().map(pageNum => (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "secondary" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-all shrink-0",
                                            pageNum === currentPage ? "bg-secondary text-secondary-foreground shadow-sm" : "hover:bg-secondary/50"
                                        )}
                                        onClick={() => handlePageChange(pageNum)}
                                        disabled={isLoadingLibrary}
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-lg shrink-0"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoadingLibrary}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Single File Confirmation */}
            <Dialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>ลบไฟล์</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ <span className="font-bold text-foreground">"{fileToDelete?.name}"</span>?
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setFileToDelete(null)}>ยกเลิก</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (!fileToDelete) return;
                                try {
                                    await deleteUploadedFile(fileToDelete.id);
                                    tbToast.success({ title: "ลบไฟล์สำเร็จ" });
                                    setFileToDelete(null);
                                    fetchTotalSize();
                                    fetchLibraryFiles(currentPage, searchQuery);
                                } catch {
                                    tbToast.error({ title: "ลบไฟล์ไม่สำเร็จ" });
                                }
                            }}
                        >
                            ยืนยันการลบ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation */}
            <Dialog open={isBulkDeleteConfirmOpen} onOpenChange={setIsBulkDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>ลบหลายไฟล์</DialogTitle>
                        <DialogDescription>
                            คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ที่เลือกทั้งหมด <span className="font-bold text-foreground">{selectedIds.length} ไฟล์</span>?
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsBulkDeleteConfirmOpen(false)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={confirmBulkDelete}>ยืนยันการลบทั้งหมด</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
