---
category: Forms
---
16px checkbox (Radix). Checked state fills with the orange primary. Pair with `Label` via `id`/`htmlFor`; control with `checked` / `onCheckedChange`.

## Usage

```tsx
import { Checkbox, Label } from "trailblazer-ui";

<div className="flex items-center gap-2">
  <Checkbox id="notify" defaultChecked />
  <Label htmlFor="notify">แจ้งเตือนเมื่อมี raid</Label>
</div>
```
