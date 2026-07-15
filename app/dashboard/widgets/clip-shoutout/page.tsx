import { fetchData } from "@/lib/data-access";
import { ClipShoutoutConfig } from "@/features/clip-shoutout/types";
import { ClipShoutoutWidget } from "@/features/clip-shoutout/components/ClipShoutoutWidget";
import { WidgetTypeMeta } from "@/services/widget.service";

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
    const [config, widgetTypesData] = await Promise.all([
        getClipShoutoutConfigServer(),
        fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types"),
    ]);
    const widgetType = widgetTypesData?.data.find(w => w.slug === "clip-shoutout");
    if (!widgetType) return null;
    return <ClipShoutoutWidget initialConfig={config} widgetType={widgetType} />;
}
