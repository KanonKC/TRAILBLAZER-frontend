import { cn } from "@/lib/utils";
import { RewardIcon, type SelectableReward } from "./ChannelRewardSelector";

/** Reward icon + title, optionally followed by its point cost. */
export function RewardLabel({
  reward,
  showCost = false,
  className,
  iconClassName,
}: {
  reward: SelectableReward;
  showCost?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2 text-sm", className)}>
      <RewardIcon reward={reward} className={iconClassName} />
      <span className="truncate">{reward.title}</span>
      {showCost && (
        <span className="text-supernova shrink-0 text-sm tabular-nums">
          {reward.cost.toLocaleString()}
        </span>
      )}
    </span>
  );
}
