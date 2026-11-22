import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReactiveRewardOverlay } from "@/features/reactive-reward/components/ReactiveRewardOverlay";
import { ENDED_GRACE_MS, READY_TIMEOUT_MS } from "@/features/reactive-reward/hooks/useReactiveRewardOverlay";
import type { ReactionPlayEvent } from "@/features/reactive-reward/types";

const overlayMocks = vi.hoisted(() => ({ ackOverlayJobWithRetry: vi.fn() }));
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
    emit(name: string, data: unknown) { this.listeners.get(name)?.({ data: typeof data === "string" ? data : JSON.stringify(data) } as MessageEvent); }
}

/** Decoding is controlled per test: it resolves, rejects, or never finishes. */
class FakeImage {
    static behaviour: "resolve" | "reject" | "pending" = "resolve";
    src = "";
    decode() {
        if (FakeImage.behaviour === "resolve") return Promise.resolve();
        if (FakeImage.behaviour === "reject") return Promise.reject(new Error("broken image"));
        return new Promise<void>(() => undefined);
    }
}

class FakeAudio extends EventTarget {
    static instances: FakeAudio[] = [];
    static playBehaviour: "resolve" | "reject" = "resolve";
    src = "";
    preload = "";
    volume = 1;
    pause = vi.fn();
    play = vi.fn(() => (FakeAudio.playBehaviour === "resolve" ? Promise.resolve() : Promise.reject(new Error("NotAllowedError"))));
    constructor(src?: string) {
        super();
        if (src) this.src = src;
        FakeAudio.instances.push(this);
    }
}

const baseEvent: ReactionPlayEvent = {
    jobId: "job-1",
    duration_ms: 10_000,
    display_ms: 5000,
    reaction_id: "reaction-1",
    redemption_id: "redemption-1",
    is_test: false,
    media_type: "IMAGE",
    media_url: "https://cdn.test/image.png",
    sound_url: null,
    volume: 40,
    position: "CENTER",
    size_percent: 50,
};

let videoPlay: ReturnType<typeof vi.spyOn>;

vi.mock("next/navigation", () => ({ useParams: () => ({}), useSearchParams: () => new URLSearchParams() }));

function mountOverlay() {
    return render(<ReactiveRewardOverlay userId="user-1" overlayKey="secret" />);
}

const source = () => FakeEventSource.instances[0];
const send = (event: Partial<ReactionPlayEvent> = {}) => act(async () => { source().emit("reaction-play", { ...baseEvent, ...event }); });
const settle = () => act(async () => { await Promise.resolve(); });
const advance = (milliseconds: number) => act(async () => { await vi.advanceTimersByTimeAsync(milliseconds); });
const acked = () => overlayMocks.ackOverlayJobWithRetry.mock.calls.map((call) => call[2]);
const getVideo = () => document.querySelector("video") as HTMLVideoElement;

