import * as React from "react";
import { RadioGroup, RadioGroupItem, Label } from "trailblazer-ui";

export const Basic = () => (
  <div className="p-6">
    <p className="text-sm font-medium mb-3">แสดงผลที่</p>
    <RadioGroup defaultValue="overlay" className="gap-3">
      <div className="flex items-center gap-2"><RadioGroupItem value="overlay" id="rg1" /><Label htmlFor="rg1">Overlay บนหน้าจอ</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="chat" id="rg2" /><Label htmlFor="rg2">ตอบในแชท</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="both" id="rg3" /><Label htmlFor="rg3">ทั้งสองอย่าง</Label></div>
    </RadioGroup>
  </div>
);

export const Disabled = () => (
  <div className="p-6">
    <RadioGroup defaultValue="free" className="gap-3">
      <div className="flex items-center gap-2"><RadioGroupItem value="free" id="rg4" /><Label htmlFor="rg4">Free</Label></div>
      <div className="flex items-center gap-2"><RadioGroupItem value="pro" id="rg5" disabled /><Label htmlFor="rg5" className="opacity-50">Pro (ต้องอัปเกรด)</Label></div>
    </RadioGroup>
  </div>
);
