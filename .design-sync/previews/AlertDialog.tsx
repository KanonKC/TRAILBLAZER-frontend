import * as React from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Button } from "trailblazer-ui";
import { Trash, Eye } from "lucide-react";

export const ConfirmDeleteOpen = () => (
  <div className="p-6 min-h-96">
    <AlertDialog open>
      <AlertDialogTrigger asChild><Button variant="destructive"><Trash data-icon="inline-start" /> ลบวิดเจ็ต</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณต้องการลบวิดเจ็ตนี้หรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>การลบวิดเจ็ตจะทำให้การตั้งค่าทั้งหมดหายไป และวิดเจ็ตจะถูกปิดการใช้งาน คุณจะต้องเปิดใช้งานใหม่อีกครั้งหากต้องการใช้งาน</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction variant="destructive">ยืนยันการลบ</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

export const SmallWithMedia = () => (
  <div className="p-6 min-h-96">
    <AlertDialog open>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia><Eye /></AlertDialogMedia>
          <AlertDialogTitle>แสดง Overlay URL หรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>Overlay URL เปรียบเสมือนรหัสผ่านสำหรับสตรีมของคุณ อย่าแชร์ให้ผู้อื่น</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction>แสดง URL</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
