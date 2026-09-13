---
category: Overlays
---
`PopoverDescription` is part of the **Popover** family - muted text. Render it inside the `Popover` composition; it has no standalone use.

## Usage (family composition)

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

See `Popover.prompt.md` for the family overview.
