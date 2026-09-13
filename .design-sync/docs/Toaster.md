---
category: Feedback
---
Toast host (Sonner), themed to the popover tokens. Render one `<Toaster />` at the root of the page; fire toasts with `toast` or the app helper `tbToast` - both exported from this package (`window.Trailblazer.toast` / `.tbToast`), and both bound to the same sonner instance the Toaster listens to. Bottom-right by default.

## Usage

```tsx
import { Toaster, toast, tbToast } from "trailblazer-ui";

<>
  <Toaster />
  <Button onClick={() => tbToast.success({ title: "บันทึกการเปลี่ยนแปลงแล้ว", description: "การตั้งค่าใหม่มีผลทันที" })}>บันทึก</Button>
  <Button variant="outline" onClick={() => toast.error("อัปโหลดไม่สำเร็จ")}>ทดสอบ error</Button>
</>
```
