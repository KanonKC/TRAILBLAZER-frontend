---
category: Actions
---
`DropdownMenuContent` is part of the **DropdownMenu** family - the floating menu panel (`align`, `sideOffset`). Render it inside the `DropdownMenu` composition; it has no standalone use.

## Usage (family composition)

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

See `DropdownMenu.prompt.md` for the family overview.