describe("reactive reward overlay", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        FakeEventSource.instances = [];
        FakeAudio.instances = [];
        FakeImage.behaviour = "resolve";
        FakeAudio.playBehaviour = "resolve";
        overlayMocks.ackOverlayJobWithRetry.mockReset().mockResolvedValue(true);
        vi.stubGlobal("EventSource", FakeEventSource);
        vi.stubGlobal("Image", FakeImage);
        vi.stubGlobal("Audio", FakeAudio);
        videoPlay = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
        vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    describe("connection", () => {
        it("connects to the owner's reactive reward stream with the overlay key", () => {
            mountOverlay();
            const url = new URL(source().url);
            expect(url.pathname).toBe("/api/v1/events/reactive-reward/user-1");
            expect(url.searchParams.get("key")).toBe("secret");
        });

        it("paints no background of its own, and gives the page back its background when it leaves", () => {
            document.body.style.background = "rgb(1, 2, 3)";
            const { unmount } = mountOverlay();
            expect(document.body.style.background).toBe("transparent");
            expect(document.documentElement.style.background).toBe("transparent");
            unmount();
            expect(document.body.style.background).toBe("rgb(1, 2, 3)");
            document.body.style.background = "";
        });

        it("closes the connection on unmount", () => {
            const { unmount } = mountOverlay();
            unmount();
            expect(source().closed).toBe(true);
        });

        it("ignores events that are not a playable reaction", async () => {
            mountOverlay();
            await act(async () => { source().emit("reaction-play", "not json"); });
            await send({ jobId: undefined });
            await send({ media_type: "GIF" as never });
            await send({ media_url: undefined });
            await advance(READY_TIMEOUT_MS + 1000);
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            expect(document.querySelector("img, video")).toBeNull();
        });
    });

    describe("an image", () => {
        it("shows only once decoded, stays for its display time, then acks", async () => {
            mountOverlay();
            FakeImage.behaviour = "pending";
            await send();
            expect(document.querySelector("img")).toBeNull();
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
        });

        it("appears after decoding and is acked when its display time is over", async () => {
            mountOverlay();
            await send();
            await settle();
            expect(document.querySelector("img")?.getAttribute("src")).toBe("https://cdn.test/image.png");
            await advance(4999);
            expect(document.querySelector("img")).not.toBeNull();
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await advance(1);
            expect(document.querySelector("img")).toBeNull();
            expect(overlayMocks.ackOverlayJobWithRetry).toHaveBeenCalledWith("reactive-reward", "user-1", "job-1", "secret");
        });

        it("is placed at its anchor and sized as configured", async () => {
            mountOverlay();
            await send({ position: "TOP_LEFT", size_percent: 30 });
            await settle();
            const image = document.querySelector("img") as HTMLImageElement;
            expect(image.style.width).toBe("30%");
            expect(image.parentElement?.className).toContain("items-start justify-start");
        });

        it("plays its sound at the configured volume next to the image", async () => {
            mountOverlay();
            await send({ sound_url: "https://cdn.test/sound.mp3", volume: 40 });
            await settle();
            expect(FakeAudio.instances).toHaveLength(1);
            expect(FakeAudio.instances[0].src).toBe("https://cdn.test/sound.mp3");
            expect(FakeAudio.instances[0].volume).toBe(0.4);
            expect(FakeAudio.instances[0].play).toHaveBeenCalled();
        });

        it("shows the image without the sound when autoplay is blocked, and still holds it for its full time", async () => {
            FakeAudio.playBehaviour = "reject";
            mountOverlay();
            await send({ sound_url: "https://cdn.test/sound.mp3" });
            await settle();
            expect(document.querySelector("img")).not.toBeNull();
            expect(screen.getByRole("button", { name: "คลิกเพื่อเปิดเสียง" })).toBeInTheDocument();
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await advance(5000);
            expect(acked()).toEqual(["job-1"]);
        });

        it("is skipped at once, without a retry, when the image fails to load", async () => {
            FakeImage.behaviour = "reject";
            mountOverlay();
            await send();
            await settle();
            expect(document.querySelector("img")).toBeNull();
            expect(acked()).toEqual(["job-1"]);
        });

        it("is skipped when it is still not ready after 8 seconds", async () => {
            FakeImage.behaviour = "pending";
            mountOverlay();
            await send();
            await advance(READY_TIMEOUT_MS - 1);
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await advance(1);
            expect(acked()).toEqual(["job-1"]);
        });
    });

    describe("a sound", () => {
        const sound = { media_type: "AUDIO" as const, media_url: "https://cdn.test/sound.mp3", display_ms: 3000 };

        it("waits until it can play, plays it, and acks when it ends", async () => {
            mountOverlay();
            await send(sound);
            expect(FakeAudio.instances[0].play).not.toHaveBeenCalled();
            await act(async () => { FakeAudio.instances[0].dispatchEvent(new Event("canplay")); });
            expect(FakeAudio.instances[0].play).toHaveBeenCalled();
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await act(async () => { FakeAudio.instances[0].dispatchEvent(new Event("ended")); });
            expect(acked()).toEqual(["job-1"]);
            expect(document.querySelector("img, video")).toBeNull();
        });

        it("is released shortly after its known length if it never reports that it ended", async () => {
            mountOverlay();
            await send(sound);
            await act(async () => { FakeAudio.instances[0].dispatchEvent(new Event("canplay")); });
            await advance(3000 + ENDED_GRACE_MS - 1);
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await advance(1);
            expect(acked()).toEqual(["job-1"]);
        });

        it("tells the queue it is done at once when autoplay is blocked, and asks for a click", async () => {
            FakeAudio.playBehaviour = "reject";
            mountOverlay();
            await send(sound);
            await act(async () => { FakeAudio.instances[0].dispatchEvent(new Event("canplay")); });
            expect(acked()).toEqual(["job-1"]);
            expect(screen.getByRole("button", { name: "คลิกเพื่อเปิดเสียง" })).toBeInTheDocument();
        });

        it("is skipped at once when the file fails to load", async () => {
            mountOverlay();
            await send(sound);
            await act(async () => { FakeAudio.instances[0].dispatchEvent(new Event("error")); });
            expect(acked()).toEqual(["job-1"]);
        });

        it("is skipped when it is not ready within 8 seconds", async () => {
            mountOverlay();
            await send(sound);
            await advance(READY_TIMEOUT_MS);
            expect(acked()).toEqual(["job-1"]);
        });
    });

    describe("a video", () => {
        const video = { media_type: "VIDEO" as const, media_url: "https://cdn.test/clip.mp4", display_ms: 12_000 };

        it("is mounted hidden, shown once it can play, and acked when it ends", async () => {
            mountOverlay();
            await send(video);
            expect(getVideo().className).toContain("opacity-0");
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            expect(getVideo().className).not.toContain("opacity-0");
            expect(videoPlay).toHaveBeenCalled();
            expect(getVideo().volume).toBe(0.4);
            expect(getVideo().muted).toBe(false);
            await act(async () => { fireEvent.ended(getVideo()); });
            expect(acked()).toEqual(["job-1"]);
            expect(getVideo()).toBeNull();
        });

        it("is never given a crossOrigin attribute, which would make the signed URL fail on CORS", async () => {
            mountOverlay();
            await send(video);
            expect(getVideo().hasAttribute("crossorigin")).toBe(false);
        });

        it("retries silently when autoplay with sound is blocked, and asks for a click", async () => {
            videoPlay.mockRejectedValueOnce(new Error("NotAllowedError")).mockResolvedValue(undefined);
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            expect(getVideo().muted).toBe(true);
            expect(getVideo().className).not.toContain("opacity-0");
            expect(screen.getByRole("button", { name: "คลิกเพื่อเปิดเสียง" })).toBeInTheDocument();
            await act(async () => { fireEvent.ended(getVideo()); });
            expect(acked()).toEqual(["job-1"]);
        });

        it("unmutes the running video when the streamer clicks for sound", async () => {
            videoPlay.mockRejectedValueOnce(new Error("NotAllowedError")).mockResolvedValue(undefined);
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            await act(async () => { fireEvent.click(screen.getByRole("button", { name: "คลิกเพื่อเปิดเสียง" })); });
            expect(getVideo().muted).toBe(false);
            expect(screen.queryByRole("button", { name: "คลิกเพื่อเปิดเสียง" })).toBeNull();
        });

        it("is skipped when it cannot play even silently", async () => {
            videoPlay.mockRejectedValue(new Error("NotAllowedError"));
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            expect(acked()).toEqual(["job-1"]);
            expect(getVideo()).toBeNull();
        });

        it("is skipped at once when the video fails to load, for example an HEVC file", async () => {
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.error(getVideo()); });
            expect(acked()).toEqual(["job-1"]);
            expect(getVideo()).toBeNull();
        });

        it("is skipped when it is not ready within 8 seconds", async () => {
            mountOverlay();
            await send(video);
            await advance(READY_TIMEOUT_MS);
            expect(acked()).toEqual(["job-1"]);
            expect(getVideo()).toBeNull();
        });

        it("is released shortly after its known length if it never reports that it ended", async () => {
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            await advance(12_000 + ENDED_GRACE_MS - 1);
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
            await advance(1);
            expect(acked()).toEqual(["job-1"]);
        });

        it("acks only once even if both the end and the safety timer arrive", async () => {
            mountOverlay();
            await send(video);
            await act(async () => { fireEvent.canPlay(getVideo()); });
            await settle();
            await act(async () => { fireEvent.ended(getVideo()); });
            await advance(20_000);
            expect(acked()).toEqual(["job-1"]);
        });
    });

    describe("several reactions", () => {
        it("stops the running one when a new job arrives, and acks it so the queue is not left waiting", async () => {
            mountOverlay();
            await send({ jobId: "job-1", sound_url: "https://cdn.test/sound.mp3" });
            await settle();
            const firstSound = FakeAudio.instances[0];
            await send({ jobId: "job-2", media_url: "https://cdn.test/second.png" });
            await settle();
            expect(firstSound.pause).toHaveBeenCalled();
            expect(document.querySelector("img")?.getAttribute("src")).toBe("https://cdn.test/second.png");
            expect(acked()).toEqual(["job-1"]);
            await advance(5000);
            expect(acked()).toEqual(["job-1", "job-2"]);
        });

        it("plays a job that is delivered twice only once", async () => {
            mountOverlay();
            await send({ jobId: "job-1" });
            await settle();
            await advance(2000);
            await send({ jobId: "job-1" });
            await settle();
            await advance(3000);
            expect(acked()).toEqual(["job-1"]);
            expect(document.querySelector("img")).toBeNull();
        });

        it("plays one after another when each is acked before the next arrives", async () => {
            mountOverlay();
            await send({ jobId: "job-1", display_ms: 1000 });
            await settle();
            await advance(1000);
            await send({ jobId: "job-2", display_ms: 1000 });
            await settle();
            await advance(1000);
            expect(acked()).toEqual(["job-1", "job-2"]);
        });

        it("stops its sound and timers when the page goes away", async () => {
            const { unmount } = mountOverlay();
            await send({ sound_url: "https://cdn.test/sound.mp3" });
            await settle();
            const sound = FakeAudio.instances[0];
            unmount();
            expect(sound.pause).toHaveBeenCalled();
            await advance(20_000);
            expect(overlayMocks.ackOverlayJobWithRetry).not.toHaveBeenCalled();
        });
    });
});
