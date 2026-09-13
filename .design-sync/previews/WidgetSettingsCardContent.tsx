import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, WidgetSettingsCardContent, WidgetSettingsCardFooter, WidgetTestControl, DeleteWidgetButton, Label, Input, SubLabel, MSDelaySlider } from "trailblazer-ui";

export const SettingsCard = () => (
  <div className="p-6 max-w-lg">
    <Card>
      <CardHeader>
        <CardTitle>ตั้งค่า Clip Shoutout</CardTitle>
        <CardDescription>ปรับระยะเวลา เสียง และการหน่วงเวลา</CardDescription>
      </CardHeader>
      <WidgetSettingsCardContent>
        <div className="grid gap-2">
          <Label htmlFor="ws-dur">ระยะเวลาคลิป (วินาที)</Label>
          <Input id="ws-dur" type="number" defaultValue={30} />
          <SubLabel>คลิปจะถูกตัดเมื่อครบเวลา</SubLabel>
        </div>
        <div className="grid gap-2">
          <Label>หน่วงเวลาก่อนเล่น</Label>
          <MSDelaySlider value={2000} onChange={() => {}} />
        </div>
      </WidgetSettingsCardContent>
      <WidgetSettingsCardFooter>
        <WidgetTestControl isSaving={false} isTesting={false} canTest onSave={() => {}} onTest={() => {}} />
        <DeleteWidgetButton onDelete={() => {}} isLoading={false} />
      </WidgetSettingsCardFooter>
    </Card>
  </div>
);
