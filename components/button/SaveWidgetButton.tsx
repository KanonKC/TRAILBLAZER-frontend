"use client";

import { Button } from "@/components/ui/button";

interface SaveWidgetButtonProps {
  onSave: () => void;
  isLoading: boolean;
}

export const SaveWidgetButton = ({ onSave, isLoading }: SaveWidgetButtonProps) => {
  return (
    <Button onClick={onSave} disabled={isLoading}>
      {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
    </Button>
  );
};