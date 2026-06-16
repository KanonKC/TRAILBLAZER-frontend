"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface TestWidgetButtonProps {
  onTest: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const TestWidgetButton = ({ onTest, isLoading, disabled }: TestWidgetButtonProps) => {
  return (
    <Button variant="outline" onClick={onTest} disabled={isLoading || disabled}>
      {isLoading ? "Testing..." : <><Play className="mr-2 h-4 w-4" /> Test</>}
    </Button>
  );
};
