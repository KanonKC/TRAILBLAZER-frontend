---
category: Layout
---
Custom-scrollbar container (Radix ScrollArea). Give it a fixed height/width; `ScrollBar orientation="horizontal"` adds a horizontal bar.

## Usage

```tsx
import { ScrollArea } from "trailblazer-ui";

<ScrollArea className="h-48 w-64 rounded-md border p-3">
  {files.map((f) => <div key={f} className="py-1 text-sm">{f}</div>)}
</ScrollArea>
```

## Parts

- `ScrollBar` - the scrollbar track/thumb (`orientation`); rendered automatically for vertical
