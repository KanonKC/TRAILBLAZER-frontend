---
category: App
---
`TrailblazerAccordianTrigger` is part of the **TrailblazerAccordian** family - the clickable header row (`variant` must match the parent). Render it inside the `TrailblazerAccordian` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { TrailblazerAccordian, TrailblazerAccordianTrigger, TrailblazerAccordianContent } from "trailblazer-ui";
import { HelpCircle } from "lucide-react";

<TrailblazerAccordian defaultOpen>
  <TrailblazerAccordianTrigger>
    <span className="flex items-center gap-2 text-sm font-medium"><HelpCircle className="size-4 text-white/70" /> วิธีตั้งค่าใน OBS</span>
  </TrailblazerAccordianTrigger>
  <TrailblazerAccordianContent>
    <ol className="list-decimal pl-5 text-sm text-white/70 space-y-1"><li>Sources › Add Source › Browser</li><li>วาง URL</li></ol>
  </TrailblazerAccordianContent>
</TrailblazerAccordian>
```

See `TrailblazerAccordian.prompt.md` for the family overview.
