import React, { useRef, useState, useEffect } from "react";
import { Music, Upload, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUploadedFiles, uploadFile, UploadedFile } from "@/services/uploadedFile.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AudioFileUploaderDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentFileName?: string | null;
    onFileSelect: (file: File | UploadedFile | null, fileKey: string | null) => void;
}

const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 2.5MB
const ACCEPTED_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];

const fileSchema = z
    .custom<File>((file) => file instanceof File, "ข้อมูลไม่ถูกต้อง")
    .refine((file) => file.size <= MAX_FILE_SIZE, "ขนาดไฟล์ต้องไม่เกิน 2.5 MB")
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'),
        "รองรับเฉพาะไฟล์ .mp3, .wav, .ogg"
    );

export default function AudioFileUploaderDialog({
    isOpen,
    onOpenChange,
    currentFileName,
    onFileSelect
}: AudioFileUploaderDialogProps) {
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Library state
    const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLibraryFiles = async (page = 1, search = "") => {
        setIsLoadingLibrary(true);
        try {
            const response = await getUploadedFiles({
                page,
                limit: 10,
                search,
                type: "audio"
            });
            setLibraryFiles(response.data);
            setTotalPages(response.totalPages);
            setCurrentPage(response.page);
        } catch (error) {
            console.error("Failed to fetch library files:", error);
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                fetchLibraryFiles(1, searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, isOpen]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLibraryFiles(newPage, searchQuery);
        }
    };

    const handleSelectLibraryFile = (file: UploadedFile) => {
        onFileSelect(file, file.key);
        onOpenChange(false);
    };

    const handleUploadFromDialog = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        const result = fileSchema.safeParse(file);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        setIsUploading(true);
        try {
            await uploadFile(file);
            toast.success("อัปโหลดไฟล์เสียงสำเร็จ");
            await fetchLibraryFiles(1, searchQuery);
        } catch (err) {
            toast.error("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsUploading(false);
            if (uploadInputRef.current) uploadInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>เลือกไฟล์เสียง</DialogTitle>
                        <Input
                            ref={uploadInputRef}
                            type="file"
                            accept=".mp3,.wav,.ogg"
                            className="hidden"
                            onChange={handleUploadFromDialog}
                        />
                        <Button
                            size="sm"
                            onClick={() => uploadInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" />กำลังอัปโหลด...</>
                            ) : (
                                <><Upload className="w-4 h-4 mr-2" />อัปโหลดไฟล์เสียง</>
                            )}
                        </Button>
                    </div>
                </DialogHeader>

                {/* Library section */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ค้นหาไฟล์เสียง..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <ScrollArea className="h-[400px] rounded-md ">
                        <div className="p-2 space-y-1">
                            {isLoadingLibrary ? (
                                <div className="flex items-center justify-center py-8 text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    กำลังโหลด...
                                </div>
                            ) : libraryFiles.length > 0 ? (
                                libraryFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className={cn(
                                            "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors",
                                            currentFileName === file.name ? "bg-secondary" : ""
                                        )}
                                        onClick={() => handleSelectLibraryFile(file)}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-secondary rounded-md shrink-0">
                                                <Music className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col min-w-0 max-w-[300px]">
                                                <span className="text-sm font-medium truncate">{file.name}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString('th-TH')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    ไม่พบไฟล์เสียง
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                หน้า {currentPage} จาก {totalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoadingLibrary}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || isLoadingLibrary}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}