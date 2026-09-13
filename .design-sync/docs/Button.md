---
category: Actions
---
The app's button. `variant="default"` is a **white pill on the dark surface** (not orange) - use it for the primary action of a card or form. `outline`/`ghost` are quieter, `destructive` is a red-tinted delete, `link` is text-only, `twitch` is the purple Twitch-branded login button. Put an icon before or after the label with `data-icon="inline-start"` / `"inline-end"` on the svg so padding tightens.

## Usage

```tsx
import { Button } from "trailblazer-ui";
import { Play, Trash } from "lucide-react";

<div className="flex flex-wrap gap-2">
  <Button>บันทึกการเปลี่ยนแปลง</Button>
  <Button variant="outline"><Play data-icon="inline-start" /> Test</Button>
  <Button variant="secondary">ยกเลิก</Button>
  <Button variant="ghost" size="sm">ดูเพิ่มเติม</Button>
  <Button variant="destructive"><Trash data-icon="inline-start" /> ลบวิดเจ็ต</Button>
  <Button variant="twitch">Login with Twitch</Button>
  <Button size="icon" aria-label="Settings"><Settings /></Button>
</div>
```

Sizes: `xs` `sm` `default` `lg` and square `icon` `icon-xs` `icon-sm` `icon-lg`. `asChild` renders the child element (e.g. an `<a>`) with button styling. Loading state is just `disabled` + a changed label (see `SaveWidgetButton`).
