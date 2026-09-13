---
category: Layout
---
1px divider (`bg-border`), horizontal by default; `orientation="vertical"` for inline dividers (needs a height from its container).

## Usage

```tsx
import { Separator } from "trailblazer-ui";

<div>
  <p className="text-sm">Clip Shoutout</p>
  <Separator className="my-3" />
  <div className="flex h-5 items-center gap-3 text-sm"><span>Overlay</span><Separator orientation="vertical" /><span>Chat</span></div>
</div>
```
