"use client"

import { useRef, useState, useEffect } from "react";
import { Music, Upload, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getUploadedFiles, UploadedFile } from "@/services/uploadedFile.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AudioFileUploaderProps {
    currentFileName?: string | null;
    selectedFile: File | UploadedFile | null;
    onFileSelect: (file: File | UploadedFile | null) => void;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    hideLabel?: boolean;
}

export function AudioFileUploader({
    currentFileName,
    selectedFile,
    onFileSelect,
    disabled = false,
    className,
    inputClassName,
    hideLabel = false
}: AudioFileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const MAX_FILE_SIZE = 2.5 * 1024 * 1024; // 2.5MB
    const ACCEPTED_FILE_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];

    const fileSchema = z
        .custom<File>((file) => file instanceof File, "ข้อมูลไม่ถูกต้อง")
        .refine((file) => file.size <= MAX_FILE_SIZE, "ขนาดไฟล์ต้องไม่เกิน 2.5 MB")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'),
            "รองรับเฉพาะไฟล์ .mp3, .wav, .ogg"
        );

    const [isChanging, setIsChanging] = useState(false);

    const hasCurrentFile = !!currentFileName;
    const isReplacing = !!selectedFile;
    const showCurrentFileView = hasCurrentFile && !isReplacing && !isChanging;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const result = fileSchema.safeParse(file);

            if (!result.success) {
                setError(result.error.issues[0].message);
                // Reset input to allow selecting the same invalid file again to trigger error if needed, or just leave it
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            setError(null);
            onFileSelect(file);
        }
    };

    const handleCancelReplace = () => {
        setError(null);
        onFileSelect(null);
        setIsChanging(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");

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
        if (activeTab === "library") {
            const timer = setTimeout(() => {
                fetchLibraryFiles(1, searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, activeTab]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchLibraryFiles(newPage, searchQuery);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {!hideLabel && (
                <div>
                    <Label htmlFor="qs_audio_file" className={cn(className?.includes("text-white") ? "text-white" : "")}>
                        ไฟล์เสียง
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        อัปโหลดไฟล์เสียงที่จะเล่นเมื่อมีผู้ชมใหม่เข้ามาพิมพ์ข้อความแรก (รองรับไฟล์ MP3, WAV)
                    </p>
                </div>
            )}

            {showCurrentFileView && (
                <div className={cn(
                    "flex items-center justify-between p-3 border rounded-lg mb-4",
                    className?.includes("text-white") ? "border-white/20 bg-white/5" : "bg-card"
                )}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn("p-2 rounded-md", className?.includes("text-white") ? "bg-white/10" : "bg-secondary")}>
                            <Music className={cn("w-4 h-4", className?.includes("text-white") ? "text-white" : "text-primary")} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className={cn("text-sm font-medium truncate", className?.includes("text-white") ? "text-white" : "")}>
                                {currentFileName?.split('/').pop()}
                            </span>
                            <span className={cn("text-xs", className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")}>
                                ไฟล์เสียงปัจจุบัน
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onFileSelect(null);
                            setIsChanging(true);
                        }}
                        disabled={disabled}
                        className={cn(
                            className?.includes("text-white") ? "bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white" : ""
                        )}
                    >
                        เปลี่ยนไฟล์ใหม่
                    </Button>
                </div>
            )}

            <div className={cn(showCurrentFileView ? "hidden" : "")}>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "library")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            อัปโหลดใหม่
                        </TabsTrigger>
                        <TabsTrigger value="library" className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            เลือกจากคลัง
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-0">
                        <Input
                            ref={fileInputRef}
                            id="qs_audio_file"
                            type="file"
                            accept=".mp3,.wav,.ogg"
                            disabled={disabled}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div
                            className={cn(
                                "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                                className?.includes("text-white") ? "border-white/20 hover:bg-white/5" : "border-muted-foreground/25 hover:bg-muted/50",
                                error ? "border-red-500/50 bg-red-500/5" : ""
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className={cn("p-4 rounded-full mb-4", className?.includes("text-white") ? "bg-white/10" : "bg-secondary")}>
                                <Upload className={cn("w-6 h-6", className?.includes("text-white") ? "text-white" : "text-primary")} />
                            </div>
                            <div className="text-center space-y-1">
                                <p className={cn("text-sm font-medium", className?.includes("text-white") ? "text-white" : "")}>
                                    {selectedFile ? selectedFile.name : "คลิกเพื่อเลือกไฟล์"}
                                </p>
                                <p className={cn("text-xs", className?.includes("text-white") ? "text-white/50" : "text-muted-foreground")}>
                                    {error || (selectedFile ? "พร้อมอัปโหลด" : "รองรับไฟล์ .mp3, .wav, .ogg (สูงสุด 2.5MB)")}
                                </p>
                            </div>
                            {selectedFile && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelReplace();
                                    }}
                                >
                                    ยกเลิก
                                </Button>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="library" className="mt-0 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ค้นหาไฟล์เสียง..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <ScrollArea className="h-[200px] border rounded-md">
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
                                                selectedFile === null && currentFileName === file.name ? "bg-secondary" : ""
                                            )}
                                            onClick={() => {
                                                onFileSelect(file);
                                            }}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-secondary rounded-md shrink-0">
                                                    <Music className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                                    <span className="text-xs text-muted-foreground">
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
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}
