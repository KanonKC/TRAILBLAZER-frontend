import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRandomDBDKiller } from "@/features/random-dbd-killer/hooks/useRandomDBDKiller";

const api = vi.hoisted(() => ({
    enableRandomDBDKiller: vi.fn(),
    updateRandomDBDKillerConfig: vi.fn(),
    testRandomDBDKiller: vi.fn(),
    getDBDKillerMasterList: vi.fn(),
    deleteWidget: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
}));

vi.mock("@/components/user-context", () => ({
    useUser: () => ({ user: { id: "user-1", twitchId: "twitch-1", username: "tester", displayName: "Tester" }, isLoading: false }),
}));
vi.mock("@/features/random-dbd-killer/api/randomDBDKiller.api", () => api);
vi.mock("@/services/widget.service", () => ({ deleteWidget: api.deleteWidget }));
vi.mock("@/utils/tbToast", () => ({ tbToast: { success: api.success, error: api.error } }));

describe("widget lifecycle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.getDBDKillerMasterList.mockResolvedValue([]);
    });

    it("enables, saves, changes status and deletes a widget", async () => {
        const enabledConfig = { widget: { id: "widget-1", enabled: true, overlay_key: "secret" }, twitch_reward_id: "reward-1", killer_pool: ["nurse"], animation_style: "spin" };
        api.enableRandomDBDKiller.mockResolvedValue(enabledConfig);
        api.updateRandomDBDKillerConfig.mockResolvedValue(enabledConfig);
        api.deleteWidget.mockResolvedValue(true);
        const { result } = renderHook(() => useRandomDBDKiller(null));

        await act(async () => { await result.current.handleEnable(); });
        expect(result.current.config).toEqual(enabledConfig);
        expect(result.current.activeTab).toBe("quick-start");
        expect(result.current.isSaving).toBe(false);

        await act(async () => { await result.current.handleSave(); });
        expect(api.updateRandomDBDKillerConfig).toHaveBeenCalledWith({ twitch_reward_id: "reward-1", killer_pool: ["nurse"], animation_style: "spin" });

        act(() => { result.current.handleStatusChange(false); });
        expect(result.current.config?.widget.enabled).toBe(false);
        await act(async () => { await result.current.handleDelete(); });
        expect(api.deleteWidget).toHaveBeenCalledWith("widget-1");
        expect(result.current.config).toBeNull();
        expect(result.current.activeTab).toBe("overview");
        expect(api.success).toHaveBeenCalledTimes(3);
    });

    it("reports a failed save and clears the busy state", async () => {
        api.updateRandomDBDKillerConfig.mockRejectedValue({ response: { data: { message: "failed" } } });
        const initialConfig = { widget: { id: "widget-1", enabled: true }, twitch_reward_id: null, killer_pool: [], animation_style: "spin" };
        const { result } = renderHook(() => useRandomDBDKiller(initialConfig as unknown as Parameters<typeof useRandomDBDKiller>[0]));
        await act(async () => { await result.current.handleSave(); });
        expect(result.current.isSaving).toBe(false);
        expect(api.error).toHaveBeenCalledWith(expect.objectContaining({ title: "บันทึกการตั้งค่าไม่สำเร็จ" }));
        await waitFor(() => expect(result.current.isLoadingKillerMasters).toBe(false));
    });
});
