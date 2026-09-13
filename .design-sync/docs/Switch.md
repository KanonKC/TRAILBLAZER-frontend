---
category: Forms
---
On/off toggle (Radix Switch, 24x44px, orange when on). `checked` / `onCheckedChange`; `disabled` dims it. The app uses it for enabling widgets (`WidgetStatusSwitch`).

## Usage

```tsx
import { Switch, Label } from "trailblazer-ui";

<div className="flex items-center gap-3">
  <Switch id="enabled" defaultChecked />
  <Label htmlFor="enabled">เปิดใช้งานวิดเจ็ต</Label>
</div>
```
