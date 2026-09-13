---
category: Widgets
---
Textarea for the bot's reply message with a `n/500` counter, optional `error`, and - when `variables` are given - a `ReplyMessageHelp` panel that inserts variables at the cursor. Controlled: `value` + `onChange(string)`.

## Usage

```tsx
import { ReplyMessageTextarea } from "trailblazer-ui";

<ReplyMessageTextarea value="ขอบคุณ {user} สำหรับ {amount} bits!" onChange={() => {}} variables={variables} placeholder="ข้อความตอบกลับ" />
```
