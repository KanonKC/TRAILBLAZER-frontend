import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter, Button, Badge } from "trailblazer-ui";
import { Zap } from "lucide-react";

export const WidgetCard = () => (
  <div className="p-6">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Clip Shoutout</CardTitle>
        <CardDescription>เล่นคลิปของสตรีมเมอร์ที่ถูก shoutout บนหน้าจอสตรีมของคุณโดยอัตโนมัติ</CardDescription>
        <CardAction><Badge variant="secondary">Pro</Badge></CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          ตั้งค่าเสียง ระยะเวลาการเล่น และรูปแบบการแสดงผลของคลิปได้จากหน้าตั้งค่า
          ระบบจะดึงคลิปยอดนิยมล่าสุดของช่องที่ถูก shoutout มาเล่นทันที
        </p>
      </CardContent>
      <CardFooter className="border-t gap-2">
        <Button>บันทึกการเปลี่ยนแปลง</Button>
        <Button variant="ghost">ยกเลิก</Button>
      </CardFooter>
    </Card>
  </div>
);

export const SmallSize = () => (
  <div className="p-6">
    <Card size="sm" className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>ยอดผู้ติดตามวันนี้</CardTitle>
        <CardDescription>อัปเดตทุก 5 นาที</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">+128</p>
      </CardContent>
    </Card>
  </div>
);

export const FeatureGlass = () => (
  <div className="p-6">
    <Card className="glass border-primary/10 w-full max-w-sm">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl trailblazer-gradient flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl">รวดเร็วทันใจ</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">การเชื่อมต่อแบบเรียลไทม์พร้อมการตอบสนองทันทีสำหรับอีเวนต์ Twitch ของคุณ</p>
      </CardContent>
    </Card>
  </div>
);

export const WithImage = () => (
  <div className="p-6">
    <Card className="w-full max-w-sm pt-0 overflow-hidden">
      <div className="aspect-video w-full trailblazer-gradient" />
      <CardHeader>
        <CardTitle>Random DBD Killer</CardTitle>
        <CardDescription>สุ่มคิลเลอร์ให้ผู้ชมเมื่อมีการ redeem channel points</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm">เปิดใช้งาน</Button>
        <Badge className="ml-auto">ใหม่</Badge>
      </CardFooter>
    </Card>
  </div>
);
