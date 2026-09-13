---
category: Layout
---
`CardTitle` is part of the **Card** family - heading text (`text-base font-medium`). Render it inside the `Card` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, Button, Badge } from "trailblazer-ui";

<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Clip Shoutout</CardTitle>
    <CardDescription>เล่นคลิปของสตรีมเมอร์ที่ถูก shoutout บนหน้าจอ</CardDescription>
    <CardAction><Badge variant="secondary">Pro</Badge></CardAction>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">ตั้งค่าเสียง ระยะเวลา และรูปแบบการแสดงผล</p>
  </CardContent>
  <CardFooter className="border-t">
    <Button>บันทึกการเปลี่ยนแปลง</Button>
  </CardFooter>
</Card>
```

See `Card.prompt.md` for the family overview.
