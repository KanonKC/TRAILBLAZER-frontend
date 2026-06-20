import { fetchData } from "@/lib/data-access";
import { SpotifySongRequestConfig } from "@/features/spotify-song-request/types";
import { SpotifySongRequestWidget } from "@/features/spotify-song-request/components/SpotifySongRequestWidget";
import { StaticWidgets } from "@/constants/widgets";

async function getSpotifySongRequestConfigServer(): Promise<SpotifySongRequestConfig | null> {
    try {
        const res = await fetchData<SpotifySongRequestConfig>("/api/v1/spotify-song-request");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function SpotifySongRequestPage() {
    const widget = StaticWidgets.find(w => w.slug === "spotify-song-request")
    if (widget && widget.isActive) {
        const config = await getSpotifySongRequestConfigServer();
        return <SpotifySongRequestWidget initialConfig={config} />;
    }
}
