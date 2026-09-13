import * as React from "react";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "trailblazer-ui";
import { Copy, RefreshCcw, Send, Eye } from "lucide-react";

export const Sizes = () => (
  <div className="grid gap-3 max-w-sm p-6">
    <InputGroup>
      <InputGroupInput readOnly value="https://trailblazer.app/overlays/…" className="font-mono text-xs" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Reveal"><Eye /></InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Refresh"><RefreshCcw /></InputGroupButton>
        <InputGroupButton size="icon-sm" aria-label="Copy"><Copy /></InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput placeholder="พิมพ์ข้อความ…" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs" variant="outline">ล้าง</InputGroupButton>
        <InputGroupButton size="sm" variant="default"><Send /> ส่ง</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
);
