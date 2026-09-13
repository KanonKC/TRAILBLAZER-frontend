---
category: App
---
Single collapsible help panel used on widget pages: translucent white-on-dark (`variant="overlay"`, default) or `bg-card` (`"default"`). Compose with `TrailblazerAccordianTrigger` and `TrailblazerAccordianContent`; `defaultOpen` starts expanded.

## Usage

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

## Parts

- `TrailblazerAccordianTrigger` - the clickable header row (`variant` must match the parent)
- `TrailblazerAccordianContent` - padded body
