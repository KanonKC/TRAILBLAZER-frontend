---
category: Widgets
---
`WidgetStepperItems` is part of the **WidgetStepper** family - renders a `WidgetStep[]` (`{step,title,description}`) as items. Render it inside the `WidgetStepper` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { WidgetStepper, WidgetEnableStep, WidgetStepperItem, OverlayUrlInput } from "trailblazer-ui";

<WidgetStepper>
  <WidgetEnableStep isEnabled isSaving={false} onEnable={() => {}} />
  <WidgetStepperItem step={2} title="นำ Overlay URL ไปใส่ใน OBS" drawLine={false}>
    <OverlayUrlInput url="https://trailblazer.app/overlays/…" hideLabel />
  </WidgetStepperItem>
</WidgetStepper>
```

See `WidgetStepper.prompt.md` for the family overview.
