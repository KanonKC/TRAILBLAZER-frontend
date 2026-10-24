import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
          "bg-muted/40 focus-visible:ring-foreground/40 grid min-h-19 content-start gap-1 rounded-lg border px-4 py-3 text-left outline-none focus-visible:ring-2",
          checked
            ? "border-foreground ring-foreground ring-1"
            : "hover:border-muted-foreground",
          disabled && "cursor-not-allowed opacity-50 hover:border-border",
          badge && "pr-28",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-4" />
          {title}
          {checked && <Check className="ml-auto size-4" aria-hidden="true" />}
        </span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </button>
      {badge && <span className="absolute top-2.5 right-2.5">{badge}</span>}
    </div>
  );
}

export function ComingSoonBadge() {
  return (
    <span className="bg-muted inline-flex h-6 items-center rounded-full border px-2 text-sm font-medium whitespace-nowrap">
      Coming soon
    </span>
  );
}
