import * as React from "react";
import { Table, TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, Badge, Button } from "trailblazer-ui";
import { Play, Trash } from "lucide-react";

const files = [
  { name: "raid-alert.mp3", size: "1.2 MB", used: "Raid Alert", active: true },
  { name: "sub-hype.mp3", size: "860 KB", used: "Sub Hype", active: true },
  { name: "bits-1000.mp3", size: "2.4 MB", used: "-", active: false },
  { name: "shoutout-intro.mp3", size: "540 KB", used: "Clip Shoutout", active: true },
];

export const UploadedFiles = () => (
  <div className="p-6">
    <Table>
      <TableCaption>ไฟล์เสียงที่อัปโหลด (4 ไฟล์, 5.0 MB)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ชื่อไฟล์</TableHead>
          <TableHead>ขนาด</TableHead>
          <TableHead>ใช้ใน</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((f) => (
          <TableRow key={f.name}>
            <TableCell className="font-mono">{f.name}</TableCell>
            <TableCell>{f.size}</TableCell>
            <TableCell>{f.used}</TableCell>
            <TableCell>{f.active ? <Badge variant="secondary">ใช้งานอยู่</Badge> : <Badge variant="outline">ว่าง</Badge>}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon-sm" aria-label="Play"><Play /></Button>
              <Button variant="ghost" size="icon-sm" aria-label="Delete"><Trash /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>รวม</TableCell>
          <TableCell className="text-right">5.0 MB</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
);

export const Compact = () => (
  <div className="p-6">
    <Table>
      <TableHeader>
        <TableRow><TableHead>อีเวนต์</TableHead><TableHead>ผู้ชม</TableHead><TableHead className="text-right">จำนวน</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>Raid</TableCell><TableCell>lilypichu</TableCell><TableCell className="text-right">1,204</TableCell></TableRow>
        <TableRow><TableCell>Bits</TableCell><TableCell>xQc_fan88</TableCell><TableCell className="text-right">500</TableCell></TableRow>
        <TableRow data-state="selected"><TableCell>Sub</TableCell><TableCell>nongmay</TableCell><TableCell className="text-right">Tier 1</TableCell></TableRow>
      </TableBody>
    </Table>
  </div>
);
