import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FirstWordOverlayPage from "@/app/overlays/first-word/[userId]/page";

const overlayMocks = vi.hoisted(() => ({ ackOverlayJob: vi.fn() }));
vi.mock("next/navigation", () => ({ useParams: () => ({ userId: "user-1" }), useSearchParams: () => new URLSearchParams("key=secret") }));
vi.mock("@/features/first-word/api/firstWord.api", () => ({ getFirstWordEventUrl: () => "https://example.test/events" }));
vi.mock("@/lib/overlay-queue", () => overlayMocks);

class FakeEventSource {
    static instances: FakeEventSource[] = [];
    listeners = new Map<string, (event: MessageEvent) => void>();
    onopen: (() => void) | null = null;
    onerror: (() => void) | null = null;
    closed = false;
    constructor(public url: string) { FakeEventSource.instances.push(this); }
    addEventListener(name: string, listener: EventListener) { this.listeners.set(name, listener as (event: MessageEvent) => void); }
    close() { this.closed = true; }
    emit(name: string, data: object) { this.listeners.get(name)?.({ data: JSON.stringify(data) } as MessageEvent); }
}

describe("overlay event connection", () => {
    beforeEach(() => {
        FakeEventSource.instances = [];
        vi.clearAllMocks();
        vi.stubGlobal("EventSource", FakeEventSource);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    });

    it("connects, acknowledges completed audio and closes on unmount", () => {
        const { container, unmount } = render(<FirstWordOverlayPage />);
        expect(FakeEventSource.instances[0].url).toBe("https://example.test/events");
        const audio = container.querySelector("audio")!;
        act(() => { FakeEventSource.instances[0].emit("audio", { url: "https://example.test/audio.mp3", jobId: "job-1", volume: 25 }); });
        expect(audio.volume).toBe(0.25);
        act(() => { audio.dispatchEvent(new Event("ended", { bubbles: true })); });
        expect(overlayMocks.ackOverlayJob).toHaveBeenCalledWith("first-word", "user-1", "job-1", "secret");
        unmount();
        expect(FakeEventSource.instances[0].closed).toBe(true);
    });

    it("reconnects after an error", () => {
        vi.useFakeTimers();
        try {
            const { unmount } = render(<FirstWordOverlayPage />);
            act(() => { FakeEventSource.instances[0].onerror?.(); });
            expect(FakeEventSource.instances[0].closed).toBe(true);
            act(() => { vi.advanceTimersByTime(1000); });
            expect(FakeEventSource.instances).toHaveLength(2);
            unmount();
        } finally { vi.useRealTimers(); }
    });
});
