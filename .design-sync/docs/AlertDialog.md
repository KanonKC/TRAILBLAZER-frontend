---
category: Overlays
---
Confirmation modal (Radix AlertDialog) - used for destructive or sensitive confirmations (delete widget, reveal overlay URL). `AlertDialogAction` / `AlertDialogCancel` are Buttons (`variant` prop works). `AlertDialogMedia` is an optional 64px icon tile. `size="sm"` on the content centres everything and lays the footer buttons out in two columns.

## Usage

```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Button } from "trailblazer-ui";

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">ลบวิดเจ็ต</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>คุณต้องการลบวิดเจ็ตนี้หรือไม่?</AlertDialogTitle>
      <AlertDialogDescription>การลบวิดเจ็ตจะทำให้การตั้งค่าทั้งหมดหายไป</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
      <AlertDialogAction variant="destructive">ยืนยันการลบ</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Control it with `open` / `onOpenChange` when the trigger lives elsewhere (see `OverlayUrlInput`).

## Parts

- `AlertDialogTrigger` - opens the dialog (`asChild` to use a Button)
- `AlertDialogContent` - the centred panel; renders the overlay and portal for you
- `AlertDialogHeader` - title/description stack (centred in `size="sm"`)
- `AlertDialogTitle` - heading
- `AlertDialogDescription` - muted body
- `AlertDialogMedia` - 64px muted icon tile above the title
- `AlertDialogFooter` - button row (stacked on mobile)
- `AlertDialogAction` - confirm Button (default variant)
- `AlertDialogCancel` - cancel Button (outline variant)
- `AlertDialogOverlay` - backdrop (already included by AlertDialogContent)
- `AlertDialogPortal` - portal (already included by AlertDialogContent)
