---
category: Forms
---
Multi-line input (`min-h-16`, auto-sizes to content). Same border/ring treatment as `Input`. `ReplyMessageTextarea` wraps it with a character counter and variable helper.

## Usage

```tsx
import { Textarea, Label } from "trailblazer-ui";

<div className="grid gap-2 max-w-md">
  <Label htmlFor="msg">ข้อความตอบกลับ</Label>
  <Textarea id="msg" rows={3} placeholder="ขอบคุณ {user} สำหรับ {amount} bits!" />
</div>
```
