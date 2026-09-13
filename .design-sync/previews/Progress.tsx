import * as React from "react";
import { Progress } from "trailblazer-ui";

export const Quota = () => (
  <div className="grid gap-2 w-96 p-6">
    <div className="flex justify-between text-sm"><span>พื้นที่อัปโหลด</span><span className="text-muted-foreground">42 / 100 MB</span></div>
    <Progress value={42} />
  </div>
);

export const Levels = () => (
  <div className="grid gap-4 w-96 p-6">
    <Progress value={0} />
    <Progress value={25} />
    <Progress value={75} />
    <Progress value={100} />
  </div>
);
