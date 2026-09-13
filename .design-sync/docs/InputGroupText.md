---
category: Forms
---
`InputGroupText` is part of the **InputGroup** family - muted inline text (units, prefixes). Render it inside the `InputGroup` composition; it has no standalone use.

## Usage (family composition)

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

See `InputGroup.prompt.md` for the family overview.
