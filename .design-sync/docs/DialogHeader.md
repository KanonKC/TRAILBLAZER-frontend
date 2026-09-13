---
category: Overlays
---
`DialogHeader` is part of the **Dialog** family - title/description stack. Render it inside the `Dialog` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button, Input, Label } from "trailblazer-ui";

<Dialog>
  <DialogTrigger asChild><Button variant="outline">แก้ไขชื่อ</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>แก้ไขชื่อที่แสดง</DialogTitle>
      <DialogDescription>ชื่อนี้จะแสดงบนหน้าจอสตรีมของคุณ</DialogDescription>
    </DialogHeader>
    <div className="grid gap-2">
      <Label htmlFor="name">ชื่อ</Label>
      <Input id="name" defaultValue="MrJeremy" />
    </div>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">ยกเลิก</Button></DialogClose>
      <Button>บันทึก</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

See `Dialog.prompt.md` for the family overview.
