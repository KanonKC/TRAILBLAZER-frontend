import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button, Input, Label } from "trailblazer-ui";

export const EditNameOpen = () => (
  <div className="p-6 min-h-96">
    <Dialog open modal={false}>
      <DialogTrigger asChild><Button variant="outline">แก้ไขชื่อ</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขชื่อที่แสดง</DialogTitle>
          <DialogDescription>ชื่อนี้จะแสดงบนหน้าจอสตรีมของคุณเมื่อมีการ shoutout</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="dlg-name">ชื่อ</Label>
          <Input id="dlg-name" defaultValue="MrJeremy" />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">ยกเลิก</Button></DialogClose>
          <Button>บันทึก</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

export const Closed = () => (
  <div className="p-6">
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">เปิดหน้าต่างอัปโหลด</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>อัปโหลดไฟล์เสียง</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
);
