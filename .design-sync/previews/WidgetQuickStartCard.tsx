import * as React from "react";
import { WidgetQuickStartCard, WidgetStepper, WidgetEnableStep, WidgetStepperItem, OverlayUrlInput } from "trailblazer-ui";

export const WithStepper = () => (
  <div className="p-6 max-w-lg">
    <WidgetQuickStartCard>
      <WidgetStepper>
        <WidgetEnableStep isEnabled={false} isSaving={false} onEnable={() => {}} />
        <WidgetStepperItem step={2} title="นำ Overlay URL ไปใส่ใน OBS" drawLine={false}>
          <OverlayUrlInput url="https://trailblazer.app/overlays/clip-shoutout/8f3a2c9e" hideLabel disabled />
        </WidgetStepperItem>
      </WidgetStepper>
    </WidgetQuickStartCard>
  </div>
);
