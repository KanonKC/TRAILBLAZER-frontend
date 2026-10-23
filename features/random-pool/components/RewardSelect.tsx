"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { RandomPoolController } from "../hooks/useRandomPool";
import { RewardIcon } from "./RewardLabel";

/** Channel-point reward combobox. One reward can only belong to one config. */
export function RewardSelect({
  controller,
}: {
  controller: RandomPoolController;
}) {
  const { rewards, draft, data, editingId } = controller;
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const selectedReward = rewards.find(
    (reward) => reward.id === draft.twitch_reward_id,
  );
  const inputValue = isOpen ? searchInput : (selectedReward?.title ?? "");
  const normalizedSearch = searchInput.trim().toLowerCase();
  const visibleRewards = rewards.filter((reward) =>
    reward.title.toLowerCase().includes(normalizedSearch),
  );

  return (
    <div className="grid gap-2">
      <Combobox
        value={draft.twitch_reward_id || null}
        onValueChange={(value) => {
          controller.patchDraft({ twitch_reward_id: value ?? "" });
          setSearchInput("");
        }}
        inputValue={inputValue}
        onInputValueChange={(value) => {
          if (isOpen) setSearchInput(value);
        }}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) setSearchInput("");
        }}
      >
        <div className="relative">
          {selectedReward && !isOpen && (
            <RewardIcon
              reward={selectedReward}
              className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-5 -translate-y-1/2"
            />
          )}
          <ComboboxInput
            aria-label="แต้มช่อง"
            placeholder="ค้นหาหรือเลือกแต้มช่อง"
            className={cn(
              "bg-secondary border-border h-8 w-full text-sm rounded-md",
              selectedReward && !isOpen && "[&_input]:pl-9",
            )}
          />
        </div>
        <ComboboxContent className="bg-popover border-border rounded-lg border p-0.5 shadow-lg ring-0">
          <ComboboxList className="grid gap-0 p-0">
            {visibleRewards.map((reward) => {
              const takenBy = data.configs.data.find(
                (other) =>
                  other.id !== editingId && other.twitch_reward_id === reward.id,
              );
              return (
                <ComboboxItem
                  key={reward.id}
                  value={reward.id}
                  disabled={!!takenBy}
                  className="data-highlighted:bg-secondary data-highlighted:text-foreground data-highlighted:**:!text-foreground cursor-pointer gap-2 rounded-md py-1 pr-7 pl-1.5 text-sm [&>span.absolute]:text-primary"
                >
                  <RewardIcon reward={reward} className="size-6" />
                  <span className="grid min-w-0 flex-1">
                    <span className="truncate">{reward.title}</span>
                    {takenBy && (
                      <span className="text-muted-foreground truncate text-xs">
                        ใช้อยู่ใน {takenBy.name}
                      </span>
                    )}
                  </span>
                  <span className="text-supernova shrink-0 text-xs tabular-nums">
                    {reward.cost.toLocaleString()}
                  </span>
                </ComboboxItem>
              );
            })}
          </ComboboxList>
          {visibleRewards.length === 0 && (
            <div className="text-muted-foreground py-3 text-center text-sm">
              ไม่พบข้อมูล
            </div>
          )}
        </ComboboxContent>
      </Combobox>
      {!rewards.length && (
        <p className="text-muted-foreground text-sm">
          ยังไม่มีแต้มช่องให้เลือก กรุณาสร้าง Custom Reward ใน Twitch ก่อน
        </p>
      )}
    </div>
  );
}
