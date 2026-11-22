import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { MediaThumb } from "@/features/reactive-reward/components/MediaThumb";
import { PositionGrid } from "@/features/reactive-reward/components/PositionGrid";
import { ReactionGrid } from "@/features/reactive-reward/components/ReactionGrid";
import { ReactionSheet } from "@/features/reactive-reward/components/ReactionSheet";
import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { RewardLabel } from "@/components/widget/RewardLabel";
import type { Reaction } from "@/features/reactive-reward/types";

// The Twitch combobox, the audio dialog and the file picker are covered on their own; here they are stand-ins
// that let a test choose a value.
vi.mock("@/components/widget/ChannelRewardSelector", () => ({
    RewardIcon: () => <span data-testid="reward-icon" />,
    ChannelRewardSelector: ({ value, onValueChange, rewards, getRewardDisabledNote, popupContainer }: any) => (
        <div data-testid="reward-selector" data-has-container={String(popupContainer instanceof HTMLElement)} data-container-slot={popupContainer?.getAttribute?.("data-slot") ?? ""}>
            {rewards.map((reward: any) => {
                const note = getRewardDisabledNote?.(reward);
                return (
                    <button key={reward.id} type="button" disabled={!!note} aria-pressed={value === reward.id} onClick={() => onValueChange(reward.id)}>
                        {reward.title}{note ? ` (${note})` : ""}
                    </button>
                );
            })}
        </div>
    ),
}));
vi.mock("@/components/widget/AudioFileUploader/CompactAudioFileUploader", () => ({
    CompactAudioFileUploader: ({ currentFileName, onFileSelect, onClear }: any) => (
        <div data-testid="audio-picker">
            <span>{currentFileName ?? "ไม่มีเสียง"}</span>
            <button type="button" onClick={() => onFileSelect({ id: "sound-id", key: "sound-key", name: "bell.mp3", type: "audio/mpeg", url: "https://cdn.test/bell.mp3", size_kb: 5, duration_ms: 1500 }, "sound-key")}>เลือกเสียง</button>
            {onClear && <button type="button" onClick={onClear}>นำเสียงออก</button>}
        </div>
    ),
}));
vi.mock("@/features/reactive-reward/components/MediaFilePicker", () => ({
    MediaFilePicker: ({ kind, value, onChange }: any) => (
        <div data-testid={`${kind}-picker`}>
            <span>{value?.name ?? "ยังไม่ได้เลือกไฟล์"}</span>
            <button type="button" onClick={() => onChange({ id: "media-id", key: `${kind}-key`, name: `file.${kind}`, type: kind === "image" ? "image/png" : "video/mp4", url: "https://cdn.test/file", sizeKb: 10, durationMs: kind === "video" ? 4000 : null })}>เลือกไฟล์</button>
        </div>
    ),
}));

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

const rewards = [
    { id: "reward-1", title: "Hydrate", cost: 100 },
    { id: "reward-2", title: "Dance", cost: 500 },
];

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

