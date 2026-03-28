import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { getTwitchChannelRewards, type TwitchCustomReward } from "@/services/twitch.service";

/**
 * Shared hook to fetch and manage Twitch custom rewards.
 * Centralizes the fetching logic used by multiple widgets.
 */
export const useTwitchRewards = (options: { userInputRequired?: boolean } = { userInputRequired: true }) => {
    const { user } = useUser();
    const [rewards, setRewards] = useState<TwitchCustomReward[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!user) return;

        const fetchRewards = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getTwitchChannelRewards(options);
                setRewards(data);
            } catch (err) {
                console.error("Failed to fetch Twitch rewards:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRewards();
    }, [user, options.userInputRequired]);

    return {
        rewards,
        isLoading,
        error,
        setRewards
    };
};
