---
category: Widgets
---
Muted error message for a widget page that failed to load (`reason`: `fetch-failed` | `not-found`, `slug` is named in the not-found text).

## Usage

```tsx
import { WidgetTypeLoadError } from "trailblazer-ui";

<WidgetTypeLoadError slug="clip-shoutout" reason="not-found" />
```
