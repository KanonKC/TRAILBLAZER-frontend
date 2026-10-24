"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveWidgetButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

export const SaveWidgetButton = ({ onSave, isLoading }: SaveWidgetButtonProps) => {
  return (
    <Button onClick={onSave} disabled={isLoading}>
      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</> : "บันทึกการเปลี่ยนแปลง"}
    </Button>
  );
};