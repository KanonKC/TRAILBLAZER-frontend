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

export function Field({
  label,
  htmlFor,
  help,
  aside,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm leading-none font-medium">
          {label}
        </label>
        {aside}
      </div>
      {help && <p className="text-muted-foreground text-sm">{help}</p>}
      {children}
    </div>
  );
}
