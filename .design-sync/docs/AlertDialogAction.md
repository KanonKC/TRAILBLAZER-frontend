---
category: Overlays
---
`AlertDialogAction` is part of the **AlertDialog** family - confirm Button (default variant). Render it inside the `AlertDialog` composition; it has no standalone use.

## Usage (family composition)

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

See `AlertDialog.prompt.md` for the family overview.
