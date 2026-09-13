---
category: App
---
One numbered step in a vertical setup guide: a circle with the step number, a bold title, and a description block; `drawConnector` draws the vertical line to the next step. Stack several in a column. (`WidgetStepper` + `WidgetStepperItem` is the newer equivalent.)

## Usage

```tsx
import { MultiStepProgressBar } from "trailblazer-ui";

<div>
  <MultiStepProgressBar drawConnector data={{ step: 1, title: "เปิดใช้งานวิดเจ็ต", description: <p className="text-muted-foreground">กดปุ่มเปิดใช้งานด้านล่าง</p> }} />
  <MultiStepProgressBar data={{ step: 2, title: "นำ URL ไปใส่ใน OBS", description: <p className="text-muted-foreground">Sources › Browser</p> }} />
</div>
```