describe("ReactionGrid", () => {
    const handlers = () => ({ onAdd: vi.fn(), onEdit: vi.fn(), onToggle: vi.fn(), onTest: vi.fn() });
    const renderGrid = (reactions: Reaction[], overrides: Partial<React.ComponentProps<typeof ReactionGrid>> = {}) => {
        const callbacks = handlers();
        render(
            <ReactionGrid
                reactions={reactions}
                rewardsById={new Map(rewards.map((reward) => [reward.id, reward]))}
                rewardsLoaded
                busyReactionIds={new Set()}
                canAdd
                {...callbacks}
                {...overrides}
            />,
        );
        return callbacks;
    };

    it("invites the streamer to add the first reaction when there are none", () => {
        const callbacks = renderGrid([]);
        expect(screen.getByText("ยังไม่มี Reaction")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "เพิ่ม Reaction แรก" }));
        expect(callbacks.onAdd).toHaveBeenCalled();
    });

    it("shows the reward, the kind of media and its file name", () => {
        renderGrid([makeReaction()]);
        expect(screen.getByText("Hydrate")).toBeInTheDocument();
        expect(screen.getByText("รูปภาพ")).toBeInTheDocument();
        expect(screen.getByText(/pic\.png/)).toBeInTheDocument();
    });

    it("shows whether a reaction is on or off with its switch", () => {
        renderGrid([makeReaction(), makeReaction({ id: "reaction-2", twitch_reward_id: "reward-2", twitch_reward_title: "Dance", enabled: false })]);
        expect(screen.getByRole("switch", { name: /Hydrate/ })).toHaveAttribute("aria-checked", "true");
        expect(screen.getByRole("switch", { name: /Dance/ })).toHaveAttribute("aria-checked", "false");
    });

    it("flags a reaction whose file was deleted, and will not test it", () => {
        renderGrid([makeReaction({ media_key: null, media_file: null, media_url: null })]);
        expect(screen.getByText("ไฟล์ถูกลบออกจากคลังแล้ว")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "ทดสอบ Hydrate" })).toBeDisabled();
    });

    it("flags a reward that no longer exists on Twitch, but only once the rewards have loaded", () => {
        const stale = makeReaction({ twitch_reward_id: "gone", twitch_reward_title: "Old reward" });
        const { unmount } = render(
            <ReactionGrid reactions={[stale]} rewardsById={new Map()} rewardsLoaded busyReactionIds={new Set()} canAdd {...handlers()} />,
        );
        expect(screen.getByText("ไม่พบแต้มช่องนี้บน Twitch")).toBeInTheDocument();
        unmount();
        render(<ReactionGrid reactions={[stale]} rewardsById={new Map()} rewardsLoaded={false} busyReactionIds={new Set()} canAdd {...handlers()} />);
        expect(screen.queryByText("ไม่พบแต้มช่องนี้บน Twitch")).toBeNull();
    });

    it("hands each action the right reaction", () => {
        const reaction = makeReaction();
        const callbacks = renderGrid([reaction]);
        fireEvent.click(screen.getByRole("switch", { name: "เปิดใช้งาน Hydrate" }));
        expect(callbacks.onToggle).toHaveBeenCalledWith(reaction, false);
        fireEvent.click(screen.getByRole("button", { name: "ทดสอบ Hydrate" }));
        expect(callbacks.onTest).toHaveBeenCalledWith("reaction-1");
        fireEvent.click(screen.getByRole("button", { name: "แก้ไข Hydrate" }));
        expect(callbacks.onEdit).toHaveBeenCalledWith(reaction);
    });

    it("locks the controls of the reaction that is busy, and only that one", () => {
        renderGrid([makeReaction(), makeReaction({ id: "reaction-2", twitch_reward_id: "reward-2", twitch_reward_title: "Dance" })], { busyReactionIds: new Set(["reaction-1"]) });
        expect(screen.getByRole("switch", { name: "เปิดใช้งาน Hydrate" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "ทดสอบ Hydrate" })).toBeDisabled();
        expect(screen.getByRole("switch", { name: "เปิดใช้งาน Dance" })).toBeEnabled();
    });
});

