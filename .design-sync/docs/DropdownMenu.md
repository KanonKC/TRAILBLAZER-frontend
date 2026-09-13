---
category: Actions
---
Context/actions menu (Radix DropdownMenu). Items support a leading icon, `inset`, `variant="destructive"`, a trailing `DropdownMenuShortcut`, checkbox and radio items, labels, separators and nested submenus.

## Usage

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuCheckboxItem, Button } from "trailblazer-ui";
import { MoreVertical, Settings, LogOut } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical /></Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>MrJeremy</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuItem><Settings /> ตั้งค่า <DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>แจ้งเตือนทางอีเมล</DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive"><LogOut /> ออกจากระบบ</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Parts

- `DropdownMenuTrigger` - opens the menu (`asChild`)
- `DropdownMenuContent` - the floating menu panel (`align`, `sideOffset`)
- `DropdownMenuGroup` - groups related items
- `DropdownMenuLabel` - small muted heading (`inset`)
- `DropdownMenuItem` - menu row: icon + text (+ `DropdownMenuShortcut`); `variant="destructive"`, `inset`
- `DropdownMenuCheckboxItem` - toggleable row with a check indicator (`checked`, `onCheckedChange`)
- `DropdownMenuRadioGroup` - single-choice group (`value`, `onValueChange`)
- `DropdownMenuRadioItem` - row inside a RadioGroup (`value`)
- `DropdownMenuSeparator` - 1px divider
- `DropdownMenuShortcut` - right-aligned muted hint text
- `DropdownMenuSub` - nested submenu root
- `DropdownMenuSubTrigger` - row that opens the submenu (chevron added)
- `DropdownMenuSubContent` - submenu panel
- `DropdownMenuPortal` - portal (already used by DropdownMenuContent)
