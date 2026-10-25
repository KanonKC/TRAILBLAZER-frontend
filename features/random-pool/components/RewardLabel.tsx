import { cn } from "@/lib/utils";
import { RewardIcon } from "@/components/widget/ChannelRewardSelector";
import type { Reward } from "../types";

/** Reward icon + title, optionally followed by its point cost. */
export function RewardLabel({
  reward,
  showCost = false,
  className,
  iconClassName,
}: {
  reward: Reward;
  showCost?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2 text-sm", className)}>
      <RewardIcon reward={reward} className={iconClassName} />
      <span className="truncate">{reward.title}</span>
      {showCost && (
        <span className="text-supernova shrink-0 text-xs tabular-nums">
          {reward.cost.toLocaleString()}
        </span>
      )}
    </span>
  );
}