describe("ReactionSheet", () => {
    const renderSheet = (editing: React.ComponentProps<typeof ReactionSheet>["editing"], overrides: Partial<React.ComponentProps<typeof ReactionSheet>> = {}) => {
        const props = {
            editing,
            rewards,
            isRewardsLoading: false,
            rewardUsedBy: vi.fn().mockReturnValue(false),
            onSave: vi.fn().mockResolvedValue(true),
            onDelete: vi.fn().mockResolvedValue(true),
            onTest: vi.fn(),
            isTesting: false,
            canEnableMore: true,
            onQuotaFull: vi.fn(),
            onClose: vi.fn(),
            ...overrides,
        };
        render(<ReactionSheet {...props} />);
        return props;
    };
    const save = () => screen.getByRole("button", { name: "บันทึก" });

    it("has the reward list render inside the sheet, which a modal sheet would otherwise block", async () => {
        renderSheet("new");
        // The list is portaled outside the sheet by default, where a modal dialog turns off pointer events
        await waitFor(() => expect(screen.getByTestId("reward-selector")).toHaveAttribute("data-has-container", "true"));
        expect(screen.getByTestId("reward-selector")).toHaveAttribute("data-container-slot", "sheet-content");
    });

    it("renders nothing while closed", () => {
        renderSheet(null);
        expect(screen.queryByText("เพิ่ม Reaction")).toBeNull();
    });

    it("cannot be saved until a reward and a file are chosen", () => {
        renderSheet("new");
        expect(screen.getByText("เพิ่ม Reaction")).toBeInTheDocument();
        expect(save()).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Hydrate" }));
        expect(save()).toBeDisabled();
        fireEvent.click(within(screen.getByTestId("image-picker")).getByRole("button", { name: "เลือกไฟล์" }));
        expect(save()).toBeEnabled();
    });

    it("starts a new reaction switched off when the points allow no more active reactions, and opens the quota dialog on trying to switch it on", async () => {
        const props = renderSheet("new", { canEnableMore: false });
        const enableSwitch = await screen.findByRole("switch", { name: "เปิดใช้งาน Reaction นี้" });
        expect(enableSwitch).toHaveAttribute("aria-checked", "false");
        expect(enableSwitch).toBeEnabled();
        fireEvent.click(enableSwitch);
        expect(props.onQuotaFull).toHaveBeenCalledTimes(1);
        expect(enableSwitch).toHaveAttribute("aria-checked", "false");
    });

    it("saves an image with the defaults and closes once the save went through", async () => {
        const props = renderSheet("new");
        fireEvent.click(screen.getByRole("button", { name: "Hydrate" }));
        fireEvent.click(within(screen.getByTestId("image-picker")).getByRole("button", { name: "เลือกไฟล์" }));
        fireEvent.click(save());
        await waitFor(() => expect(props.onClose).toHaveBeenCalled());
        expect(props.onSave).toHaveBeenCalledWith(
            { twitch_reward_id: "reward-1", enabled: true, media_type: "IMAGE", media_key: "image-key", sound_key: null, volume: 80, display_duration_ms: 5000, position: "CENTER", size_percent: 50 },
            undefined,
        );
    });

    it("stays open when the save fails, so nothing the streamer chose is lost", async () => {
        const props = renderSheet("new", { onSave: vi.fn().mockResolvedValue(false) });
        fireEvent.click(screen.getByRole("button", { name: "Hydrate" }));
        fireEvent.click(within(screen.getByTestId("image-picker")).getByRole("button", { name: "เลือกไฟล์" }));
        fireEvent.click(save());
        await waitFor(() => expect(props.onSave).toHaveBeenCalled());
        expect(props.onClose).not.toHaveBeenCalled();
        expect(save()).toBeEnabled();
    });

    it("sends the sound that goes with an image", async () => {
        const props = renderSheet("new");
        fireEvent.click(screen.getByRole("button", { name: "Hydrate" }));
        fireEvent.click(within(screen.getByTestId("image-picker")).getByRole("button", { name: "เลือกไฟล์" }));
        fireEvent.click(within(screen.getByTestId("audio-picker")).getByRole("button", { name: "เลือกเสียง" }));
        fireEvent.click(save());
        await waitFor(() => expect(props.onSave).toHaveBeenCalled());
        expect((props.onSave as Mock).mock.calls[0][0]).toMatchObject({ media_type: "IMAGE", media_key: "image-key", sound_key: "sound-key" });
    });

    it("clears the file when the type changes, since a file of one kind cannot play as another", () => {
        renderSheet("new");
        fireEvent.click(screen.getByRole("button", { name: "Hydrate" }));
        fireEvent.click(within(screen.getByTestId("image-picker")).getByRole("button", { name: "เลือกไฟล์" }));
        expect(save()).toBeEnabled();
        fireEvent.click(screen.getByRole("radio", { name: /^วิดีโอ/ }));
        expect(screen.getByTestId("video-picker")).toBeInTheDocument();
        expect(screen.queryByTestId("image-picker")).toBeNull();
        expect(save()).toBeDisabled();
    });

    it("offers a separate sound only for an image", () => {
        renderSheet("new");
        expect(screen.getByText("เสียงที่เล่นคู่กับรูป (ไม่บังคับ)")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("radio", { name: /^วิดีโอ/ }));
        expect(screen.queryByText("เสียงที่เล่นคู่กับรูป (ไม่บังคับ)")).toBeNull();
        fireEvent.click(screen.getByRole("radio", { name: /^เสียง/ }));
        expect(screen.queryByText("เสียงที่เล่นคู่กับรูป (ไม่บังคับ)")).toBeNull();
    });

    it("shows position and size for pictures and video, but not for sound", () => {
        renderSheet("new");
        expect(screen.getByRole("radiogroup", { name: "ตำแหน่งบนหน้าจอ" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("radio", { name: /^เสียง/ }));
        expect(screen.queryByRole("radiogroup", { name: "ตำแหน่งบนหน้าจอ" })).toBeNull();
    });

    it("shows how long an image stays only for an image", () => {
        renderSheet("new");
        expect(screen.getByText("ระยะเวลาที่แสดงรูป")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("radio", { name: /^วิดีโอ/ }));
        expect(screen.queryByText("ระยะเวลาที่แสดงรูป")).toBeNull();
    });

    it("disables a reward another reaction already uses, with the reason", () => {
        renderSheet("new", { rewardUsedBy: vi.fn((rewardId: string) => rewardId === "reward-2") });
        expect(screen.getByRole("button", { name: "Dance (ใช้กับ Reaction อื่นอยู่แล้ว)" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Hydrate" })).toBeEnabled();
    });

    it("does not count the reaction being edited as using its own reward", () => {
        const rewardUsedBy = vi.fn((rewardId: string, except?: string) => rewardId === "reward-1" && except !== "reaction-1");
        renderSheet(makeReaction(), { rewardUsedBy });
        expect(rewardUsedBy).toHaveBeenCalledWith("reward-1", "reaction-1");
        expect(screen.getByRole("button", { name: "Hydrate" })).toBeEnabled();
    });

    describe("editing a saved reaction", () => {
        it("starts from the stored values and saves under the same id", async () => {
            const props = renderSheet(makeReaction({ volume: 33, position: "TOP_LEFT", size_percent: 70 }));
            expect(screen.getByText("แก้ไข Reaction")).toBeInTheDocument();
            expect(screen.getByText("pic.png")).toBeInTheDocument();
            expect(screen.getByRole("radio", { name: "บนซ้าย" })).toHaveAttribute("aria-checked", "true");
            fireEvent.click(save());
            await waitFor(() => expect(props.onSave).toHaveBeenCalled());
            expect(props.onSave).toHaveBeenCalledWith(
                expect.objectContaining({ twitch_reward_id: "reward-1", media_key: "key-1", volume: 33, position: "TOP_LEFT", size_percent: 70 }),
                "reaction-1",
            );
        });

        it("tests the saved reaction", () => {
            const props = renderSheet(makeReaction());
            fireEvent.click(screen.getByRole("button", { name: /ทดสอบ/ }));
            expect(props.onTest).toHaveBeenCalledWith("reaction-1");
        });

        it("does not offer to test or delete a reaction that is not saved yet", () => {
            renderSheet("new");
            expect(screen.queryByRole("button", { name: /ทดสอบ/ })).toBeNull();
            expect(screen.queryByRole("button", { name: "ลบ Reaction" })).toBeNull();
        });

        it("asks before deleting, and only deletes after the confirmation", async () => {
            const props = renderSheet(makeReaction());
            fireEvent.click(screen.getByRole("button", { name: "ลบ Reaction" }));
            expect(props.onDelete).not.toHaveBeenCalled();
            expect(await screen.findByText("ลบ Reaction นี้ใช่ไหม")).toBeInTheDocument();
            fireEvent.click(screen.getByRole("button", { name: "ยืนยันการลบ" }));
            await waitFor(() => expect(props.onDelete).toHaveBeenCalledWith("reaction-1"));
            await waitFor(() => expect(props.onClose).toHaveBeenCalled());
        });

        it("leaves the sheet open when the delete failed", async () => {
            const props = renderSheet(makeReaction(), { onDelete: vi.fn().mockResolvedValue(false) });
            fireEvent.click(screen.getByRole("button", { name: "ลบ Reaction" }));
            fireEvent.click(await screen.findByRole("button", { name: "ยืนยันการลบ" }));
            await waitFor(() => expect(props.onDelete).toHaveBeenCalled());
            expect(props.onClose).not.toHaveBeenCalled();
        });
    });
});

describe("PositionGrid", () => {
    it("marks one of nine anchor points and reports a change", () => {
        const onChange = vi.fn();
        render(<PositionGrid value="CENTER" onChange={onChange} />);
        expect(screen.getAllByRole("radio")).toHaveLength(9);
        expect(screen.getByRole("radio", { name: "กลางจอ" })).toHaveAttribute("aria-checked", "true");
        fireEvent.click(screen.getByRole("radio", { name: "ล่างขวา" }));
        expect(onChange).toHaveBeenCalledWith("BOTTOM_RIGHT");
    });
});

describe("MediaThumb", () => {
    it("shows an image, a video frame without sound, an icon for audio, and a marker for a deleted file", () => {
        const { container, rerender } = render(<MediaThumb mediaType="IMAGE" url="https://cdn.test/a.png" />);
        expect(container.querySelector("img")?.getAttribute("src")).toBe("https://cdn.test/a.png");
        rerender(<MediaThumb mediaType="VIDEO" url="https://cdn.test/a.mp4" />);
        const video = container.querySelector("video") as HTMLVideoElement;
        expect(video.getAttribute("src")).toBe("https://cdn.test/a.mp4#t=0.1");
        expect(video.muted).toBe(true);
        rerender(<MediaThumb mediaType="AUDIO" url="https://cdn.test/a.mp3" />);
        expect(container.querySelector("img, video")).toBeNull();
        rerender(<MediaThumb mediaType="IMAGE" url="https://cdn.test/a.png" missing />);
        expect(container.querySelector("img")).toBeNull();
    });

    it("falls back to an icon when the image fails to load", () => {
        const { container } = render(<MediaThumb mediaType="IMAGE" url="https://cdn.test/broken.png" />);
        fireEvent.error(container.querySelector("img")!);
        expect(container.querySelector("img")).toBeNull();
    });
});

describe("OBSSetupHelp", () => {
    const open = (type: "audio" | "image" | "video" | "text") => {
        render(<OBSSetupHelp type={type} defaultOpen />);
        return screen.getAllByRole("listitem").map((item) => item.textContent);
    };

    it("gives a video the sound steps of audio, plus a note about codecs", () => {
        const steps = open("video");
        expect(steps.some((step) => step?.includes("Control audio via OBS"))).toBe(true);
        expect(steps.at(-1)).toContain("H.264");
        expect(steps.at(-1)).toContain("HEVC");
    });

    it("keeps audio, image and text as they were", () => {
        expect(open("audio")).toHaveLength(5);
    });

    it("keeps the two plain steps for an image", () => {
        expect(open("image")).toHaveLength(2);
    });
});

describe("RewardLabel", () => {
    it("shows the title, and the cost in a readable size when asked", () => {
        const { container } = render(<RewardLabel reward={{ id: "r", title: "Hydrate", cost: 1200 }} showCost />);
        expect(screen.getByText("Hydrate")).toBeInTheDocument();
        expect(screen.getByText("1,200")).toBeInTheDocument();
        expect(container.innerHTML).not.toContain("text-xs");
    });

    it("leaves the cost out by default", () => {
        render(<RewardLabel reward={{ id: "r", title: "Hydrate", cost: 1200 }} />);
        expect(screen.queryByText("1,200")).toBeNull();
    });
});
