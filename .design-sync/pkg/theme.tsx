import * as React from "react";

/**
 * Theme root for TRAILBLAZER. The app hard-codes `<html class="dark">`
 * (app/layout.tsx) - the brand palette (orange primary, gold accent, near-black
 * surfaces) lives under `.dark` in app/globals.css. Wrap every design in this
 * once, at the root: it renders the dark scope with the body font and also
 * puts `dark` on <html> so portaled overlays (Dialog, Select, DropdownMenu,
 * Tooltip...) pick up the same palette.
 */
export function TrailblazerTheme({ children, className }: { children?: React.ReactNode; className?: string }) {
  React.useEffect(() => {
    const root = document.documentElement;
    const added = !root.classList.contains("dark");
    root.classList.add("dark");
    return () => { if (added) root.classList.remove("dark"); };
  }, []);
  return (
    <div className={["dark bg-background text-foreground font-sans antialiased min-h-full", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
