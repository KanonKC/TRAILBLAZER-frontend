---
category: Overlays
---
Anchored floating panel (Radix Popover) for small settings, colour pickers, or help text. `PopoverContent` is a 288px `bg-popover` card; `PopoverHeader`/`PopoverTitle`/`PopoverDescription` give it a titled layout.

## Usage

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, Button, Label, Input } from "trailblazer-ui";

<Popover>
  <PopoverTrigger asChild><Button variant="outline">ตั้งค่าเสียง</Button></PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>ระดับเสียง</PopoverTitle>
      <PopoverDescription>ใช้กับทุกคลิปที่เล่น</PopoverDescription>
    </PopoverHeader>
    <div className="grid gap-2 mt-3">
      <Label htmlFor="vol">Volume</Label>
      <Input id="vol" type="number" defaultValue={80} />
    </div>
  </PopoverContent>
</Popover>
```

## Parts

- `PopoverTrigger` - toggles the popover
- `PopoverContent` - the floating panel (portal + positioning built in)
- `PopoverAnchor` - optional custom anchor element
- `PopoverHeader` - title/description stack
- `PopoverTitle` - heading
- `PopoverDescription` - muted text
