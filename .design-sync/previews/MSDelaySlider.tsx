import * as React from "react";
import { MSDelaySlider, Label } from "trailblazer-ui";

export const Default = () => (
  <div className="p-6 max-w-lg grid gap-2">
    <Label>หน่วงเวลาก่อนเล่น</Label>
    <MSDelaySlider value={3000} onChange={() => {}} />
  </div>
);

export const Controlled = () => {
  const [v, setV] = React.useState(7500);
  return (
    <div className="p-6 max-w-lg grid gap-2">
      <Label>หน่วงเวลา ({v / 1000}s)</Label>
      <MSDelaySlider value={v} onChange={setV} max={10000} step={500} />
    </div>
  );
};
