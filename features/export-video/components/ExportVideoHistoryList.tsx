"use client"

import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Eye, Video, Clock, Youtube, Info, AlertCircle, ExternalLink, Calendar, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { ExportVideoHistory } from "@/features/export-video/types";
import { cn } from "@/lib/utils";
import { Twitch } from "@/components/icons/twitch";

const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(dateStr));
};

interface ExportVideoHistoryListProps {
    history: ExportVideoHistory[];
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    onFetch: (page: number, limit: number) => void;
}

export function ExportVideoHistoryList({ history, isLoading, pagination, onFetch }: ExportVideoHistoryListProps) {
    const [selectedItem, setSelectedItem] = useState<ExportVideoHistory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRawDate, setShowRawDate] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        onFetch(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit, onFetch]);

    const handleViewDetail = (item: ExportVideoHistory) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        setShowRawDate(false);
        setIsCopied(false);
    };

    const handleCopyMessage = () => {
        if (!selectedItem) return;
        navigator.clipboard.writeText(displayMessage);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const displayMessage = useMemo(() => {
        if (!selectedItem || !selectedItem.message) return "";
        try {
            return JSON.stringify(JSON.parse(selectedItem.message), null, 4)
        } catch {
            return selectedItem.message
        }
    }, [selectedItem])

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    if (isLoading && history.length === 0) {
        return <div className="py-10 text-center text-muted-foreground">กำลังโหลดข้อมูล...</div>;
    }

    if (history.length === 0) {
        return (
            <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                ไม่มีประวัติการส่งออก
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Twitch Video ID</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead>วันที่ส่งออก</TableHead>
                            <TableHead className="text-center">การกระทำ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-blue-500" />
                                        <a
                                            href={`https://www.twitch.tv/videos/${item.video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-blue-400"
                                        >
                                            {item.video_id}
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={item.status === "SUCCESS" ? "outline" : "destructive"}
                                        className={cn(
                                            "font-semibold",
                                            item.status === "SUCCESS" && "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                                        )}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(item.created_at)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => handleViewDetail(item)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <p className="text-sm text-muted-foreground">
                    หน้า {pagination.page} จาก {totalPages || 1} (ทั้งหมด {pagination.total} รายการ)
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFetch(pagination.page - 1, pagination.limit)}
                        disabled={pagination.page <= 1 || isLoading}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFetch(pagination.page + 1, pagination.limit)}
                        disabled={pagination.page >= totalPages || isLoading}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-zinc-950/90 backdrop-blur-xl border-zinc-800 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Info className="w-5 h-5 text-blue-500" />
                            รายละเอียดการส่งออก
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            ข้อมูลรายละเอียดเกี่ยวกับการส่งออกวิดีโอไปยัง YouTube
                        </DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm text-muted-foreground ">
                                        <Twitch className="w-3.5 h-3.5" />
                                        Twitch Video ID
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={selectedItem.video_id}
                                            readOnly
                                            className="bg-white/5 border-white/10 pr-10"
                                        />
                                        <a
                                            href={`https://www.twitch.tv/videos/${selectedItem.video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm text-muted-foreground uppercase">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Status
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={selectedItem.status === "SUCCESS" ? "outline" : "destructive"}
                                            className={cn(
                                                "h-10 px-4 flex-1 justify-center font-bold",
                                                selectedItem.status === "SUCCESS" && "bg-green-500/10 text-green-500 border-green-500/20"
                                            )}
                                        >
                                            {selectedItem.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm text-muted-foreground uppercase">
                                    <Clock className="w-3.5 h-3.5" />
                                    วันที่ส่งออก
                                </Label>
                                <div className="relative">
                                    <Input
                                        value={showRawDate ? selectedItem.created_at : formatDate(selectedItem.created_at)}
                                        readOnly
                                        className="bg-white/5 border-white/10 pr-10"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-white"
                                        onClick={() => setShowRawDate(!showRawDate)}
                                        title={showRawDate ? "Show Formatted Date" : "Show Raw Date"}
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-sm text-muted-foreground uppercase">
                                        <Info className="w-3.5 h-3.5" />
                                        ข้อความ/รายละเอียด
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-white"
                                        onClick={handleCopyMessage}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check className="w-3 h-3" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <Textarea
                                    value={displayMessage}
                                    readOnly
                                    rows={displayMessage.split("\n").length}
                                    className="bg-white/5 border-white/10 min-h-[150px] leading-relaxed font-mono"
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
