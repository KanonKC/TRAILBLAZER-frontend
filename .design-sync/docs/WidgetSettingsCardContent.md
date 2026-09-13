---
category: Widgets
---
`CardContent` with `space-y-8` - the body of a widget settings card. Pair with `WidgetSettingsCardFooter` inside a `Card`.

## Usage

```tsx
import { Card, CardHeader, CardTitle, WidgetSettingsCardContent, WidgetSettingsCardFooter, WidgetTestControl } from "trailblazer-ui";

<Card>
  <CardHeader><CardTitle>ตั้งค่า</CardTitle></CardHeader>
  <WidgetSettingsCardContent>{/* fields */}</WidgetSettingsCardContent>
  <WidgetSettingsCardFooter><WidgetTestControl … /></WidgetSettingsCardFooter>
</Card>
```
