import type { ComponentType, ReactNode } from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SubLabel from "@/components/SubLabel";
import { cn } from "@/lib/utils";

/**
 * One choice of a `RadioGroup`: a bordered row with a radio button, icon, title and description.
 * The whole row selects it. Give every choice of a page a different icon.
 */
export function OptionCard({
  id,
  value,
  icon: Icon,
  title,
  description,
  checked,
  disabled,
  badge,
}: {
  id: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: ReactNode;
  checked: boolean;
  disabled?: boolean;
  badge?: ReactNode;
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 leading-normal font-normal",
        checked ? "border-primary bg-primary/10" : "bg-card",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer " + (checked ? "" : "hover:bg-secondary"),
      )}
    >
      <RadioGroupItem
        value={value}
        id={id}
        disabled={disabled}
        className="mt-0.5"
      />
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {title}
        </span>
        <SubLabel>{description}</SubLabel>
      </span>
      {badge}
    </Label>
  );
}
