---
category: Data display
---
Small status pill. `default` is the orange brand primary, `secondary` grey, `destructive` red-tinted, `outline` bordered, `ghost`/`link` minimal. Height is fixed (20px) - keep the label to a word or two; an icon child is auto-sized.

## Usage

```tsx
import { Badge } from "trailblazer-ui";

<div className="flex gap-2">
  <Badge>Pro</Badge>
  <Badge variant="secondary">Free</Badge>
  <Badge variant="outline">Beta</Badge>
  <Badge variant="destructive">หมดอายุ</Badge>
</div>
```
