---
category: Forms
---
`ComboboxChip` is part of the **Combobox** family - one selected token. Render it inside the `Combobox` composition; it has no standalone use.

## Usage (family composition)

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

See `Combobox.prompt.md` for the family overview.
