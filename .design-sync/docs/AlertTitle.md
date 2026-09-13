---
category: Feedback
---
`AlertTitle` is part of the **Alert** family - bold first line. Render it inside the `Alert` composition; it has no standalone use.

## Usage (family composition)

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

See `Alert.prompt.md` for the family overview.
