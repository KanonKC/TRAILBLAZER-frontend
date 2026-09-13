---
category: Widgets
---
Millisecond delay picker: a Slider (0-`max`, `step`) beside a numeric `ms` input, both bound to `value` / `onChange(number)`.

## Usage

```tsx
import { MSDelaySlider } from "trailblazer-ui";

<MSDelaySlider value={3000} onChange={() => {}} max={15000} step={1000} />
```
