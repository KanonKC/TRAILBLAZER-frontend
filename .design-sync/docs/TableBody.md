---
category: Data display
---
`TableBody` is part of the **Table** family - `<tbody>`. Render it inside the `Table` composition; it has no standalone use.

## Usage (family composition)

```tsx
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "trailblazer-ui";

<Table>
  <TableCaption>ไฟล์เสียงที่อัปโหลด</TableCaption>
  <TableHeader>
    <TableRow><TableHead>ชื่อไฟล์</TableHead><TableHead>ขนาด</TableHead><TableHead className="text-right">สถานะ</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>raid-alert.mp3</TableCell><TableCell>1.2 MB</TableCell><TableCell className="text-right"><Badge variant="secondary">ใช้งานอยู่</Badge></TableCell></TableRow>
    <TableRow><TableCell>sub-hype.mp3</TableCell><TableCell>860 KB</TableCell><TableCell className="text-right"><Badge variant="outline">ว่าง</Badge></TableCell></TableRow>
  </TableBody>
</Table>
```

See `Table.prompt.md` for the family overview.
