import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { RandomDBDKillerConfig } from "@/features/random-dbd-killer/types";
import { RandomDBDKillerWidget } from "@/features/random-dbd-killer/components/RandomDBDKillerWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "random-dbd-killer";

async function getRandomDBDKillerConfigServer(): Promise<RandomDBDKillerConfig | null> {
    try {
        const res = await fetchData<RandomDBDKillerConfig>("/api/v1/random-dbd-killer");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function RandomDBDKillerWidgetPage() {
    const [config, widgetType] = await Promise.all([
        getRandomDBDKillerConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <RandomDBDKillerWidget initialConfig={config} widgetType={widgetType} />;
}
