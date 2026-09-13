---
category: Data display
---
Data table (`text-sm`, row dividers, hover highlight, horizontal scroll wrapper). `TableHeader` > `TableRow` > `TableHead`; `TableBody` > `TableRow` > `TableCell`; optional `TableFooter` and `TableCaption`. Cells don't wrap - keep columns short or add `whitespace-normal`.

## Usage

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

## Parts

- `TableHeader` - `<thead>`
- `TableBody` - `<tbody>`
- `TableFooter` - `<tfoot>` (muted background, for totals)
- `TableRow` - `<tr>` with divider + hover
- `TableHead` - `<th>` header cell
- `TableCell` - `<td>`
- `TableCaption` - muted caption below the table
