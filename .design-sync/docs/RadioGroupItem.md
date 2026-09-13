---
category: Forms
---
`RadioGroupItem` is part of the **RadioGroup** family - one radio (`value`, `disabled`). Render it inside the `RadioGroup` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { RadioGroup, RadioGroupItem, Label } from "trailblazer-ui";

<RadioGroup defaultValue="overlay" className="gap-3">
  <div className="flex items-center gap-2"><RadioGroupItem value="overlay" id="r1" /><Label htmlFor="r1">Overlay</Label></div>
  <div className="flex items-center gap-2"><RadioGroupItem value="chat" id="r2" /><Label htmlFor="r2">ตอบในแชท</Label></div>
</RadioGroup>
```

See `RadioGroup.prompt.md` for the family overview.
