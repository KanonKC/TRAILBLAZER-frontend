---
category: Forms
---
`SelectSeparator` is part of the **Select** family - divider between groups. Render it inside the `Select` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator, Label } from "trailblazer-ui";

<div className="grid gap-2">
  <Label>โปรไฟล์บอท</Label>
  <Select defaultValue="default">
    <SelectTrigger className="w-64"><SelectValue placeholder="เลือกโปรไฟล์" /></SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>บอท</SelectLabel>
        <SelectItem value="default">MrJeremyBot (บอทชั่วคราว)</SelectItem>
        <SelectItem value="self">ใช้บัญชีของตัวเอง</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
```

See `Select.prompt.md` for the family overview.
