---
category: Forms
---
An Input/Textarea with attached addons: icons, text units, or small buttons on either side (`align="inline-start"`/`"inline-end"`) or above/below (`"block-start"`/`"block-end"`). The group carries the border/focus ring; the control inside is borderless.

## Usage

```tsx
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText, InputGroupButton } from "trailblazer-ui";
import { Search, Copy } from "lucide-react";

<div className="grid gap-3 max-w-sm">
  <InputGroup>
    <InputGroupAddon><Search /></InputGroupAddon>
    <InputGroupInput placeholder="ค้นหาคลิป..." />
  </InputGroup>
  <InputGroup>
    <InputGroupInput type="number" defaultValue={3000} />
    <InputGroupAddon align="inline-end"><InputGroupText>ms</InputGroupText></InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput readOnly value="https://trailblazer.app/overlay/…" />
    <InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs"><Copy /></InputGroupButton></InputGroupAddon>
  </InputGroup>
</div>
```

## Parts

- `InputGroupInput` - the borderless Input inside the group
- `InputGroupTextarea` - the borderless Textarea inside the group
- `InputGroupAddon` - slot for icon/text/button (`align`)
- `InputGroupText` - muted inline text (units, prefixes)
- `InputGroupButton` - compact ghost Button for addons (`size`: `xs` `sm` `icon-xs` `icon-sm`)
