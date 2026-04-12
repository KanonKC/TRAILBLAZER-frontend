"use client"

import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Video } from "lucide-react";
import { ExportVideoHistory } from "@/features/export-video/types";

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
    onDelete: (id: number) => void;
    onFetch: (page: number, limit: number) => void;
}

export function ExportVideoHistoryList({ history, isLoading, pagination, onDelete, onFetch }: ExportVideoHistoryListProps) {
    useEffect(() => {
        onFetch(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit, onFetch]);

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
                            <TableHead>วิดีโอ ID</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead>วันที่ส่งออก</TableHead>
                            <TableHead className="text-right">การกระทำ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Video className="w-4 h-4 text-blue-500" />
                                    <a 
                                        href={`https://www.youtube.com/watch?v=${item.video_id}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:underline text-blue-400"
                                    >
                                        {item.video_id}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.status === "SUCCESS" ? "default" : "destructive"}>
                                        {item.status}
                                    </Badge>
                                    {item.message && (
                                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                                            {item.message}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(item.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-red-500"
                                        onClick={() => onDelete(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
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
                        ก่อนหน้า
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFetch(pagination.page + 1, pagination.limit)}
                        disabled={pagination.page >= totalPages || isLoading}
                    >
                        ถัดไป
                    </Button>
                </div>
            </div>
        </div>
    );
}
