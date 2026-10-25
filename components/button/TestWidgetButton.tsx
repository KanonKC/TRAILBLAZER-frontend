"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";

interface TestWidgetButtonProps {
  onTest: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const TestWidgetButton = ({ onTest, isLoading, disabled }: TestWidgetButtonProps) => {
  return (
    <Button variant="outline" className="bg-secondary border-border hover:bg-secondary hover:text-primary" onClick={onTest} disabled={isLoading || disabled}>
      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังทดสอบ...</> : <><Play className="mr-2 h-4 w-4" /> ทดสอบ</>}
    </Button>
  );
};
