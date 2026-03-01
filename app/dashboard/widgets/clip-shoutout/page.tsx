import { fetchData } from "@/lib/data-access";
import { ClipShoutoutConfig } from "@/services/clipShoutout.service";
import { ClipShoutoutWidgetClient } from "./_components/ClipShoutoutWidgetClient";

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
    return <ClipShoutoutWidgetClient initialConfig={config} />;
}
