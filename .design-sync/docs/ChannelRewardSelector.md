---
category: Widgets
---
Combobox of the streamer's Twitch Channel Point rewards (`rewards: TwitchCustomReward[]` - `id`, `title`, `cost`, `image`), showing the reward icon + cost; `value` is the selected reward id.

## Usage

```tsx
import { ChannelRewardSelector } from "trailblazer-ui";

<ChannelRewardSelector value={rewards[0].id} onValueChange={() => {}} rewards={rewards} placeholder="เลือก reward" />
```
