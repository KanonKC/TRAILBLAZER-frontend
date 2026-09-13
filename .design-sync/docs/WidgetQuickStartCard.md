---
category: Widgets
---
Borderless card headed `▶ Quick Start` / `เริ่มต้นใช้งานได้ในไม่กี่นาที`; children (usually a `WidgetStepper`) go in the content.

## Usage

```tsx
import { WidgetQuickStartCard, WidgetStepper, WidgetEnableStep } from "trailblazer-ui";

<WidgetQuickStartCard>
  <WidgetStepper><WidgetEnableStep isEnabled={false} isSaving={false} onEnable={() => {}} /></WidgetStepper>
</WidgetQuickStartCard>
```
