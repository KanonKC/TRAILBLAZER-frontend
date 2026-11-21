import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { describeError } from "@/features/reactive-reward/errors";
import { toDraft, useReactiveReward } from "@/features/reactive-reward/hooks/useReactiveReward";
import type { Reaction, ReactionDraft, ReactiveRewardConfig } from "@/features/reactive-reward/types";

const mocks = vi.hoisted(() => ({
    api: {
        enable: vi.fn(),
        saveReaction: vi.fn(),
        deleteReaction: vi.fn(),
        testReaction: vi.fn(),
    },
    deleteWidget: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    useTwitchRewards: vi.fn(),
}));

vi.mock("@/components/user-context", () => ({
    useUser: () => ({ user: { id: "user-1", twitchId: "twitch-1", username: "tester", displayName: "Tester" }, isLoading: false }),
}));
vi.mock("@/features/reactive-reward/api/reactiveReward.api", () => ({ reactiveRewardApi: mocks.api }));
vi.mock("@/services/widget.service", () => ({ deleteWidget: mocks.deleteWidget }));
vi.mock("@/utils/tbToast", () => ({ tbToast: { success: mocks.success, error: mocks.error } }));
vi.mock("@/hooks/use-twitch-rewards", () => ({ useTwitchRewards: mocks.useTwitchRewards }));

const makeReaction = (overrides: Partial<Reaction> = {}): Reaction => ({
    id: "reaction-1",
    twitch_reward_id: "reward-1",
    twitch_reward_title: "Hydrate",
    enabled: true,
    sort_order: 0,
    media_type: "IMAGE",
    media_key: "key-1",
    media_file: { id: "file-1", key: "key-1", name: "pic.png", type: "image/png", size_kb: 10, duration_ms: null },
    media_url: "https://cdn.test/pic.png",
    sound_key: null,
    sound_file: null,
    sound_url: null,
    volume: 80,
    display_duration_ms: 5000,
    position: "CENTER",
    size_percent: 50,
    ...overrides,
});

const makeConfig = (reactions: Reaction[] = []): ReactiveRewardConfig => ({
    id: "rr-1",
    widget_id: "widget-1",
    widget: { id: "widget-1", enabled: true, overlay_key: "secret" } as ReactiveRewardConfig["widget"],
    reactions,
    quota: { active_count: reactions.filter((reaction) => reaction.enabled).length, points_needed: 1, points_available: 3, active_limit: 20, max_reactions: 50 },
});

const draft: ReactionDraft = {
    twitch_reward_id: "reward-1",
    enabled: true,
    media_type: "IMAGE",
    media_key: "key-1",
    sound_key: null,
    volume: 80,
    display_duration_ms: 5000,
    position: "CENTER",
    size_percent: 50,
};

const apiError = (message: string, status = 400) => ({ response: { status, data: { message } } });

