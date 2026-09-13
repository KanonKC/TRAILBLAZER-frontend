---
category: Forms
---
Form label (`text-sm font-medium`, flex row so an icon can sit beside the text). Dims automatically when its peer control is disabled.

## Usage

```tsx
import { Label, Checkbox } from "trailblazer-ui";

<div className="flex items-center gap-2">
  <Checkbox id="tos" />
  <Label htmlFor="tos">ยอมรับข้อกำหนดการใช้งาน</Label>
</div>
```
