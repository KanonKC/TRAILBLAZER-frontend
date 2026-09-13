---
category: Data display
---
`AvatarImage` is part of the **Avatar** family - the `<img>` (hidden until loaded). Render it inside the `Avatar` composition; it has no standalone use.

## Usage (family composition)

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

See `Avatar.prompt.md` for the family overview.
