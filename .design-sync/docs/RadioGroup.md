---
category: Forms
---
Single-choice set (Radix RadioGroup). Each `RadioGroupItem` needs a `value`; render a `Label` next to it. Control with `value` / `onValueChange`.

## Usage

```tsx
import { RadioGroup, RadioGroupItem, Label } from "trailblazer-ui";

<RadioGroup defaultValue="overlay" className="gap-3">
  <div className="flex items-center gap-2"><RadioGroupItem value="overlay" id="r1" /><Label htmlFor="r1">Overlay</Label></div>
  <div className="flex items-center gap-2"><RadioGroupItem value="chat" id="r2" /><Label htmlFor="r2">ตอบในแชท</Label></div>
</RadioGroup>
```

## Parts

- `RadioGroupItem` - one radio (`value`, `disabled`)
