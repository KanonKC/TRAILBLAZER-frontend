"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SaveWidgetButtonProps {
  onSave: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SaveWidgetButton = ({ onSave, isLoading, disabled }: SaveWidgetButtonProps) => {
  return (
    <Button onClick={onSave} disabled={isLoading || disabled}>
      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</> : "บันทึกการเปลี่ยนแปลง"}
    </Button>
  );
};