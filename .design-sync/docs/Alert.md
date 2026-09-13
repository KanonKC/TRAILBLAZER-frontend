---
category: Feedback
---
Inline callout (`bg-card`, rounded, bordered). Put a lucide icon as the first child to get the icon column; `variant="destructive"` colours text red. `AlertAction` pins a button to the top-right.

## Usage

```tsx
import { Alert, AlertTitle, AlertDescription, AlertAction, Button } from "trailblazer-ui";
import { TriangleAlert } from "lucide-react";

<Alert variant="destructive">
  <TriangleAlert />
  <AlertTitle>โควต้าใกล้เต็ม</AlertTitle>
  <AlertDescription>คุณใช้พื้นที่อัปโหลดไปแล้ว 95% - ลบไฟล์เก่าหรืออัปเกรดเป็น Pro</AlertDescription>
  <AlertAction><Button size="xs" variant="outline">อัปเกรด</Button></AlertAction>
</Alert>
```

## Parts

- `AlertTitle` - bold first line
- `AlertDescription` - muted body text (links underline on hover)
- `AlertAction` - absolute top-right action slot
