import { describe, expect, it, vi } from "vitest";
import { getClipShoutoutEventUrl } from "@/features/clip-shoutout/api/clipShoutout.api";
import { getDropImageEventUrl } from "@/features/drop-image/api/dropImage.api";
import { getEndCreditEventUrl } from "@/features/end-credit/api/endCredit.api";
import { getFirstWordEventUrl } from "@/features/first-word/api/firstWord.api";
import { getRandomDBDKillerEventUrl } from "@/features/random-dbd-killer/api/randomDBDKiller.api";
import { getRandomDbdPerkEventUrl } from "@/features/random-dbd-perk/api/randomDbdPerk.api";

describe("widget event URLs", () => {
    it.each([
        ["clip shoutout", getClipShoutoutEventUrl, "/api/v1/events/clip-shoutout/user-1"],
        ["drop image", getDropImageEventUrl, "/api/v1/events/drop-image/user-1"],
        ["end credit", getEndCreditEventUrl, "/api/v1/events/end-credit/user-1"],
        ["first word", getFirstWordEventUrl, "/api/v1/events/first-word/user-1"],
        ["random killer", getRandomDBDKillerEventUrl, "/api/v1/events/random-dbd-killer/user-1"],
        ["random perk", getRandomDbdPerkEventUrl, "/api/v1/random-dbd-perk/sse/user-1"],
    ])("builds %s with an optional encoded key", (_name, buildUrl, expectedPath) => {
        vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test");
        const result = new URL(buildUrl("user-1", "a&b"));
        expect(result.origin).toBe("https://api.example.test");
        expect(result.pathname).toBe(expectedPath);
        expect(result.searchParams.get("key")).toBe("a&b");
        expect(new URL(buildUrl("user-1")).search).toBe("");
        vi.unstubAllEnvs();
    });
});
