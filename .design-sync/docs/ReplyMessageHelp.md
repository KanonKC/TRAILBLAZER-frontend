---
category: Widgets
---
Collapsible list of chat-message variables; each row shows a description, an example, and a clickable `{variable}` chip that calls `onInsertVariable`.

## Usage

```tsx
import { ReplyMessageHelp } from "trailblazer-ui";

const variables = [
  { variable: "{user}", description: "ชื่อผู้ชมที่ทริกเกอร์", example: "MrJeremy" },
  { variable: "{amount}", description: "จำนวน bits", example: "500" },
];

<ReplyMessageHelp variables={variables} defaultOpen onInsertVariable={(v) => console.log(v)} />
```
