---
category: Navigation
---
Tabbed sections (Radix Tabs). `TabsList` is a muted pill bar (`variant="line"` for an underline style); `TabsTrigger value` matches `TabsContent value`. `orientation="vertical"` stacks the list beside the content.

## Usage

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

## Parts

- `TabsList` - the trigger bar (`variant`: `default` pill / `line` underline)
- `TabsTrigger` - one tab (`value`)
- `TabsContent` - panel shown for the matching `value`
