import type { ComponentType, ReactNode } from "react";

export function SectionTitle({
  icon: Icon,
  children,
  id,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  id?: string;
}) {
  return (
    <h3 id={id} className="flex items-center gap-2 text-base font-semibold">
      <Icon className="text-muted-foreground size-5" />
      {children}
    </h3>
  );
}
