import { cn } from "@/lib/utils";
import { ChannelPointsCost } from "@/components/icons/channel-points";
import { RewardIcon, type SelectableReward } from "./ChannelRewardSelector";

/** Reward icon + title, optionally followed by its point cost. */
export function RewardLabel({
  reward,
  showCost = false,
  alignCostEnd = false,
  className,
  iconClassName,
}: {
  reward: SelectableReward;
  showCost?: boolean;
  /** Pushes the cost to the right edge of the label, so costs line up when labels are stacked. */
  alignCostEnd?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2 text-sm", className)}>
      <RewardIcon reward={reward} className={iconClassName} />
      <span className={cn("truncate", alignCostEnd && "flex-1")}>{reward.title}</span>
      {showCost && (
      <ChannelPointsCost amount={reward.cost} className="text-muted-foreground text-sm" />
      )}
    </span>
  );
}
