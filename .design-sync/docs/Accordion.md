---
category: Navigation
---
Collapsible sections (Radix Accordion). `type="single" collapsible` for one-open-at-a-time; each `AccordionItem value` wraps an `AccordionTrigger` (chevron added) and `AccordionContent`. The app's help panels (`OBSSetupHelp`, `ReplyMessageHelp`, `TrailblazerAccordian`) are built on it.

## Usage

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "trailblazer-ui";

<Accordion type="single" collapsible defaultValue="obs" className="w-full max-w-md">
  <AccordionItem value="obs">
    <AccordionTrigger>วิธีตั้งค่าใน OBS</AccordionTrigger>
    <AccordionContent>ไปที่ Sources &gt; Add Source &gt; Browser แล้วนำลิงก์ไปใส่ในช่อง URL</AccordionContent>
  </AccordionItem>
  <AccordionItem value="faq">
    <AccordionTrigger>ทำไมเสียงไม่ออก?</AccordionTrigger>
    <AccordionContent>ติ๊ก "Control audio via OBS" แล้วตั้ง Audio Monitoring เป็น Monitor and Output</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Parts

- `AccordionItem` - one section (`value`)
- `AccordionTrigger` - clickable header with chevron
- `AccordionContent` - collapsible body
