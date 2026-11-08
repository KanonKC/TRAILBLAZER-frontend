import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import type { ReactiveRewardConfig } from "@/features/reactive-reward/types";
import { ReactiveRewardWidget } from "@/features/reactive-reward/components/ReactiveRewardWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "reactive-reward";

async function getReactiveRewardServer(): Promise<ReactiveRewardConfig | null> {
    try {
        const config = await fetchData<ReactiveRewardConfig>("/api/v1/reactive-reward");
        // Not enabled yet: the endpoint answers 404, which fetchData reports as null
        return config && !Array.isArray(config) ? config : null;
    } catch {
        return null;
    }
}

export default async function ReactiveRewardWidgetPage() {
    const [config, widgetType] = await Promise.all([getReactiveRewardServer(), getWidgetTypeMeta(SLUG)]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <ReactiveRewardWidget initialConfig={config} widgetType={widgetType} />;
}
