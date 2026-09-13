---
category: Feedback
---
Pulsing placeholder block (`bg-accent`, rounded). Size it with width/height classes to mirror the content it stands in for.

## Usage

```tsx
import { Skeleton } from "trailblazer-ui";

<div className="flex items-center gap-4">
  <Skeleton className="size-12 rounded-full" />
  <div className="grid gap-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-32" /></div>
</div>
```
