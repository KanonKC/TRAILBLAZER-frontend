---
category: Feedback
---
`TooltipTrigger` is part of the **Tooltip** family - the hovered element (`asChild`). Render it inside the `Tooltip` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "trailblazer-ui";
import { RefreshCcw } from "lucide-react";

<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost" size="icon"><RefreshCcw /></Button></TooltipTrigger>
  <TooltipContent>สร้าง URL ใหม่</TooltipContent>
</Tooltip>
```

See `Tooltip.prompt.md` for the family overview.
