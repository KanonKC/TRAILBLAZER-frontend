import * as React from "react";
import { Slider } from "trailblazer-ui";

export const Delay = () => (
  <div className="p-6 w-96">
    <Slider defaultValue={[3000]} max={15000} step={1000} />
    <div className="flex justify-between text-sm text-muted-foreground pt-1"><span>0s</span><span>15s</span></div>
  </div>
);

export const Volume = () => (
  <div className="p-6 w-96 grid gap-2">
    <div className="flex justify-between text-sm"><span>ระดับเสียง</span><span className="text-muted-foreground">80%</span></div>
    <Slider defaultValue={[80]} max={100} step={5} />
  </div>
);
