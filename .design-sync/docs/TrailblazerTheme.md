---
category: Brand
---
Theme root. Renders the `.dark` scope with `bg-background text-foreground font-sans` - the exact thing `app/layout.tsx` puts on `<html>`. **Wrap every design in it once, at the root**; without it components render in the unused light palette and `dark:` variants don't apply.

## Usage

```tsx
import { TrailblazerTheme } from "trailblazer-ui";

<TrailblazerTheme className="min-h-screen">
  {/* page content */}
</TrailblazerTheme>
```
