---
category: Navigation
---
`TabsContent` is part of the **Tabs** family - panel shown for the matching `value`. Render it inside the `Tabs` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "trailblazer-ui";

<Tabs defaultValue="overview" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
    <TabsTrigger value="settings">ตั้งค่า</TabsTrigger>
    <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>
```

See `Tabs.prompt.md` for the family overview.
