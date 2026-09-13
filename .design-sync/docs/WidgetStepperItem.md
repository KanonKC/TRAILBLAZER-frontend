---
category: Widgets
---
`WidgetStepperItem` is part of the **WidgetStepper** family - one numbered step (`step`, `title`, `drawLine`). Render it inside the `WidgetStepper` composition; it has no standalone use.

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
