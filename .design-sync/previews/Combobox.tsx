import * as React from "react";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty, Label } from "trailblazer-ui";

const rewards = ["Song Request", "Shoutout", "Hydrate!", "Change Killer", "Random Perk"];

export const RewardPickerOpen = () => (
  <div className="p-6 min-h-96 grid gap-2 content-start">
    <Label>Channel Reward</Label>
    <Combobox items={rewards} defaultOpen defaultValue="Shoutout">
      <ComboboxInput placeholder="เลือก Channel Reward" className="w-72" />
      <ComboboxContent>
        <ComboboxEmpty>ไม่พบ reward</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  </div>
);

export const Closed = () => (
  <div className="p-6 grid gap-3">
    <Combobox items={rewards}>
      <ComboboxInput placeholder="เลือก Channel Reward" className="w-72" />
      <ComboboxContent>
        <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
    <Combobox items={rewards} defaultValue="Hydrate!">
      <ComboboxInput showClear className="w-72" />
      <ComboboxContent>
        <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  </div>
);
