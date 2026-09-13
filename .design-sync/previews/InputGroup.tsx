import * as React from "react";
import { InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupText, InputGroupButton } from "trailblazer-ui";
import { Search, Copy, Link2, Send } from "lucide-react";

export const Addons = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <InputGroup>
      <InputGroupAddon><Search /></InputGroupAddon>
      <InputGroupInput placeholder="ค้นหาคลิป..." />
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="number" defaultValue={3000} />
      <InputGroupAddon align="inline-end"><InputGroupText>ms</InputGroupText></InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
      <InputGroupInput placeholder="twitch.tv/mrjeremy" />
      <InputGroupAddon align="inline-end"><Link2 /></InputGroupAddon>
    </InputGroup>
  </div>
);

export const WithButtons = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <InputGroup>
      <InputGroupInput readOnly value="https://trailblazer.app/overlays/clip-shoutout/…" className="font-mono text-xs" />
      <InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Copy"><Copy /></InputGroupButton></InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="พิมพ์ข้อความ…" />
      <InputGroupAddon align="inline-end"><InputGroupButton variant="default" size="xs"><Send /> ส่ง</InputGroupButton></InputGroupAddon>
    </InputGroup>
  </div>
);

export const BlockAddons = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <InputGroup>
      <InputGroupTextarea placeholder="ขอบคุณ {user} สำหรับ {amount} bits!" rows={3} />
      <InputGroupAddon align="block-end" className="border-t justify-between">
        <InputGroupText>0/500</InputGroupText>
        <InputGroupButton size="xs" variant="outline">แทรกตัวแปร</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
);
