---
category: Layout
---
`ScrollBar` is part of the **ScrollArea** family - the scrollbar track/thumb (`orientation`); rendered automatically for vertical. Render it inside the `ScrollArea` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { ScrollArea } from "trailblazer-ui";

<ScrollArea className="h-48 w-64 rounded-md border p-3">
  {files.map((f) => <div key={f} className="py-1 text-sm">{f}</div>)}
</ScrollArea>
```

See `ScrollArea.prompt.md` for the family overview.
