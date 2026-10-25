import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOCUS_RING } from "../constants";

/** Radio-style card used for mode and animation choices. */
export function OptionCard({
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  badge,
  onSelect,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: ReactNode;
  checked: boolean;
  disabled?: boolean;
  badge?: ReactNode;
  onSelect?: () => void;
}) {
  return (
    <div className="relative grid">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={onSelect}
        className={cn(
          "grid min-h-19 content-start gap-1 rounded-lg border px-4 py-3 text-left",
          FOCUS_RING,
          checked
            ? "border-primary bg-primary/10"
            : "bg-card hover:bg-secondary",
          disabled && "cursor-not-allowed opacity-50 hover:bg-card",
          badge && "pr-28",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-4" />
          {title}
          {checked && (
            <Check className="text-primary ml-auto size-4" aria-hidden="true" />
          )}
        </span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </button>
      {badge && <span className="absolute top-2.5 right-2.5">{badge}</span>}
    </div>
  );
}
