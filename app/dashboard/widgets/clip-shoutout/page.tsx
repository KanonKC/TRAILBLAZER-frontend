import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { ClipShoutoutConfig } from "@/features/clip-shoutout/types";
import { ClipShoutoutWidget } from "@/features/clip-shoutout/components/ClipShoutoutWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "clip-shoutout";

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
    const [config, widgetType] = await Promise.all([
        getClipShoutoutConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <ClipShoutoutWidget initialConfig={config} widgetType={widgetType} />;
}
