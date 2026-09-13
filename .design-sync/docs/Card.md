---
category: Layout
---
Surface container (`bg-card`, 1px ring, `rounded-xl`, 24px vertical padding). Compose with `CardHeader` (`CardTitle` + `CardDescription`, optional `CardAction` pinned top-right), `CardContent`, and `CardFooter`. `size="sm"` tightens padding to 16px. The landing page adds the `glass` utility for translucent cards.

## Usage

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

Add `className="border-t"` on `CardFooter` (or `border-b` on `CardHeader`) to get the divider with matching padding. An `<img>` as the first child bleeds to the top edge (use `className="pt-0"` on the Card).

## Parts

- `CardHeader` - top block; becomes a 2-column grid when a `CardAction` is present
- `CardTitle` - heading text (`text-base font-medium`)
- `CardDescription` - muted secondary line under the title
- `CardAction` - slot pinned to the header's top-right (badge, menu button)
- `CardContent` - body with horizontal padding only
- `CardFooter` - bottom row (`flex items-center`); add `border-t` for a divider
