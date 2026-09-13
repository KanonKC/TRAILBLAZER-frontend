import * as React from "react";
import { MultiStepProgressBar, Button } from "trailblazer-ui";

export const SetupGuide = () => (
  <div className="p-6 max-w-md">
    <MultiStepProgressBar drawConnector data={{ step: 1, title: "เปิดใช้งานวิดเจ็ต", description: <p className="text-muted-foreground">กดปุ่มเปิดใช้งานเพื่อสร้าง Overlay URL ของคุณ</p> }} />
    <MultiStepProgressBar drawConnector data={{ step: 2, title: "นำ URL ไปใส่ใน OBS", description: <p className="text-muted-foreground">Sources › Add Source › Browser แล้ววาง URL</p> }} />
    <MultiStepProgressBar data={{ step: 3, title: "ทดสอบ", description: <Button size="sm" variant="outline">ส่งข้อความทดสอบ</Button> }} />
  </div>
);

export const SingleStep = () => (
  <div className="p-6 max-w-md">
    <MultiStepProgressBar data={{ step: 1, title: "เชื่อมต่อ Spotify", description: <p className="text-muted-foreground">ล็อกอินด้วยบัญชี Spotify Premium</p> }} />
  </div>
);
