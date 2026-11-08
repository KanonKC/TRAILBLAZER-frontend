import { apiClient } from "@/lib/api-client";
import { buildEventUrl } from "@/lib/event-url";
import type { UploadedFile } from "@/services/uploadedFile.service";
import type { ReactiveRewardConfig, Reaction, ReactionDraft, TestReactionResult } from "../types";

const base = "/api/v1/reactive-reward";

export const reactiveRewardApi = {
    async get() {
        return (await apiClient.get<ReactiveRewardConfig>(base)).data;
    },
    /** Creates the widget the first time; returns it as it is afterwards. */
    async enable() {
        return (await apiClient.post<ReactiveRewardConfig>(base)).data;
    },
    async saveReaction(draft: ReactionDraft, reactionId?: string) {
        return (
            await apiClient.request<Reaction>({
                method: reactionId ? "PUT" : "POST",
                url: `${base}/reactions${reactionId ? `/${reactionId}` : ""}`,
                data: draft,
            })
        ).data;
    },
    async deleteReaction(reactionId: string) {
        await apiClient.delete(`${base}/reactions/${reactionId}`);
    },
    async testReaction(reactionId: string) {
        return (await apiClient.post<TestReactionResult>(`${base}/reactions/${reactionId}/test`)).data;
    },
    async beginUpload(file: { name: string; size: number; type: string; kind: "image" | "audio" | "video" }) {
        return (await apiClient.post<{ token: string; url: string }>(`${base}/uploads`, file)).data;
    },
    async completeUpload(token: string) {
        return (await apiClient.post<UploadedFile>(`${base}/uploads/${token}/complete`)).data;
    },
};

export const getReactiveRewardEventUrl = (userId: string, key?: string) =>
    buildEventUrl("/api/v1/events/reactive-reward", userId, key);
