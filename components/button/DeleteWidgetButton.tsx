"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

interface DeleteWidgetButtonProps {
  onDelete: () => void;
  isLoading: boolean;
}

export const DeleteWidgetButton = ({ onDelete, isLoading }: DeleteWidgetButtonProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isLoading}
        >
          <Trash className="w-4 h-4 shrink-0" />
          ลบวิดเจ็ต
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณต้องการลบวิดเจ็ตนี้หรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>
            การลบวิดเจ็ตจะทำให้การตั้งค่าทั้งหมดหายไป และวิดเจ็ตจะถูกปิดการใช้งาน คุณจะต้องเปิดใช้งานใหม่อีกครั้งหากต้องการใช้งาน
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete();
              setShowConfirmDelete(false);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            ยืนยันการลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};