---
category: Overlays
---
General modal (Radix Dialog) with a built-in close (X) button. `DialogContent` is `max-w-lg`, `bg-background`, bordered. Use for forms and pickers (file uploader, referral, upgrade prompts); use `AlertDialog` for yes/no confirmations.

## Usage

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

## Parts

- `DialogTrigger` - opens the dialog (`asChild` to use a Button)
- `DialogContent` - centred panel with the X close button; includes overlay + portal
- `DialogHeader` - title/description stack
- `DialogTitle` - heading (`text-lg font-semibold`)
- `DialogDescription` - muted body
- `DialogFooter` - button row, right-aligned on desktop
- `DialogClose` - closes the dialog (`asChild` to wrap a Button)
- `DialogOverlay` - backdrop (already included by DialogContent)
- `DialogPortal` - portal (already included by DialogContent)
