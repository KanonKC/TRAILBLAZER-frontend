import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section icon colors by section type (design system: messaging `info`, metadata `teal`, safety `violet`, points `supernova`). */
const tones = {
  primary: "text-primary",
  info: "text-info",
  teal: "text-teal",
  violet: "text-violet",
  supernova: "text-supernova",
} as const;

export function SectionTitle({
  icon: Icon,
  tone = "primary",
  children,
  id,
}: {
  icon: ComponentType<{ className?: string }>;
  tone?: keyof typeof tones;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b pb-2">
      <Icon className={cn("size-5", tones[tone])} aria-hidden="true" />
      <h3 id={id} className="text-lg font-semibold">
        {children}
      </h3>
    </div>
  );
}
