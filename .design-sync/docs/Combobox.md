---
category: Forms
---
Searchable select (Base UI Combobox). `ComboboxInput` is an `InputGroup` with a chevron trigger (`showClear` adds an X); `ComboboxContent` holds a `ComboboxList` of `ComboboxItem`s and a `ComboboxEmpty` fallback. Pass `items` to `Combobox` for built-in filtering; `ComboboxChips` variants support multi-select tokens.

## Usage

```tsx
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "trailblazer-ui";

const rewards = ["Song Request", "Shoutout", "Hydrate!", "Change Killer"];

<Combobox items={rewards}>
  <ComboboxInput placeholder="เลือก Channel Reward" className="w-72" />
  <ComboboxContent>
    <ComboboxEmpty>ไม่พบ reward</ComboboxEmpty>
    <ComboboxList>
      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

`ChannelRewardSelector` is the app's ready-made Twitch reward picker built on this.

## Parts

- `ComboboxInput` - search input with trigger chevron (`showTrigger`, `showClear`)
- `ComboboxContent` - the popup (`side`, `align`, `anchor`)
- `ComboboxList` - scrollable item list; accepts a render function `(item) => <ComboboxItem/>`
- `ComboboxItem` - option row with check indicator (`value`)
- `ComboboxGroup` - groups items
- `ComboboxLabel` - muted group heading
- `ComboboxCollection` - renders a collection of items
- `ComboboxEmpty` - shown when nothing matches
- `ComboboxSeparator` - divider
- `ComboboxChips` - token container for multi-select
- `ComboboxChip` - one selected token
- `ComboboxChipsInput` - input inside the chips row
- `ComboboxTrigger` - chevron button that opens the list
- `ComboboxValue` - renders the selected value
