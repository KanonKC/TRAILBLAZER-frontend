import type { ReactNode } from "react";
import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  danger: {
    box: "border-red-400/25 bg-red-400/10",
    text: "text-red-300",
    Icon: OctagonAlert,
  },
  warning: {
    box: "border-amber-400/25 bg-amber-400/10",
    text: "text-amber-300",
    Icon: AlertTriangle,
  },
  info: {
    box: "border-border bg-muted/40",
    text: "text-muted-foreground",
    Icon: Info,
  },
} as const;

export function Callout({
  tone,
  title,
  children,
  actions,
  className,
}: {
  tone: keyof typeof tones;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const { box, text, Icon } = tones[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        box,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", text)} aria-hidden="true" />
      <div className="grid min-w-0 gap-1">
        {title && <b className={cn("font-semibold", text)}>{title}</b>}
        {children && <span>{children}</span>}
        {actions && <div className="mt-1 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
