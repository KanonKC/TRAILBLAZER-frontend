---
category: Widgets
---
`CardFooter` with a top border and `justify-between` - holds the save/test controls of a widget settings card.

## Usage

```tsx
import { Card, CardHeader, CardTitle, WidgetSettingsCardContent, WidgetSettingsCardFooter, WidgetTestControl } from "trailblazer-ui";

<Card>
  <CardHeader><CardTitle>ตั้งค่า</CardTitle></CardHeader>
  <WidgetSettingsCardContent>{/* fields */}</WidgetSettingsCardContent>
  <WidgetSettingsCardFooter><WidgetTestControl … /></WidgetSettingsCardFooter>
</Card>
```
