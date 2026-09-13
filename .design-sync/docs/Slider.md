---
category: Forms
---
Range slider (Radix Slider). `value`/`defaultValue` are arrays; set `min`, `max`, `step`. Orange range on a `bg-secondary` track. `MSDelaySlider` combines it with a ms input.

## Usage

```tsx
import { Slider } from "trailblazer-ui";

<div className="w-80">
  <Slider defaultValue={[3000]} max={15000} step={1000} />
  <div className="flex justify-between text-sm text-muted-foreground pt-1"><span>0s</span><span>15s</span></div>
</div>
```
