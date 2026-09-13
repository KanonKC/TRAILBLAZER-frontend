---
category: Forms
---
Text input (36px, `border-input`, translucent `bg-input/30` on dark). Pair with `Label` (or wrap in `Field`). `aria-invalid` turns the ring red. `type="password"` + `readOnly` is how overlay URLs are masked (see `OverlayUrlInput`).

## Usage

```tsx
import { Input, Label } from "trailblazer-ui";

<div className="grid gap-2 max-w-sm">
  <Label htmlFor="ch">ชื่อช่อง Twitch</Label>
  <Input id="ch" placeholder="mrjeremy" />
  <Input type="number" defaultValue={3000} aria-invalid />
  <Input disabled placeholder="Disabled" />
</div>
```
