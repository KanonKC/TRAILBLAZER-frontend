import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, Button, Label, Input } from "trailblazer-ui";

export const SettingsOpen = () => (
  <div className="p-6 min-h-80">
    <Popover open>
      <PopoverTrigger asChild><Button variant="outline">ตั้งค่าเสียง</Button></PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>ระดับเสียง</PopoverTitle>
          <PopoverDescription>ใช้กับทุกคลิปที่เล่นบน overlay</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2 mt-3">
          <Label htmlFor="pv-vol">Volume (%)</Label>
          <Input id="pv-vol" type="number" defaultValue={80} />
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export const Closed = () => (
  <div className="p-6">
    <Popover>
      <PopoverTrigger asChild><Button variant="ghost" size="sm">ช่วยเหลือ</Button></PopoverTrigger>
      <PopoverContent>คลิกที่ช่องเพื่อคัดลอก URL</PopoverContent>
    </Popover>
  </div>
);
