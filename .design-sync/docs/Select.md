---
category: Forms
---
Single-choice dropdown (Radix Select). `SelectTrigger` looks like an Input (`size="sm"` for 32px); `SelectContent` is a `bg-card` list; group items with `SelectGroup` + `SelectLabel`. Control with `value` / `onValueChange` on `Select`.

## Usage

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

## Parts

- `SelectTrigger` - the input-like button (`size`)
- `SelectValue` - renders the chosen label or `placeholder`
- `SelectContent` - the dropdown list (portal + scroll buttons built in)
- `SelectGroup` - groups items
- `SelectLabel` - muted group heading
- `SelectItem` - option (`value`, `disabled`)
- `SelectSeparator` - divider between groups
- `SelectScrollUpButton` - scroll affordance (already rendered by SelectContent)
- `SelectScrollDownButton` - scroll affordance (already rendered by SelectContent)
