---
category: Data display
---
Round user image with initials fallback (Radix Avatar). `size`: `sm` (24px) / `default` (32px) / `lg` (40px). `AvatarBadge` adds a status dot; `AvatarGroup` overlaps several avatars with an optional `AvatarGroupCount`.

## Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from "trailblazer-ui";

<div className="flex items-center gap-6">
  <Avatar size="lg">
    <AvatarImage src="https://static-cdn.jtvnw.net/jtv_user_pictures/…-profile_image-300x300.png" alt="MrJeremy" />
    <AvatarFallback>MJ</AvatarFallback>
    <AvatarBadge className="bg-green-500" />
  </Avatar>
  <AvatarGroup>
    <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
    <AvatarGroupCount>+3</AvatarGroupCount>
  </AvatarGroup>
</div>
```

## Parts

- `AvatarImage` - the `<img>` (hidden until loaded)
- `AvatarFallback` - initials/icon shown while loading or on error
- `AvatarBadge` - small status dot at the bottom-right
- `AvatarGroup` - overlapping row of avatars
- `AvatarGroupCount` - trailing `+N` bubble
