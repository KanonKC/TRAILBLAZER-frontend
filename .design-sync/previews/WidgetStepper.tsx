import * as React from "react";
import { WidgetStepper, WidgetEnableStep, WidgetStepperItem, WidgetStepperItems, OverlayUrlInput, Button } from "trailblazer-ui";

const url = "https://trailblazer.app/overlays/clip-shoutout/8f3a2c9e-1b7d-4e6a-9c2f-5d8b1a3e7f04";

export const QuickStart = () => (
  <div className="p-6 max-w-lg">
    <WidgetStepper>
      <WidgetEnableStep isEnabled isSaving={false} onEnable={() => {}} />
      <WidgetStepperItem step={2} title="นำ Overlay URL ไปใส่ใน OBS">
        <OverlayUrlInput url={url} hideLabel />
      </WidgetStepperItem>
      <WidgetStepperItem step={3} title="ทดสอบวิดเจ็ต" drawLine={false}>
        <Button size="sm" variant="outline">ส่ง shoutout ทดสอบ</Button>
      </WidgetStepperItem>
    </WidgetStepper>
  </div>
);

export const NotEnabledYet = () => (
  <div className="p-6 max-w-lg">
    <WidgetStepper>
      <WidgetEnableStep isEnabled={false} isSaving={false} onEnable={() => {}} />
    </WidgetStepper>
  </div>
);

export const FromItems = () => (
  <div className="p-6 max-w-lg">
    <WidgetStepper>
      <WidgetStepperItems items={[
        { step: 1, title: "เชื่อมต่อ Spotify", description: <p className="text-muted-foreground">ล็อกอินด้วยบัญชี Spotify Premium</p> },
        { step: 2, title: "เลือก Channel Reward", description: <p className="text-muted-foreground">ผู้ชม redeem เพื่อขอเพลง</p> },
        { step: 3, title: "เปิดใช้งาน", description: <p className="text-muted-foreground">บอทจะเริ่มรับคำขอทันที</p> },
      ]} />
    </WidgetStepper>
  </div>
);
