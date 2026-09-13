import * as React from "react";
import { Input, Label } from "trailblazer-ui";

export const Basic = () => (
  <div className="grid gap-2 max-w-sm p-6">
    <Label htmlFor="in-ch">ชื่อช่อง Twitch</Label>
    <Input id="in-ch" placeholder="mrjeremy" />
  </div>
);

export const Types = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <Input type="number" defaultValue={3000} />
    <Input type="password" defaultValue="supersecret-overlay-token" readOnly />
    <Input type="email" placeholder="you@example.com" />
    <Input type="file" />
  </div>
);

export const States = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <Input defaultValue="140" aria-invalid />
    <Input disabled placeholder="ปิดใช้งาน" />
    <Input readOnly value="https://trailblazer.app/overlays/abc123" className="font-mono text-sm" />
  </div>
);
