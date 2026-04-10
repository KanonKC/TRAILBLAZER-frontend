import { fetchData } from "@/lib/data-access";
import { ClipShoutoutConfig } from "@/features/clip-shoutout/types";
import { ClipShoutoutWidget } from "@/features/clip-shoutout/components/ClipShoutoutWidget";

async function getClipShoutoutConfigServer(): Promise<ClipShoutoutConfig | null> {
    try {
        const res = await fetchData<ClipShoutoutConfig>("/api/v1/clip-shoutout");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function ClipShoutoutWidgetPage() {
    const config = await getClipShoutoutConfigServer();
    return <ClipShoutoutWidget initialConfig={config} />;
}
