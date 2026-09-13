---
category: Feedback
---
Hover/focus hint (Radix Tooltip, zero delay). `Tooltip` already wraps its own `TooltipProvider`; `TooltipContent` is a small inverted (`bg-foreground text-background`) label with an arrow.

## Usage

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "trailblazer-ui";
import { RefreshCcw } from "lucide-react";

<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost" size="icon"><RefreshCcw /></Button></TooltipTrigger>
  <TooltipContent>สร้าง URL ใหม่</TooltipContent>
</Tooltip>
```

## Parts

- `TooltipTrigger` - the hovered element (`asChild`)
- `TooltipContent` - the bubble
- `TooltipProvider` - shared provider - only needed to tune `delayDuration` across many tooltips
