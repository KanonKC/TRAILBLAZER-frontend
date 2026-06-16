import { fetchData } from "@/lib/data-access";
import { SpotifySongRequestConfig } from "@/features/spotify-song-request/types";
import { SpotifySongRequestWidget } from "@/features/spotify-song-request/components/SpotifySongRequestWidget";

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
    const config = await getSpotifySongRequestConfigServer();
    return <SpotifySongRequestWidget initialConfig={config} />;
}
