import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardDescription, CardContent } from "trailblazer-ui";

export const WidgetTabs = () => (
  <div className="p-6">
    <Tabs defaultValue="settings" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
        <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
        <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>ตั้งค่า Clip Shoutout</CardTitle>
            <CardDescription>ปรับระยะเวลา เสียง และข้อความในแชท</CardDescription>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">เนื้อหาแท็บตั้งค่า</p></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export const LineVariant = () => (
  <div className="p-6">
    <Tabs defaultValue="audio" className="w-full max-w-lg">
      <TabsList variant="line">
        <TabsTrigger value="audio">เสียง</TabsTrigger>
        <TabsTrigger value="image">รูปภาพ</TabsTrigger>
        <TabsTrigger value="text" disabled>ข้อความ</TabsTrigger>
      </TabsList>
      <TabsContent value="audio" className="pt-3"><p className="text-sm text-muted-foreground">ไฟล์เสียงที่ใช้เมื่อมี raid</p></TabsContent>
    </Tabs>
  </div>
);

export const Vertical = () => (
  <div className="p-6">
    <Tabs defaultValue="clip" orientation="vertical" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="clip">Clip Shoutout</TabsTrigger>
        <TabsTrigger value="killer">Random Killer</TabsTrigger>
        <TabsTrigger value="song">Song Request</TabsTrigger>
      </TabsList>
      <TabsContent value="clip" className="pl-4"><p className="text-sm text-muted-foreground">เล่นคลิปของสตรีมเมอร์ที่ถูก shoutout</p></TabsContent>
    </Tabs>
  </div>
);
