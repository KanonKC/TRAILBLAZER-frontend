---
category: Widgets
---
Masked overlay-URL field: click to copy, eye button reveals after an `AlertDialog` warning, optional refresh button (`showRefresh` + `onRefresh`). `hideLabel` drops the label + hint.

## Usage

```tsx
import { OverlayUrlInput } from "trailblazer-ui";

<OverlayUrlInput url="https://trailblazer.app/overlays/clip-shoutout/abc123" showRefresh onRefresh={() => {}} />
```
