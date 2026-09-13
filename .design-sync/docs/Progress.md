---
category: Feedback
---
Horizontal progress bar (Radix Progress). `value` 0-100; orange indicator on a muted track. Used for upload quota (`QuotaMeter`).

## Usage

```tsx
import { Progress } from "trailblazer-ui";

<div className="grid gap-2 w-80">
  <div className="flex justify-between text-sm"><span>พื้นที่อัปโหลด</span><span className="text-muted-foreground">42 / 100 MB</span></div>
  <Progress value={42} />
</div>
```
