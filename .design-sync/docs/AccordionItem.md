---
category: Navigation
---
`AccordionItem` is part of the **Accordion** family - one section (`value`). Render it inside the `Accordion` composition; it has no standalone use.

## Usage (family composition)

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

See `Accordion.prompt.md` for the family overview.
