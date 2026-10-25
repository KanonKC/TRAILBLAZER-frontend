import { apiClient } from "@/lib/api-client";
import { buildEventUrl } from "@/lib/event-url";
import { RandomDbdPerkConfig, RandomDbdPerkClass } from "../types";

export const getRandomDbdPerkConfig = async (): Promise<RandomDbdPerkConfig> => {
    const response = await apiClient.get<RandomDbdPerkConfig>("/api/v1/random-dbd-perk");
    return response.data;
};

export const enableRandomDbdPerk = async (enabled: boolean): Promise<RandomDbdPerkConfig> => {
    const response = await apiClient.post<RandomDbdPerkConfig>("/api/v1/random-dbd-perk", {
        enabled,
    });
    return response.data;
};

export const updateRandomDbdPerkConfig = async (data: Partial<RandomDbdPerkConfig> & { classes?: Partial<RandomDbdPerkClass>[] }): Promise<RandomDbdPerkConfig> => {
    const response = await apiClient.put<RandomDbdPerkConfig>("/api/v1/random-dbd-perk", data);
    return response.data;
};

export const testRandomDbdPerk = async (eventData: any): Promise<void> => {
    await apiClient.post("/webhook/v1/twitch/event-sub/channel-redemption-add", eventData);
};

// TODO(overlay-queue): the backend has no /api/v1/random-dbd-perk/sse/:userId
// route, so this URL points at nothing. Either build the event controller (and
// queue the widget like the others) or delete this along with the overlay page.
export const getRandomDbdPerkEventUrl = (userId: string, key?: string) => {
    return buildEventUrl("/api/v1/random-dbd-perk/sse", userId, key);
};
