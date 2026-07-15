import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { SpotifySongRequestConfig } from "@/features/spotify-song-request/types";
import { SpotifySongRequestWidget } from "@/features/spotify-song-request/components/SpotifySongRequestWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "spotify-song-request";

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
    const widgetType = await getWidgetTypeMeta(SLUG);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    if (!widgetType.is_active) return null;
    const config = await getSpotifySongRequestConfigServer();
    return <SpotifySongRequestWidget initialConfig={config} widgetType={widgetType} />;
}
