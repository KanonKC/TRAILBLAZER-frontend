import * as React from "react";
import { Alert, AlertTitle, AlertDescription, AlertAction, Button } from "trailblazer-ui";
import { TriangleAlert, Info, CircleCheck } from "lucide-react";

export const Default = () => (
  <div className="p-6 max-w-lg grid gap-3">
    <Alert>
      <Info />
      <AlertTitle>เปิดใช้งานวิดเจ็ตแล้ว</AlertTitle>
      <AlertDescription>นำ Overlay URL ไปใส่ใน Browser Source ของ OBS เพื่อเริ่มใช้งาน</AlertDescription>
    </Alert>
    <Alert>
      <CircleCheck />
      <AlertTitle>บันทึกการเปลี่ยนแปลงแล้ว</AlertTitle>
    </Alert>
  </div>
);

export const Destructive = () => (
  <div className="p-6 max-w-lg">
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>โควต้าใกล้เต็ม</AlertTitle>
      <AlertDescription>คุณใช้พื้นที่อัปโหลดไปแล้ว 95% ลบไฟล์เก่าหรืออัปเกรดเป็น Pro เพื่อรับพื้นที่เพิ่ม</AlertDescription>
    </Alert>
  </div>
);

export const WithAction = () => (
  <div className="p-6 max-w-lg">
    <Alert>
      <TriangleAlert />
      <AlertTitle>ฟีเจอร์นี้ต้องใช้แพ็กเกจ Pro</AlertTitle>
      <AlertDescription>อัปเกรดเพื่อปลดล็อก Clip Shoutout และวิดเจ็ตอื่นๆ</AlertDescription>
      <AlertAction><Button size="xs" variant="outline">อัปเกรด</Button></AlertAction>
    </Alert>
  </div>
);
