import UploadedFileManager from "@/features/uploaded-files/components/UploadedFileManager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "จัดการไฟล์ | TRAILBLAZER",
    description: "จัดการไฟล์เสียงและรูปภาพที่คุณอัปโหลดไว้",
};

export default function MyUploadedFilesPage() {
    return (
        <div className="container mx-auto py-6 max-w-5xl h-[calc(100vh-8rem)]">
            <UploadedFileManager />
        </div>
    );
}
