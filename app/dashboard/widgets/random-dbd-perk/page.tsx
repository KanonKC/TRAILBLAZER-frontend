import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { RandomDbdPerkConfig } from "@/features/random-dbd-perk/types";
import { RandomDbdPerkWidget } from "@/features/random-dbd-perk/components/RandomDbdPerkWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "random-dbd-perk";

async function getRandomDbdPerkConfigServer(): Promise<RandomDbdPerkConfig | null> {
    try {
        const res = await fetchData<RandomDbdPerkConfig>("/api/v1/random-dbd-perk");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function RandomDbdPerkWidgetPage() {
    const [config, widgetType] = await Promise.all([
        getRandomDbdPerkConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <RandomDbdPerkWidget initialConfig={config} widgetType={widgetType} />;
}