describe("useReactiveReward", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useTwitchRewards.mockReturnValue({ rewards: [{ id: "reward-1", title: "Hydrate", cost: 100 }], isLoading: false });
        vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    it("asks for every reward, not only those that need viewer text", () => {
        renderHook(() => useReactiveReward(null));
        expect(mocks.useTwitchRewards).toHaveBeenCalledWith({ userInputRequired: false });
    });

    describe("widget lifecycle", () => {
        it("enables the widget, shows quick start, and deletes it again", async () => {
            const enabled = makeConfig();
            mocks.api.enable.mockResolvedValue(enabled);
            mocks.deleteWidget.mockResolvedValue(true);
            const { result } = renderHook(() => useReactiveReward(null));
            expect(result.current.activeTab).toBe("overview");

            await act(async () => { await result.current.handleEnable(); });
            expect(result.current.config).toEqual(enabled);
            expect(result.current.isEnabled).toBe(true);
            expect(result.current.activeTab).toBe("quick-start");
            expect(result.current.isSaving).toBe(false);

            await act(async () => { await result.current.handleDelete(); });
            expect(mocks.deleteWidget).toHaveBeenCalledWith("widget-1");
            expect(result.current.config).toBeNull();
            expect(result.current.activeTab).toBe("overview");
            expect(mocks.success).toHaveBeenCalledTimes(2);
        });

        it("starts on the settings tab when the widget already exists", () => {
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            expect(result.current.activeTab).toBe("settings");
            expect(result.current.reactions).toHaveLength(1);
        });

        it("reports a failed enable without losing the page", async () => {
            mocks.api.enable.mockRejectedValue(apiError("nope", 403));
            const { result } = renderHook(() => useReactiveReward(null));
            await act(async () => { await result.current.handleEnable(); });
            expect(result.current.config).toBeNull();
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({ title: "เปิดใช้งานไม่สำเร็จ" }));
            expect(result.current.isSaving).toBe(false);
        });

        it("builds the overlay link from the user and the overlay key", () => {
            const { result } = renderHook(() => useReactiveReward(makeConfig()));
            expect(result.current.overlayUrl).toBe(`${window.location.origin}/overlays/reactive-reward/user-1?key=secret`);
        });
    });

    describe("saving reactions", () => {
        it("adds a new reaction to the list", async () => {
            const saved = makeReaction();
            mocks.api.saveReaction.mockResolvedValue(saved);
            const { result } = renderHook(() => useReactiveReward(makeConfig()));
            let outcome = false;
            await act(async () => { outcome = await result.current.handleSaveReaction(draft); });
            expect(outcome).toBe(true);
            expect(mocks.api.saveReaction).toHaveBeenCalledWith(draft, undefined);
            expect(result.current.reactions).toEqual([saved]);
            expect(mocks.success).toHaveBeenCalledWith({ title: "บันทึก Reaction สำเร็จ" });
        });

        it("replaces an edited reaction in place instead of adding a second one", async () => {
            const original = makeReaction();
            const other = makeReaction({ id: "reaction-2", twitch_reward_id: "reward-2" });
            const edited = makeReaction({ volume: 20 });
            mocks.api.saveReaction.mockResolvedValue(edited);
            const { result } = renderHook(() => useReactiveReward(makeConfig([original, other])));
            await act(async () => { await result.current.handleSaveReaction({ ...draft, volume: 20 }, "reaction-1"); });
            expect(mocks.api.saveReaction).toHaveBeenCalledWith({ ...draft, volume: 20 }, "reaction-1");
            expect(result.current.reactions).toEqual([edited, other]);
        });

        it("keeps the list and says why when the server refuses, in Thai", async () => {
            mocks.api.saveReaction.mockRejectedValue(apiError("Reward is already bound to a widget"));
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            let outcome = true;
            await act(async () => { outcome = await result.current.handleSaveReaction({ ...draft, twitch_reward_id: "reward-9" }); });
            expect(outcome).toBe(false);
            expect(result.current.reactions).toHaveLength(1);
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({
                title: "บันทึก Reaction ไม่สำเร็จ",
                description: "แต้มช่องนี้ถูกใช้กับวิดเจ็ตอื่นอยู่แล้ว",
            }));
        });

        it("passes along a server message it has no Thai wording for", async () => {
            mocks.api.saveReaction.mockRejectedValue(apiError("Something unexpected"));
            const { result } = renderHook(() => useReactiveReward(makeConfig()));
            await act(async () => { await result.current.handleSaveReaction(draft); });
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({ description: "Something unexpected" }));
        });

        it("turns a reaction on or off by saving it again with only that flag changed", async () => {
            const reaction = makeReaction({ sound_key: "sound-1", volume: 33, position: "TOP_LEFT" });
            mocks.api.saveReaction.mockResolvedValue({ ...reaction, enabled: false });
            const { result } = renderHook(() => useReactiveReward(makeConfig([reaction])));
            await act(async () => { await result.current.handleToggleReaction(reaction, false); });
            expect(mocks.api.saveReaction).toHaveBeenCalledWith({ ...toDraft(reaction), enabled: false }, "reaction-1");
            expect(result.current.reactions[0].enabled).toBe(false);
            expect(result.current.busyReactionId).toBeNull();
        });

        it("rebuilds a draft from a stored reaction without losing any setting", () => {
            const reaction = makeReaction({ sound_key: "sound-1", volume: 33, display_duration_ms: 7000, position: "BOTTOM_RIGHT", size_percent: 70 });
            expect(toDraft(reaction)).toEqual({
                twitch_reward_id: "reward-1",
                enabled: true,
                media_type: "IMAGE",
                media_key: "key-1",
                sound_key: "sound-1",
                volume: 33,
                display_duration_ms: 7000,
                position: "BOTTOM_RIGHT",
                size_percent: 70,
            });
        });
    });

    describe("deleting and testing reactions", () => {
        it("removes a deleted reaction from the list", async () => {
            mocks.api.deleteReaction.mockResolvedValue(undefined);
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction(), makeReaction({ id: "reaction-2", twitch_reward_id: "reward-2" })])));
            let outcome = false;
            await act(async () => { outcome = await result.current.handleDeleteReaction("reaction-1"); });
            expect(outcome).toBe(true);
            expect(result.current.reactions.map((reaction) => reaction.id)).toEqual(["reaction-2"]);
        });

        it("keeps a reaction that could not be deleted", async () => {
            mocks.api.deleteReaction.mockRejectedValue(apiError("boom", 500));
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            let outcome = true;
            await act(async () => { outcome = await result.current.handleDeleteReaction("reaction-1"); });
            expect(outcome).toBe(false);
            expect(result.current.reactions).toHaveLength(1);
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({ title: "ลบ Reaction ไม่สำเร็จ" }));
        });

        it("tells the streamer to look at OBS after a test is queued", async () => {
            mocks.api.testReaction.mockResolvedValue({ enqueued: true, jobId: "job-1" });
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            await act(async () => { await result.current.handleTestReaction("reaction-1"); });
            expect(mocks.api.testReaction).toHaveBeenCalledWith("reaction-1");
            expect(mocks.success).toHaveBeenCalledWith(expect.objectContaining({ title: "ส่งทดสอบแล้ว" }));
            expect(result.current.isTesting).toBe(false);
            expect(result.current.busyReactionId).toBeNull();
        });

        it("explains when no overlay is connected", async () => {
            mocks.api.testReaction.mockRejectedValue(apiError("No overlay is connected. Open your OBS browser source first"));
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            await act(async () => { await result.current.handleTestReaction("reaction-1"); });
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({
                title: "ทดสอบไม่สำเร็จ",
                description: "ยังไม่มีโอเวอร์เลย์ที่เชื่อมต่ออยู่ กรุณาเปิดลิงก์โอเวอร์เลย์ใน OBS ก่อน",
            }));
            expect(mocks.success).not.toHaveBeenCalled();
        });

        it("does not call a test a success when the queue would not take it", async () => {
            mocks.api.testReaction.mockResolvedValue({ enqueued: false, reason: "queue_full" });
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            await act(async () => { await result.current.handleTestReaction("reaction-1"); });
            expect(mocks.success).not.toHaveBeenCalled();
            expect(mocks.error).toHaveBeenCalledWith(expect.objectContaining({ title: "ทดสอบไม่สำเร็จ" }));
        });
    });

    describe("the reaction list", () => {
        it("stops offering to add once there are 50", () => {
            const fifty = Array.from({ length: 50 }, (_, index) => makeReaction({ id: `r-${index}`, twitch_reward_id: `reward-${index}` }));
            expect(renderHook(() => useReactiveReward(makeConfig(fifty))).result.current.canAddReaction).toBe(false);
            expect(renderHook(() => useReactiveReward(makeConfig(fifty.slice(1)))).result.current.canAddReaction).toBe(true);
        });

        it("knows which rewards another reaction already uses, but not the one being edited", () => {
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            expect(result.current.rewardUsedBy("reward-1")).toBe(true);
            expect(result.current.rewardUsedBy("reward-1", "reaction-1")).toBe(false);
            expect(result.current.rewardUsedBy("reward-2")).toBe(false);
        });

        it("opens the sheet blank, on a reaction, and closes it", () => {
            const reaction = makeReaction();
            const { result } = renderHook(() => useReactiveReward(makeConfig([reaction])));
            expect(result.current.editing).toBeNull();
            act(() => result.current.openNewReaction());
            expect(result.current.editing).toBe("new");
            act(() => result.current.openReaction(reaction));
            expect(result.current.editing).toBe(reaction);
            act(() => result.current.closeReaction());
            expect(result.current.editing).toBeNull();
        });

        it("closes the sheet when the widget is deleted", async () => {
            mocks.deleteWidget.mockResolvedValue(true);
            const { result } = renderHook(() => useReactiveReward(makeConfig([makeReaction()])));
            act(() => result.current.openNewReaction());
            await act(async () => { await result.current.handleDelete(); });
            expect(result.current.editing).toBeNull();
        });
    });
});

