---
category: Widgets
---
Vertical numbered setup guide. `WidgetStepper` is the column; each `WidgetStepperItem` (`step`, `title`, `drawLine`) renders a numbered circle + connector; `WidgetStepperItems` maps a `WidgetStep[]`; `WidgetEnableStep` is the standard step 1 with a `WidgetStatusControl`.

## Usage

```tsx
import { WidgetStepper, WidgetEnableStep, WidgetStepperItem, OverlayUrlInput } from "trailblazer-ui";

<WidgetStepper>
  <WidgetEnableStep isEnabled isSaving={false} onEnable={() => {}} />
  <WidgetStepperItem step={2} title="นำ Overlay URL ไปใส่ใน OBS" drawLine={false}>
    <OverlayUrlInput url="https://trailblazer.app/overlays/…" hideLabel />
  </WidgetStepperItem>
</WidgetStepper>
```

## Parts

- `WidgetStepperItem` - one numbered step (`step`, `title`, `drawLine`)
- `WidgetStepperItems` - renders a `WidgetStep[]` (`{step,title,description}`) as items
- `WidgetEnableStep` - step 1 preset: `เปิดใช้งานวิดเจ็ต` + `WidgetStatusControl`
