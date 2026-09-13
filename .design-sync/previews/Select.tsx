import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator, Label } from "trailblazer-ui";

export const BotProfileOpen = () => (
  <div className="p-6 min-h-96 grid gap-2 content-start">
    <Label>โปรไฟล์บอท</Label>
    <Select defaultValue="default" open>
      <SelectTrigger className="w-72"><SelectValue placeholder="เลือกโปรไฟล์" /></SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>บอท</SelectLabel>
          <SelectItem value="default">MrJeremyBot (บอทชั่วคราว)</SelectItem>
          <SelectItem value="self">ใช้บัญชีของตัวเอง</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>อื่นๆ</SelectLabel>
          <SelectItem value="custom" disabled>บอทกำหนดเอง (Pro)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export const Closed = () => (
  <div className="p-6 flex flex-wrap gap-4 items-end">
    <div className="grid gap-2">
      <Label>ระยะเวลา</Label>
      <Select defaultValue="30">
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="15">15 วินาที</SelectItem>
          <SelectItem value="30">30 วินาที</SelectItem>
          <SelectItem value="60">60 วินาที</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Select>
      <SelectTrigger size="sm" className="w-40"><SelectValue placeholder="ขนาดเล็ก (sm)" /></SelectTrigger>
      <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
    </Select>
    <Select disabled>
      <SelectTrigger className="w-40"><SelectValue placeholder="ปิดใช้งาน" /></SelectTrigger>
      <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
    </Select>
  </div>
);