describe("describeError", () => {
    it.each([
        ["Image must be at most 2 MB", "ไฟล์ต้องมีขนาดไม่เกิน 2 MB"],
        ["Sound must be at most 2 MB", "ไฟล์ต้องมีขนาดไม่เกิน 2 MB"],
        ["Video must be at most 20 MB", "วิดีโอต้องมีขนาดไม่เกิน 20 MB"],
        ["Video must be at most 30 seconds", "วิดีโอต้องยาวไม่เกิน 30 วินาที"],
        ["Sound must be at most 30 seconds", "เสียงประกอบต้องยาวไม่เกิน 30 วินาที"],
        ["Video duration could not be read", "อ่านความยาวของวิดีโอไม่ได้ กรุณาอัปโหลดไฟล์ใหม่"],
        ["Video must be mp4 or webm", "วิดีโอต้องเป็นไฟล์ MP4 หรือ WebM"],
        ["Reaction limit reached (50)", "สร้าง Reaction ครบจำนวนสูงสุดแล้ว"],
    ])("words %s in Thai", (message, thai) => {
        expect(describeError(apiError(message))).toBe(thai);
    });

    it("passes along a message it does not know, and says nothing when there is none", () => {
        expect(describeError(apiError("Totally new problem"))).toBe("Totally new problem");
        expect(describeError(new Error("network"))).toBeUndefined();
        expect(describeError({ response: { data: {} } })).toBeUndefined();
    });
});
