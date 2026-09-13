import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, Button } from "trailblazer-ui";
import { MoreVertical, Settings, LogOut, User, Bell, Languages } from "lucide-react";

export const AccountMenuOpen = () => (
  <div className="p-6 min-h-96">
    <DropdownMenu open modal={false}>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="More"><MoreVertical /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>MrJeremy</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem><User /> โปรไฟล์ <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><Settings /> ตั้งค่า <DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>แจ้งเตือนทางอีเมล</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>แจ้งเตือนทาง Discord</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Languages /> ภาษา</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value="th">
              <DropdownMenuRadioItem value="th">ไทย</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive"><LogOut /> ออกจากระบบ</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const Closed = () => (
  <div className="p-6">
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline"><Bell data-icon="inline-start" /> การแจ้งเตือน</Button></DropdownMenuTrigger>
      <DropdownMenuContent><DropdownMenuItem>ทั้งหมด</DropdownMenuItem></DropdownMenuContent>
    </DropdownMenu>
  </div>
);
