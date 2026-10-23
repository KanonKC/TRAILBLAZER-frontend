import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Reward } from "../types";

export function rewardImageUrl(reward?: Reward | null) {
  return reward?.image?.url_1x ?? reward?.default_image?.url_1x ?? null;
}

/** Twitch reward icon, falling back to a gift glyph when Twitch has none. */
export function RewardIcon({
  reward,
  className,
}: {
  reward?: Reward | null;
  className?: string;
}) {
  const imageUrl = rewardImageUrl(reward);
  return (
    <span
      className={cn(
        "bg-secondary inline-flex size-5 shrink-0 items-center justify-center rounded-sm",
        className,
      )}
      style={
        reward?.background_color
          ? { backgroundColor: reward.background_color }
          : undefined
      }
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="size-[70%] object-contain" />
      ) : (
        <Gift className="text-muted-foreground size-3" aria-hidden="true" />
      )}
    </span>
  );
}

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
